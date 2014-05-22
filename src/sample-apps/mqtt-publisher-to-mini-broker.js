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
 * @file publishes data to the mini broadcast broker (see {@link sample-apps/mqtt-mini-broadcast-broker.js}). To test,
 * make sure the mini broker is running somewhere on the LAN.
 */

var iecf = require('iecf');

var query = new iecf.ServiceQuery();
query.initServiceQueryFromFile("./serviceQueries/mqtt-mini-broker-query.json");

iecf.createClient(query, serviceFilter, function (client) {

  setInterval(function () {
    "use strict";
    client.comm.send("my other message", {topic: "mytopic"});
  }, 1000);

});

function serviceFilter (serviceRecord) {
    "use strict";
    return true;
}