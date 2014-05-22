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
 * @file Shows how to discover services running on the LAN. This takes two basic steps:
 * first, create a service query; second, call discoverServices with the service query
 * as input. The only precondition is that a network connection exists. If another service
 * on the LAN is advertising service information that matches the query, then that information
 * will be returned in the serviceSpec argument of the callback to discoverServices
 * ({@tutorial service-spec}).
 */
var iecf = require('iecf');

var query = new iecf.ServiceQuery();
query.initServiceQueryFromFile("./serviceQueries/temperatureServiceQueryMQTT.json");

iecf.discoverServices(query, function (serviceSpec) {
  "use strict";

  console.log("Found " + serviceSpec.type.name + " service at " +
    serviceSpec.address + ":" + serviceSpec.port + " on interface " +
    serviceSpec.networkInterface);

});