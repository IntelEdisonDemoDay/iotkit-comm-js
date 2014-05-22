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
var path = require('path');

var spawn = require('child_process').spawn;

var mqttservice;

describe('[browse-services]', function () {

  before(function () {
    "use strict";
    mqttservice = spawn('node', [path.join(__dirname, 'mqtt-mini-broadcast-broker.js'), 'dependency']);
  });

  after(function() {
    "use strict";
    mqttservice.kill();
  });

  it("should be able to find a service for the given query", function(done) {
    var edisonLib = require('edisonapi');

    var query = new edisonLib.ServiceQuery();
    query.initServiceQueryFromFile(path.join(__dirname, "serviceQueries/temperatureServiceQueryMQTT.json"));

    edisonLib.discoverServices(query, function (serviceSpec) {
      "use strict";
      done();
    });
  });
});

