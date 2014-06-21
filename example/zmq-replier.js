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
 * @file ZMQ service that replies to requests. Used to test
 * a ZMQ requester. Any request string results in the reply "hi"
 * @see {@link http://zeromq.org}
 * @see {@link module:test/zmq~replier}
 */
var iecf = require('iecf');
var path = require('path');

var validator = new iecf.ServiceSpecValidator();
validator.readServiceSpecFromFile(path.join(__dirname, "serviceSpecs/temperatureServiceZMQREQREP.json"));

iecf.createService(validator.getValidatedSpec(), function (service) {
  "use strict";

  service.comm.setReceivedMessageHandler(function(client, msg, context) {
    "use strict";
    console.log(msg.toString());
    service.comm.sendTo(client, "hi");
  });

});