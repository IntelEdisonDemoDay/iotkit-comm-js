/**
 * <insert one-line description of what the program does>
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
'use strict';
var dns = require('dns');

var ConfigManager = require("./core/config-manager.js");
ConfigManager.init(__dirname, "config.json");

exports.config = ConfigManager.config;
exports.ServiceSpecValidator = require("./core/ServiceSpecValidator.js");
exports.ServiceQuery = require("./core/ServiceQuery.js");

exports.sayhello = function ()
{
	return "Hello Edison user!";
};

var Service = require("./core/Service.js");
var Client = require("./core/Client.js");
var EdisonMDNS = require("./core/EdisonMDNS.js"); // singleton use as is

function createServiceWithNumericAddress(serviceSpec, serviceCreatedCallback) {
  var service = new Service(serviceSpec);
  if (!service.spec.advertise || service.spec.advertise.locally) {
    EdisonMDNS.advertiseService(service.spec);
  }
  serviceCreatedCallback(service);
}

exports.createService = function (serviceSpec, serviceCreatedCallback) {
  if (serviceSpec.address) {
    dns.lookup(serviceSpec.address, 4, function (err, address, family) {
      if (err) {
        console.log(err);
        throw err;
      }

      if (family != 4) {
        console.log("WARN: Got IPv6 address even when IPv4 was requested. Waiting for an IPv4 address...");
        return;
      }

      serviceSpec.address = address;
      createServiceWithNumericAddress(serviceSpec, serviceCreatedCallback);
    });
  } else {
    createServiceWithNumericAddress(serviceSpec, serviceCreatedCallback);
  }
};

exports.createClient = function (serviceQuery, serviceFilter, clientCreatedCallback) {
  EdisonMDNS.discoverServices(serviceQuery, serviceFilter, function(serviceSpec) {
    clientCreatedCallback(new Client(serviceSpec));
  });
};

exports.discoverServices = function (serviceQuery, serviceFoundCallback) {
  EdisonMDNS.discoverServices(serviceQuery, null, serviceFoundCallback);
};

exports.createClientForGivenService = function (serviceSpec, clientCreatedCallback) {
  clientCreatedCallback(new Client(serviceSpec));
};