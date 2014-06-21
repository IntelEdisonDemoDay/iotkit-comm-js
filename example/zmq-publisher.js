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
 * @file ZMQ service that publishes data on topic "mytopic". Used to test
 * a ZMQ subscriber.
 * @see {@link http://zeromq.org}
 * @see {@link module:test/zmq~subscriber}
 */
var iecf = require('iecf');
var path = require('path');

var validator = new iecf.ServiceSpecValidator();
validator.readServiceSpecFromFile(path.join(__dirname, "serviceSpecs/temperatureServiceZMQPUBSUB.json"));

iecf.createService(validator.getValidatedSpec(), function (service) {
  "use strict";

  setInterval(function () {
    "use strict";
    service.comm.publish("mytopic: my message", {});
  }, 300);

});