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
 * Created by Pradeep.
 */
var edisonLib = require('edisonapi');

var validator = new edisonLib.ServiceSpecValidator();
validator.readServiceSpecFromFile("./serviceSpecs/temperatureServiceIoTKit.json");

var i = 0;
var msg = "";
edisonLib.createClientForGivenService(validator.getValidatedSpec(), function (client) {
    "use strict";

    client.comm.subscribe();

    client.comm.setReceivedMessageHandler(function(message, context) {
        "use strict";
        console.log(message);
    });

});