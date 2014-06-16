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
 * @file subscribes to data from a local MQTT broker (e.g. mosquitto). Preconditions are
 * that the broker is running at a known address and port, that the broker specification's address and port
 * are set to these known values (see {@link sample-apps/serviceSpecs/mqtt-borker-spec.json}), and that there
 * is a publisher publishing to the broker on topic 'mytopic'. To test this program, make sure the MQTT
 * broker is running and that the mqtt broker's service specification is correct. Then,
 * run {@link sample-apps/mqtt-publisher.js} and finally, run this program. If running both publisher and
 * subscriber on the same Edison, no changes are needed. Each Edison ships with an already running broker
 * and the broker specification's address and port field are preset to '127.0.0.1' and '1883'.
 */

var iecf = require('iecf');

var validator = new iecf.ServiceSpecValidator();
validator.readServiceSpecFromFile("./serviceSpecs/mqtt-broker-spec.json");

iecf.createClientForGivenService(validator.getValidatedSpec(), function (client) {

  client.comm.subscribe("mytopic");

  client.comm.setReceivedMessageHandler(function(message, context) {
    "use strict";
    console.log(message);
  });
});