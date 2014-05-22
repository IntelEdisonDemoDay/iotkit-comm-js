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
 * @file Client subscribes to temperature data from a temperature service. To test this program, first run
 * {@link sample-apps/mqtt-publisher-advertise-broker-as-proxy.js}, then run this program somewhere on the
 * same LAN.
 */

var edisonLib = require("edisonapi");

var query = new edisonLib.ServiceQuery();
query.initServiceQueryFromFile("./serviceQueries/temperatureServiceQueryMQTT.json");

edisonLib.createClient(query, serviceFilter, function (client) {

    client.comm.subscribe(client.spec.name);

    client.comm.setReceivedMessageHandler(function(message, context) {
        "use strict";
        console.log(message);
    });

});

function serviceFilter (serviceRecord) {
    "use strict";
    return true;
}