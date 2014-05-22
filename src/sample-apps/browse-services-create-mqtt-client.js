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
 * @file Shows how to find and connect to an MQTT service or broker running on the LAN. First,
 * call discoverServices with the appropriate service query ({@tutorial service-query}) and then
 * call createClientForGivenService with the found service specification ({@tutorial service-spec}).
 * The preconditions are that a network connections exists, that an MQTT service (or broker) is running
 * on the LAN, and that the service is advertising appropriate service information. To run a sample of such
 * a service see {@link sample-apps/mqtt-mini-broadcast-broker.js}
 */

var edisonLib = require('iecf');

var query = new edisonLib.ServiceQuery();
query.initServiceQueryFromFile("./serviceQueries/temperatureServiceQueryMQTT.json");

edisonLib.discoverServices(query, function (serviceSpec) {
  "use strict";

  console.log("Found " + serviceSpec.type.name + " service at " +
    serviceSpec.address + ":" + serviceSpec.port + " on interface " +
    serviceSpec.networkInterface);

  edisonLib.createClientForGivenService(serviceSpec, function (client) {

    client.comm.subscribe("mytopic");

    client.comm.setReceivedMessageHandler(function(message) {
      "use strict";
      console.log(message.toString());
    });

    setInterval(function () {
      "use strict";
      client.comm.send("my message", {topic: "mytopic"});
    }, 1000);

  });
});