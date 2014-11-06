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
 * Tests the MQTT plugin using various clients. The clients assume that an MQTT broker already exists. For this
 * test suite, the mosquitto broker and a mini broker built using the iotkit library is used. The suite features clients
 * that connect directly to a broker at a known address, clients that discover a broker and connect to it, and clients
 * that connect to a broker that is being used as a proxy by another client (Essentially, this client is acting like a
 * service by using the broker as a proxy.)
 * @module test/mqtt
 * @see {@link module:test/mqtt~direct_publisher}
 * @see {@link module:test/mqtt~direct_subscriber}
 * @see {@link module:test/mqtt~discover_publisher}
 * @see {@link module:test/mqtt~discover_subscriber}
 * @see {@link module:test/mqtt~discover_direct}
 * @see {@link module:test/mqtt~client_as_a_service}
 * @see {@link module:test/mqtt~subscribe_to_client_as_a_service}
 * @see {@link module:test/mqtt~mqttMiniBroker}
 */

var path = require('path');
var expect = require('chai').expect;

describe('[mqtt]', function () {
  /**
   * Publishes data directly to (i.e. without discovering) an MQTT broker (e.g. mosquitto) on topic 'mytopic'.
   * Preconditions are that the MQTT broker is running on a known address and port, and the broker specification
   * file {@link example/serviceSpecs/mqtt-borker-spec.json} has the address and port fields
   * correctly set. No changes are needed if this program is run on the Edison. Each Edison comes with a
   * running broker and the address and port fields of the specification file are set to '127.0.0.1' and '1883'
   * (see {@tutorial service-spec-query}).
   * @function module:test/mqtt~direct_publisher
   */
  it("should successfully publish to mosquitto broker",
    function (done) {
      var iotkit = require('iotkit-comm');
      var spec = new iotkit.ServiceSpec(path.join(__dirname, "resources/specs/1883-temp-service-mqtt.json"));
      iotkit.createService(spec, function (client) {
        setInterval(function () {
          client.comm.send("my other message");
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
   * (see {@tutorial service-spec-query}).
   * @function module:test/mqtt~direct_subscriber
   */
  it("should successfully subscribe to data from mosquitto broker",
    function (done) {
      var iotkit = require('iotkit-comm');

      var spec = new iotkit.ServiceQuery(path.join(__dirname, "resources/queries/temp-service-query-mqtt.json"));
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