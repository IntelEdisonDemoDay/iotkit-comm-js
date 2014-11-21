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
 * @file A dummy 'dashboard' to display mean temperature received from
 * the thermostat. In this example, the thermostat is receiving temperatures
 * published periodically by sensors and computing a cumulative mean of the
 * temperature data. The latest mean is then published as and when it is computed
 * @see {@link example/distributed-thermostat/thermostat.js}
 */

var iotkit = require('iotkit-comm');

// create service query to find the thermostat
var thermostatQuery = new iotkit.ServiceQuery('thermostat-query.json');

// create a client that subscribes to the mean temperature
// from the thermostat
iotkit.createClient(thermostatQuery, function (client) {
  client.comm.setReceivedMessageHandler(msgHandler);
});

// print mean temperature received from the thermostat
function msgHandler(msg) {
  console.log("Received mean temperature " + msg);
}