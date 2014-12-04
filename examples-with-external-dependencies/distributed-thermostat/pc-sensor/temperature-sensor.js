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

var iotkit = require('iotkit-comm');
var spec = new iotkit.ServiceSpec('temperature-sensor-spec.json');
iotkit.createService(spec, function (service) {
  setInterval(function () {
    var t = getRandomInt(65, 90);
    console.log(t);
    service.comm.send(t);
  }, 1000);
});

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}