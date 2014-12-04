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
var mraa = require('mraa'); // for fan control


// fan control
var fanTemperatureThreshold = 73;
var fanOn = false;
var fan = new mraa.Gpio(2);
fan.dir(mraa.DIR_OUT); // gpio direction

// create the service that will publish the mean temperature locally
var spec = new iotkit.ServiceSpec('thermostat-spec.json');
iotkit.createService(spec, function (service) {

  // stores mean of temperatures received from sensors
  var sampleCount = 0, mean = 0;

  // gather temperature samples from sensors
  var sensorQuery = new iotkit.ServiceQuery('temperature-sensor-query.json');
  iotkit.createClient(sensorQuery, function (client) {
    client.comm.setReceivedMessageHandler(function (currTemperature) {
      console.log("from: " + client.spec.address + "," + " received: " + currTemperature);

      // compute mean
      mean = (parseInt(currTemperature) + sampleCount * mean) / (sampleCount + 1);
      sampleCount++;

      // publish mean temperature
      console.log("mean: " + mean);
      service.comm.send(JSON.stringify(
        {last_sensor: client.spec.address,
         last_val: currTemperature,
         curr_mean: mean.toString()}));

      // control fan here
      if (mean > fanTemperatureThreshold) {
        if (!fanOn) {
          fanOn = true; console.log("fan on");
          fan.write(fanOn?1:0);
        }
      } else {
        if (fanOn) {
          fanOn = false; console.log("fan off");
          fan.write(fanOn?1:0);
        }
      }
    });
  });
});

