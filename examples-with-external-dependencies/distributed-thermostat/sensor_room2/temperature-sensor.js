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
var upmGrove = require('jsupm_grove');

var spec = new iotkit.ServiceSpec('temperature-sensor-spec.json');
iotkit.createService(spec, function (service) {
  var temperatureSensor = new upmGrove.GroveTemp(0);
  setInterval(function () {
    console.log(toF(temperatureSensor.value()));
    service.comm.send(toF(temperatureSensor.value()));
    //console.log(65);
    //service.comm.send(65);
  }, 2000);
});

function toF(c) {
  var f = c * 2 + 30;
  return f;
}
