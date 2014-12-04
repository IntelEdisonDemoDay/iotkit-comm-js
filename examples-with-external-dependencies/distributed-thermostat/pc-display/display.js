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
var thermostatQuery = new iotkit.ServiceQuery('thermostat-query.json');
iotkit.createClient(thermostatQuery, function (client) {
  client.comm.setReceivedMessageHandler(function (msg) {
    console.log("received: " + msg);

    // to display
    var show = JSON.parse(msg);
    console.log(show.last_sensor + "=" + show.last_val);
    console.log(show.curr_mean);
  });
});
