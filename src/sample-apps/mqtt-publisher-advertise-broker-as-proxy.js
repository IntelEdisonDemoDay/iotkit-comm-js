/**
 * <insert one-line description of what the program does>
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
var edisonLib = require("edisonapi");

var validator = new edisonLib.ServiceSpecValidator();
validator.readServiceSpecFromFile("./serviceSpecs/temperatureService-VIA-BROKER.json");
var validatedSpec = validator.getValidatedSpec();

edisonLib.advertiseService(validatedSpec);

edisonLib.createClientForGivenService(validatedSpec, function (client) {

  setInterval(function () {
    "use strict";
    client.comm.send("my other message", {topic: "mytopic"});
  }, 1000);

});
