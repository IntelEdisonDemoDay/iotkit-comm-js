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

/**
 * Tests mDNS service discovery and advertisement.
 * @module test/mdns
 * @see {@link module:test/mdns~discover}
 * @see {@link module:test/mdns~discover_connect}
 * @see {@link module:test/mdns~dummyService}
 */

var path = require('path');
var expect = require('chai').expect;

describe('[mdns][sanity]', function () {
  /**
   * Dummy service to test mDNS service discovery and advertisement. This service is a mini MQTT broadcast
   * broker.
   * @see {@link module:test/mdns~discover}
   * @see {@link module:test/mdns~discover_connect}
   * @function module:test/mdns~dummyService
   */
  function dummyService() {
    var iotkit = require('iotkit-comm');
    var path = require('path');
    var spec = new iotkit.ServiceSpec(path.join(__dirname, "resources/specs/1886-dummy-service-zmq-pubsub.json"));
    iotkit.createService(spec, function (service) {
      setInterval(function () {
        service.comm.send("my message");
      }, 300);
    });
  }

  before(function () {
    dummyService();
  });

  describe('#discover', function () {
    /**
     * Tests if a service can be found on the LAN. Expects a dummy service to be running on the LAN
     * and advertising itself. So this test actually tests both advertising and discovery.
     * @function module:test/mdns~discover
     */
    it("should be able to find a service for the given query", function (done) {
      var iotkit = require('iotkit-comm');
      var serviceDirectory = new iotkit.ServiceDirectory();
      var query = new iotkit.ServiceQuery(path.join(__dirname, "resources/queries/dummy-service-query-zmq-pubsub.json"));
      serviceDirectory.discoverServices(query, function (serviceSpec) {
        expect(serviceSpec.properties.dataType).to.equal("float");
        done();
      });
    });
  });

  describe('#discover-connect', function () {
    /**
     * Tests if a service can be found and connected to on the LAN. Expects a dummy service to be
     * running on the LAN and advertising itself. Notice that in iotkit, no explicit IP
     * addresses or protocol-specific code is needed to connect to a service. Connecting to a service of
     * a given type requires only that the service query mention that type.
     * @function module:test/mdns~discover_connect
     * @see {@tutorial service-spec-query}
     */
    it("should be able to find a service for the given query and connect to it", function (done) {
      var iotkit = require('iotkit-comm');
      var serviceDirectory = new iotkit.ServiceDirectory();
      var query = new iotkit.ServiceQuery(path.join(__dirname, "resources/queries/dummy-service-query-zmq-pubsub.json"));
      serviceDirectory.discoverServices(query, function (serviceSpec) {
        expect(serviceSpec.properties.dataType).to.equal("float");
        iotkit.createClient(serviceSpec, function (client) {
          client.comm.setReceivedMessageHandler(function (message, context) {
            expect(context.event).to.equal("message");
            expect(message.toString()).to.equal("my message");
            // close client connection
            client.comm.done();
            done();
          });
        });
      });
    });
  });

});