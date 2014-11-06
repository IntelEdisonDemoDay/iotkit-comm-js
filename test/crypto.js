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
var fs = require('fs');
var path = require('path');
var expect = require('chai').expect;

describe('[crypto]', function () {

  /**
   * ZMQ service that securely publishes data on topic "mytopic". Used to test
   * a ZMQ subscriber.
   * @see {@link http://zeromq.org}
   * @see {@link module:test/zmq~subscriber}
   */
  function securePublisher() {
    var iotkit = require('iotkit-comm');
    var path = require('path');
    var spec = new iotkit.ServiceSpec(path.join(__dirname, "resources/specs/1887-temp-service-zmq-pubsub-secure.json"));
    iotkit.createService(spec, function (service) {
      setInterval(function () {
        service.comm.send("my message");
      }, 300);
    });
  }

  before(function () {
    securePublisher();
  });

  describe('#credentials', function () {
    it ("should find all credentials", function (done) {
      var Crypto = require('iotkit-comm').Crypto;
      var c = new Crypto();
      done();
    });

    it ("should successfully access all credentials", function (done) {
      var Crypto = require('iotkit-comm').Crypto;
      var c = new Crypto();
      fs.readFileSync(c.getCA_SSLCert());
      fs.readFileSync(c.getHostPublicKey());
      fs.readFileSync(c.getHostPrivateKey());
      fs.readFileSync(c.getHostSSHCert());
      fs.readFileSync(c.getHostSSLCert());
      fs.readFileSync(c.getUserPrivateKey());
      fs.readFileSync(c.getUserPublicKey());
      fs.readFileSync(c.getUserSSHCert());
      fs.readFileSync(c.getUserSSLCert());
      done();
    });
  });

  describe('#zmq', function () {
    /**
     * Securely subscribes to topic "mytopic" from a ZMQ publisher.
     * @see {@link example/zmq-publisher.js}
     * @function module:test/zmq~subscriber
     */
    it("should securely subscribe to messages from ZMQ publisher",
      function(done) {
        var iotkit = require('iotkit-comm');
        var query = new iotkit.ServiceQuery(path.join(__dirname, "resources/queries/temp-service-query-zmq-pubsub-secure.json"));
        iotkit.createClient(query, function (client) {
            client.comm.setReceivedMessageHandler(function(message, context) {
              expect(context.event).to.equal("message");
              expect(message.toString()).to.equal("my message");
              // close client connection
              client.comm.done();
              done();
            });
          });
      });
  });

  describe('#mqtt', function () {
    /**
     * Publishes data securely to (i.e. without discovering) an MQTT broker (e.g. mosquitto) on topic 'mytopic'.
     * Preconditions are that the MQTT broker is running on a known address and port, and the broker specification
     * file {@link example/serviceSpecs/mqtt-borker-spec.json} has the address and port fields
     * correctly set. No changes are needed if this program is run on the Edison. Each Edison comes with a
     * running broker and the address and port fields of the specification file are set to '127.0.0.1' and '1883'
     * (see {@tutorial service-spec-query}).
     * @function module:test/mqtt~direct_publisher
     */
    it("should securely publish to mosquitto broker",
      function (done) {
        var iotkit = require('iotkit-comm');
        var spec = new iotkit.ServiceSpec(path.join(__dirname, "resources/specs/1888-temp-service-mqtt-secure.json"));
        iotkit.createService(spec, function (client) {
          setInterval(function () {
            client.comm.send("my other message");
          }, 200);
          done();
        });
      });

    /**
     * Subscribes to data securely from (i.e. without discovering) an MQTT broker (e.g. mosquitto) on topic 'mytopic'.
     * Preconditions are that the MQTT broker is running on a known address and port, and the broker specification
     * file {@link example/serviceSpecs/mqtt-borker-spec.json} has the address and port fields
     * correctly set. No changes are needed if this program is run on the Edison. Each Edison comes with a
     * running broker and the address and port fields of the specification file are set to '127.0.0.1' and '1883'
     * (see {@tutorial service-spec-query}).
     * @function module:test/mqtt~direct_subscriber
     */
    it("should securely subscribe to data from mosquitto broker",
      function (done) {
        var iotkit = require('iotkit-comm');

        var spec = new iotkit.ServiceQuery(path.join(__dirname, "resources/queries/temp-service-query-mqtt-secure.json"));
        iotkit.createClient(spec, function (client) {
          client.comm.setReceivedMessageHandler(function (message, context) {
            expect(context.event).to.equal("message");
            expect(message).to.equal("my other message");
            client.comm.done();
            done();
          });
        });
      });
  });
});