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
var edisonLib = require('iecf');

var validator = new edisonLib.ServiceSpecValidator();
validator.readServiceSpecFromFile("./serviceSpecs/temperatureServiceZMQREQREP.json");

edisonLib.createService(validator.getValidatedSpec(), function (service) {
  "use strict";

  service.comm.setReceivedMessageHandler(function(client, msg, context) {
    "use strict";
    console.log(msg.toString());
    service.comm.sendTo(client, "hi");
  });

});