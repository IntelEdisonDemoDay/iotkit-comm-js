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

/**
 * Tests interaction (authentication, data publication etc.) with the cloud.
 * @module test/cloud
 * @see {@link module:test/cloud~publish|test publishing data to cloud}
 * @see {@link module:test/cloud~subscribe|test subscribing to data from cloud}
 */

var expect = require('chai').expect;
var path = require('path');

describe('[cloud]', function () {

  describe('[publish]', function () {
    /**
     * @function module:test/cloud~publish
     */
    it("should successfully publish data to the cloud", function(done) {
      var iotkit = require('iotkit-comm');
      var spec = new iotkit.ServiceSpec(path.join(__dirname, "resources/specs/1884-temp-service-enableiot-cloud.json"));
      iotkit.createService(spec, function (service) {
        setInterval(function () {
          service.comm.send(68);
        }, 500);
        done();
      });
    });
  });

  describe('[subscribe]', function () {
    /**
     * @function module:test/cloud~subscribe
     */
    it("should successfully subscribe to data from the cloud", function(done) {
      var iotkit = require('iotkit-comm');
      var spec = new iotkit.ServiceSpec(path.join(__dirname, "resources/specs/1884-temp-service-enableiot-cloud.json"));
      iotkit.createClient(spec, function (client) {
        client.comm.setReceivedMessageHandler(function(message, context) {
          expect(message).to.equal('68');
          client.comm.done();
          done();
        });
      });
    });
  });

});
