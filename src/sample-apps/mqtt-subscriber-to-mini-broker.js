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
 * @file subscribes to data from the mini broadcast broker (see {@link sample-apps/mqtt-mini-broadcast-broker.js}). To
 * test this program, make sure the mini broker and the publisher
 * (see {@link sample-apps/mqtt-publisher-to-mini-broker.js}) are running somewhere on the same LAN.
 */

var edisonLib = require("edisonapi");

var query = new edisonLib.ServiceQuery();
query.initServiceQueryFromFile("./serviceQueries/mqtt-mini-broker-query.json");

edisonLib.createClient(query, serviceFilter, function (client) {

    client.comm.subscribe("mytopic");

    client.comm.setReceivedMessageHandler(function(message, context) {
        "use strict";
        console.log(message);
    });

});

function serviceFilter (serviceRecord) {
    "use strict";
    return true;
}