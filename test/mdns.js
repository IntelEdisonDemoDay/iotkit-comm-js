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
 *
 * Created by adua.
 */

/** @module test/mdns */

/**
 * @file Tests mdns service discovery and advertisement.
 * @see {@link module:test/mdns~browse}
 * @see {@link module:test/mdns~browse_connect}
 * @see {@link module:test/mdns~dummyService}
 */

var path = require('path');

describe('[mdns]', function () {

  /**
   * Dummy service to test mdns service discovery and advertisement. This service is a mini MQTT broadcast
   * broker.
   * @see {@link module:test/mdns~browse}
   * @see {@link module:test/mdns~browse_connect}
   */
  function dummyService () {
    var path = require('path');
    var iecf = require('iecf');

    var validator = new iecf.ServiceSpecValidator();
    validator.readServiceSpecFromFile(path.join(__dirname, "resources/serviceSpecs/9889-dummy-service-spec.json"));

    iecf.createService(validator.getValidatedSpec(), function (service) {
      "use strict";

      var clients = {};

      service.comm.setReceivedMessageHandler(function(client, msg, context) {
        "use strict";
        switch (context.event) {
          case 'connect':
            clients[msg.clientId] = client;
            service.comm.sendTo(client, msg, {ack: 'connack'});
            break;
          case 'publish':
            for (var clientId in clients) {
              if (!clients.hasOwnProperty(clientId))
                continue;
              service.comm.sendTo(clients[clientId], msg);
            }
            break;
          case 'subscribe':
            service.comm.sendTo(client, msg, {ack: 'suback'});
            break;
          case 'close':
            for (var clientId in clients) {
              if (!clients.hasOwnProperty(clientId))
                continue;
              if (clients[clientId] == client) {
                delete clients[clientId];
              }
            }
            break;
          case 'pingreq':
            service.comm.sendTo(client, msg, {ack: 'pingresp'});
            break;
          case 'disconnect':
          case 'error':
            service.comm.manageClient(client, {action: 'endstream'});
            break;
          default:
            console.log(context.event);
        }
      });
    });
  }

  before(function () {
    dummyService();
  });

  // The mdns browser returns all new services it finds. This means, that once it
  // finds a service record, it won't find it again unless that service went down and came back up.
  // Since the service we want to discover is not restarted between tests, just restart the
  // service browser for each test.
  beforeEach(function() {
    var iecf = require('iecf');
    iecf.stopDiscoveringServices();
  });

  describe('#browse', function () {
    /**
     * Tests if a service can be found on the LAN. Expects a dummy service to be running on the LAN
     * and advertising itself. So this test actually tests both advertising and discovery.
     * @function module:test/mdns~browse
     */
    it("should be able to find a service for the given query", function(done) {
      var iecf = require('iecf');

      var query = new iecf.ServiceQuery();
      query.initServiceQueryFromFile(path.join(__dirname, "resources/serviceQueries/dummy-service-query.json"));

      iecf.discoverServices(query, function (serviceSpec) {
        "use strict";
        done();
      });
    });
  });

  describe('#browse-connect', function () {
    /**
     * Tests if a service can be found and connected to on the LAN. Expects a dummy service to be
     * running on the LAN and advertising itself. Notice that in IECF, no explicit IP
     * addresses or protocol specific code is needed to connect to a service. Connecting to a service of
     * a given type requires only that the service query mention that type.
     * @function module:test/mdns~browse_connect
     * @see {@tutorial service-query}
     */
    it("should be able to find a service for the given query and connect to it", function(done) {
      var iecf = require('iecf');

      var query = new iecf.ServiceQuery();
      query.initServiceQueryFromFile(path.join(__dirname, "resources/serviceQueries/dummy-service-query.json"));

      iecf.discoverServices(query, function (serviceSpec) {
        "use strict";
        iecf.createClientForGivenService(serviceSpec, function (client) {

          client.comm.subscribe("mytopic");

          client.comm.setReceivedMessageHandler(function(message) {
            "use strict";
          });

          // client publishes message to a topic it subscribed to. The client will thus
          // get this message back from the MQTT broker. See test cases in test/mqtt.js
          setInterval(function () {
            "use strict";
            client.comm.send("my message", {topic: "mytopic"});
          }, 1000);
          done();
        });
      });
    });
  });

});