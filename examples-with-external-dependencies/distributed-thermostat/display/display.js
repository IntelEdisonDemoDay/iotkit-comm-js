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

// init display
var jsupm_i2clcd = require('jsupm_i2clcd');
var display = new jsupm_i2clcd.Jhd1313m1(0, 0x3E, 0x62);

// create the service that will publish the latest temperature
var spec = new iotkit.ServiceSpec('cloud-publisher-spec.json');
iotkit.createService(spec, function (service) {
  var thermostatQuery = new iotkit.ServiceQuery('thermostat-query.json');
  iotkit.createClient(thermostatQuery, function (client) {
    client.comm.setReceivedMessageHandler(function (msg) {
      console.log("received: " + msg);

      // to display
      var show = JSON.parse(msg);
      display.setCursor(0,0);
      display.write(show.last_sensor + "=" + show.last_val);
      display.setCursor(1,0);
      display.write(show.curr_mean);

      // to cloud
      service.comm.send(show.curr_mean);
    });
  });
});
