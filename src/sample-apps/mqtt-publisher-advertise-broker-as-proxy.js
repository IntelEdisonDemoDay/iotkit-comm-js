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
 * @file Client publishes temperature data to a local broker and advertises itself as a temperature service
 * by using the broker as a proxy. To test this program, make sure the local broker is running on port '1883',
 * then run {@link sample-apps/mqtt-subscriber-discovers-borker-as-proxy.js}, and finally run this program. Note:
 * on the Edison, a local broker should already be running on port '1883'.
 */

var edisonLib = require("edisonapi");

var validator = new edisonLib.ServiceSpecValidator();
validator.readServiceSpecFromFile("./serviceSpecs/temperatureService-VIA-BROKER.json");
var validatedSpec = validator.getValidatedSpec();

edisonLib.advertiseService(validatedSpec);

edisonLib.createClientForGivenService(validatedSpec, function (client) {

  setInterval(function () {
    "use strict";
    client.comm.send("30 deg F", {topic: validatedSpec.name});
  }, 1000);

});
