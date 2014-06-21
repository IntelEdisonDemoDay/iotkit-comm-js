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
 * @see {@link module:test/mdns~browse|test service browser}
 */

var path = require('path');
var spawn = require('child_process').spawn;
var dummyservice;

describe('[mdns]', function () {

  before(function () {
    "use strict";
    dummyservice = spawn('node', [path.join(__dirname, '../example/dummy-service-for-mdns-tests.js')]);
  });

  after(function() {
    "use strict";
    dummyservice.kill();
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
      query.initServiceQueryFromFile(path.join(__dirname, "../example/serviceQueries/dummy-service-query.json"));

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
      query.initServiceQueryFromFile(path.join(__dirname, "../example/serviceQueries/dummy-service-query.json"));

      iecf.discoverServices(query, function (serviceSpec) {
        "use strict";
        iecf.createClientForGivenService(serviceSpec, function (client) {

          client.comm.subscribe("mytopic");

          client.comm.setReceivedMessageHandler(function(message) {
            "use strict";
            console.log(message.toString());
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