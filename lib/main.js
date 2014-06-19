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

/** @module main */

'use strict';
var dns = require('dns');

var ConfigManager = require("./core/config-manager.js");
ConfigManager.init(__dirname, "config.json");

/**
 * The main config object for the library
 * @type {object} see {@link lib/config.json}, {@link module:configManager}
 */
exports.config = ConfigManager.config;

/**
 * Class to read and validate service specification from strings or JSON files
 * @type {ServiceSpecValidator|exports} {@link ServiceSpecValidator}
 */
exports.ServiceSpecValidator = require("./core/ServiceSpecValidator.js");

/**
 * Class to represent the "kind" of services a client is search for in the LAN
 * @type {ServiceQuery|exports} {@link ServiceQuery}
 */
exports.ServiceQuery = require("./core/ServiceQuery.js");

/**
 * Simple function to test if the Intel Edison Connectivity Framework (this library; also known as iecf)
 * is installed correctly
 * @returns {string} A simple greeting
 */
exports.sayhello = function ()
{
	return "Hello Edison user!";
};

/**
 * Class to create service instances ({@tutorial service})
 * @type {Service}
 */
var Service = require("./core/Service.js");

/**
 * Class to create client instances ({@tutorial client})
 * @type {Client}
 */
var Client = require("./core/Client.js");
var EdisonMDNS = require("./core/EdisonMDNS.js"); // singleton use as is

/**
 * Creates a service instance. However, this function expects that serviceSpec.address is either
 * absent or numerical
 * @param serviceSpec {object} {@tutorial service-spec-query}
 * @param {module:main~serviceCreatedCallback} returns created service instance ({@tutorial service})
 */
function createServiceWithNumericAddress(serviceSpec, serviceCreatedCallback) {
  var service = new Service(serviceSpec);
  if (!service.spec.advertise || service.spec.advertise.locally) {
    EdisonMDNS.advertiseService(service.spec);
  }
  serviceCreatedCallback(service);
}

/**
 * Create a service and advertise it over the LAN
 * @param serviceSpec {object} JSON service spec object ({@tutorial service-spec-query})
 * @param serviceCreatedCallback {module:main~serviceCreatedCallback} returns created service instance ({@tutorial service})
 */
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
/**
 * @callback module:main~serviceCreatedCallback
 * @param service {object} instance of newly created service ({@tutorial service)})
 * decide if they want to connect to this service or not ({@tutorial service-record}).
 */

/**
 * Create a client instance once a queried service is discovered.
 * @param serviceQuery {object} describes the "kind" of services the app wants to
 * look for ({@tutorial service-spec-query})
 * @param serviceFilter {module:main~serviceFilter} - called when a matching service is found. App must return 'true'
 * if it wants to communicate with this service.
 * @param clientCreatedCallback {module:main~clientCreatedCallback} if app returned true as a result of the
 * serviceFilter callback, then this callback returns the newly created client instance that is initialized
 * to communicate with the service that was just found.
 */
exports.createClient = function (serviceQuery, serviceFilter, clientCreatedCallback) {
  EdisonMDNS.discoverServices(serviceQuery, serviceFilter, function(serviceSpec) {
    clientCreatedCallback(new Client(serviceSpec));
  });
};

/**
 * @callback module:main~serviceFilter
 * @param serviceRecord {object} a service record matching the query (see {@tutorial service-record})
 * @returns {boolean} Return 'true' if service described by serviceRecord is acceptable, 'false' otherwise
 */

/**
 * @callback module:main~clientCreatedCallback
 * @param client {object} client instance connected to the newly found service. A newly found service is one whose
 * record was accepted by {@link module:main~serviceFilter}.
 */

/**
 * Discover services matching the given service query on the LAN
 * @param serviceQuery {object} {@tutorial service-spec-query}
 * @param serviceFoundCallback {module:main~serviceFoundCallback} returns a service record matching the service query
 */
exports.discoverServices = function (serviceQuery, serviceFoundCallback) {
  EdisonMDNS.discoverServices(serviceQuery, null, serviceFoundCallback);
};
/**
 * @callback module:main~serviceFoundCallback
 * @param serviceRecord {object} a service record matching the service query (see {@tutorial service-record})
 */

/**
 * Stop the service discovery browser
 */
exports.stopDiscoveringServices = function () {
  EdisonMDNS.stopDiscovering();
};

/**
 * Connect to a service completely described by the serviceSpec. The serviceSpec must contain
 * address and port information. Unlike {@link module:main.createClient}, a search for
 * service on the LAN is not performed.
 * @param serviceSpec {object} {@tutorial service-spec-query}
 * @param clientCreatedCallback {module:main~clientCreatedCallback} returns a client instance that is connected
 * to the service described in serviceSpec
 */
exports.createClientForGivenService = function (serviceSpec, clientCreatedCallback) {
  clientCreatedCallback(new Client(serviceSpec));
};

/**
 * Advertise a service over the LAN
 * @param serviceSpec {@tutorial service-spec-query}
 */
exports.advertiseService = function(serviceSpec) {
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
      if (!serviceSpec.advertise || serviceSpec.advertise.locally) {
        EdisonMDNS.advertiseService(serviceSpec);
      }
    });
  } else {
    if (!serviceSpec.advertise || serviceSpec.advertise.locally) {
      EdisonMDNS.advertiseService(serviceSpec);
    }
  }
}