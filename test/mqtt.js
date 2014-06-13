/*
 * Copyright (c) 2014, Intel Corporation.
 *
 * This program is free software; you can redistribute it and/or modify it
 * under the terms and conditions of the GNU Lesser General Public License,
 * version 2.1, as published by the Free Software Foundation.
 *
 * This program is distributed in the hope it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for
 * more details.
 */

/** @module test/mqtt */

/**
 * @file Tests the mqtt plugin using various clients. The clients assume that an mqtt broker already exists. For this
 * test suite, the mosquitto broker and a mini broker built using the iecf library is used. The suite features clients
 * that connect directly to a broker at a known address, clients that discover a broker and connect to it, and clients
 * that connect to a broker that is being used as a proxy by another client (essentially this client is acting like a
 * service by using the broker as a proxy).
 * @see {@link module:test/mqtt~direct_publisher}
 * @see {@link module:test/mqtt~direct_subscriber}
 * @see {@link module:test/mqtt~discover_publisher}
 * @see {@link module:test/mqtt~discover_subscriber}
 * @see {@link module:test/mqtt~discover_direct}
 * @see {@link module:test/mqtt~client_as_a_service}
 * @see {@link module:test/mqtt~subscribe_to_client_as_a_service}
 */

var path = require('path');
var spawn = require('child_process').spawn;
var expect = require('chai').expect;

var minibroker;

describe('[mqtt]', function () {

  before(function () {
    "use strict";
    minibroker = spawn('node', [path.join(__dirname, '../example/mqtt-mini-broadcast-broker.js')]);
  });

  after(function() {
    "use strict";
    minibroker.kill();
  });

  describe('#direct', function () {
    /**
     * Publishes data directly to (i.e. without discovering) an MQTT broker (e.g. mosquitto) on topic 'mytopic'.
     * Preconditions are that the MQTT broker is running on a known address and port, and the broker specification
     * file {@link example/serviceSpecs/mqtt-borker-spec.json} has the address and port fields
     * correctly set. No changes are needed if this program is run on the Edison. Each Edison comes with a
     * running broker and the address and port fields of the specification file are set to '127.0.0.1' and '1883'
     * (see {@tutorial service-spec}).
     * @function module:test/mqtt~direct_publisher
     */
    it("should successfully publish to mosquitto broker",
      function(done) {
        var iecf = require('iecf');

        var validator = new iecf.ServiceSpecValidator();
        validator.readServiceSpecFromFile(path.join(__dirname, "../example/serviceSpecs/mqtt-broker-spec.json"));

        iecf.createClientForGivenService(validator.getValidatedSpec(), function (client) {
          setInterval(function () {
            "use strict";
            client.comm.send("my other message", {topic: "mytopic"});
          }, 200);
          done();
        });
      });

    /**
     * Subscribes to data directly from (i.e. without discovering) an MQTT broker (e.g. mosquitto) on topic 'mytopic'.
     * Preconditions are that the MQTT broker is running on a known address and port, and the broker specification
     * file {@link example/serviceSpecs/mqtt-borker-spec.json} has the address and port fields
     * correctly set. No changes are needed if this program is run on the Edison. Each Edison comes with a
     * running broker and the address and port fields of the specification file are set to '127.0.0.1' and '1883'
     * (see {@tutorial service-spec}).
     * @function module:test/mqtt~direct_subscriber
     */
    it("should successfully subscribe to data from mosquitto broker",
      function(done) {
        var iecf = require('iecf');

        var validator = new iecf.ServiceSpecValidator();
        validator.readServiceSpecFromFile(path.join(__dirname, "../example/serviceSpecs/mqtt-broker-spec.json"));

        iecf.createClientForGivenService(validator.getValidatedSpec(), function (client) {

          client.comm.subscribe("mytopic");

          client.comm.setReceivedMessageHandler(function(message, context) {
            "use strict";
            expect(context.event).to.equal("message");
            expect(context.topic).to.equal("mytopic");
            expect(message).to.equal("my other message");
            client.comm.done();
            done();
          });
        });
      });
  });

  describe('#discover_direct', function () {
    /**
     * Shows how to find and connect to an MQTT service or broker running on the LAN. Uses single client. First,
     * call discoverServices with the appropriate service query ({@tutorial service-query}) and then
     * call createClientForGivenService with the found service specification ({@tutorial service-spec}).
     * The preconditions are that a network connections exists, that an MQTT service (or broker) is running
     * on the LAN, and that the service is advertising appropriate service information. To run a sample of such
     * a service see {@link example/mqtt-mini-broadcast-broker.js}
     * @function module:test/mqtt~discover_direct
     */
    it("should successfully discover and interact with mini broker using one client",
      function(done) {
        var iecf = require('iecf');

        var query = new iecf.ServiceQuery();
        query.initServiceQueryFromFile(path.join(__dirname, "../example/serviceQueries/mqtt-mini-broker-query.json"));

        // explicitly discover service first. This can be skipped; see other tests that show
        // how to discover and connect automatically.
        iecf.discoverServices(query, function (serviceSpec) {
          "use strict";

          // once service has been discovered, connect to it
          iecf.createClientForGivenService(serviceSpec, function (client) {

            // client subscribes to a topic
            client.comm.subscribe("mytopic");

            client.comm.setReceivedMessageHandler(function(message, context) {
              "use strict";
              // if client receives message it published on the topic
              // it subscribed to, then test passes.
              expect(context.event).to.equal("message");
              expect(context.topic).to.equal("mytopic");
              expect(message).to.equal("my message");

              // close client connection
              client.comm.done();
              done();
            });

            // client publishes to topic it previously subscribed to
            client.comm.send("my message", {topic: "mytopic"});

          });

        });
      });
  });

  describe('#discover', function() {

    // The mdns browser returns all new services it finds. This means, that once it
    // finds a service record, it won't find it again unless that service went down and came back up.
    // Since the service we want to discover is not restarted between tests, just restart the
    // service browser for each test.
    beforeEach(function() {
      var iecf = require('iecf');
      iecf.stopDiscoveringServices();
    });

    /**
     * Discovers and publishes data to the mini broadcast broker.
     * Prerequisite is that the mini broker is running on the LAN.
     * @function module:test/mqtt~discover_publisher
     * @see {@link example/mqtt-mini-broadcast-broker.js}
     */
    it("should discover and publish data to mini broker",
      function(done) {
        var iecf = require('iecf');

        var query = new iecf.ServiceQuery();
        query.initServiceQueryFromFile(path.join(__dirname, "../example/serviceQueries/mqtt-mini-broker-query.json"));

        iecf.createClient(query, serviceFilter, function (client) {
          setInterval(function () {
            "use strict";
            client.comm.send("my other other message", {topic: "mytopic"});
          }, 200);

          done();
        });

        function serviceFilter (serviceRecord) {
          "use strict";
          return true;
        }
      });

    /**
     * Discovers and subscribes to data from mini broadcast broker. Prerequisite is that
     * the mini broker is running on the LAN.
     * @function module:test/mqtt~discover_subscriber
     * @see {@link example/mqtt-mini-broadcast-broker.js}
     */
    it("should discover and subscribe to data from mini broker",
      function (done) {
        var iecf = require('iecf');

        var query = new iecf.ServiceQuery();
        query.initServiceQueryFromFile(path.join(__dirname, "../example/serviceQueries/mqtt-mini-broker-query.json"));

        iecf.createClient(query, serviceFilter, function (client) {

          client.comm.subscribe("mytopic");

          client.comm.setReceivedMessageHandler(function(message, context) {
            "use strict";
            expect(context.event).to.equal("message");
            expect(context.topic).to.equal("mytopic");
            expect(message).to.equal("my other other message");

            // close client connection
            client.comm.done();
            done();
          });

        });

        function serviceFilter (serviceRecord) {
          "use strict";
          return true;
        }
      });
  });

  describe('#advertise-broker-as-service', function() {
    /**
     * Client publishes temperature data to a local broker and advertises itself as a temperature service.
     * The client does this by using the broker as a proxy. Make sure the local broker is running on port '1883'.
     * Note: on the Edison, a local broker should already be running on port '1883'.
     * @function module:test/mqtt~client_as_a_service
     */
    it("should allow a client to act like a server by advertising the broker as a proxy",
      function(done) {
        var iecf = require('iecf');

        var validator = new iecf.ServiceSpecValidator();
        validator.readServiceSpecFromFile(
          path.join(__dirname, "../example/serviceSpecs/temperatureService-VIA-BROKER.json"));
        var validatedSpec = validator.getValidatedSpec();

        iecf.advertiseService(validatedSpec);

        iecf.createClientForGivenService(validatedSpec, function (client) {
          setInterval(function () {
            "use strict";
            client.comm.send("30 deg F", {topic: validatedSpec.name});
          }, 200);
          done();
        });
      });

    /**
     * Client subscribes to temperature data from a temperature service. The temperature service in this case
     * is a client that is acting like a service by advertising the broker on the LAN as its proxy. This client, the
     * one that is subscribing, is oblivious of that fact.
     * @function module:test/mqtt~subscribe_to_client_as_a_service
     * @see {@link module:test/mqtt~client_as_a_service}
     */
    it("should allow a client to subscribe to data from another client acting as a service by advertising the " +
      "broker as its proxy",
      function (done) {
        var iecf = require('iecf');

        var query = new iecf.ServiceQuery();
        query.initServiceQueryFromFile(
          path.join(__dirname, "../example/serviceQueries/temperatureServiceQueryMQTT.json"));

        iecf.createClient(query, serviceFilter, function (client) {
          client.comm.subscribe(client.spec.name);
          client.comm.setReceivedMessageHandler(function(message, context) {
            "use strict";
            expect(context.event).to.equal("message");
            expect(context.topic).to.equal(client.spec.name);
            expect(message).to.equal("30 deg F");

            // close client connection
            client.comm.done();
            done();
          });
        });

        function serviceFilter (serviceRecord) {
          "use strict";
          return true;
        }
      });
  });
});