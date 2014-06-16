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
 * @file publishes data to an MQTT broker (e.g. mosquitto) on topic 'mytopic'. Preconditions
 * are that the MQTT broker is running on a known address and port, and the broker specification
 * file {@link sample-apps/serviceSpecs/mqtt-borker-spec.json} has the address and port fields
 * correctly set. No changes are needed if this program is run on the Edison. Each Edison comes with a
 * running broker and the address and port fields of the specification file are set to '127.0.0.1' and '1883'.
 */

var iecf = require('iecf');

var validator = new iecf.ServiceSpecValidator();
validator.readServiceSpecFromFile("./serviceSpecs/mqtt-broker-spec.json");

iecf.createClientForGivenService(validator.getValidatedSpec(), function (client) {

  setInterval(function () {
    "use strict";
    client.comm.send("my other message", {topic: "mytopic"});
  }, 1000);

});
