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
var ServiceQuery = require("./ServiceQuery.js");

function ServiceSpec(source, otherAddresses) {

  // inheritance
  ServiceQuery.call(this, source);

  // check name
  if (!this.sourceObj.name) {
    throw new Error("Service must have a name.");
  }

  // check port
  if (!this.sourceObj.port) {
    throw new Error("Service must have a port number.");
  }

  // check other addresses
  if (otherAddresses) {
    if (!Array.isArray(otherAddresses))
      throw new Error("otherAddresses field must be an array (of IPv4 addresses).");
    this.otherAddresses = otherAddresses;
    if (!this.address) { // no address given
      this.address = this.otherAddresses[0];
    }
  }

  // check advertise (how to advertise this service)
  if (this.sourceObj.advertise) {
    if (typeof this.sourceObj.advertise.locally === 'undefined') {
      throw new Error("Missing boolean property 'advertise.locally. " +
        "Service needs to state if it must be locally advertised or not.");
    }
    if (typeof this.sourceObj.advertise.locally !== 'boolean') {
      throw new Error("advertise.locally must be a Boolean property.");
    }
    if (typeof this.sourceObj.advertise.cloud === 'undefined') {
      throw new Error("Missing boolean property 'advertise.cloud. " +
        "Service needs to state if it must be advertised in the cloud or not.");
    }
    if (typeof this.sourceObj.advertise.locally !== 'boolean') {
      throw new Error("advertise.cloud must be a Boolean property.");
    }
    this.advertise = this.sourceObj.advertise;
  }

  // check communication parameters (goes to plugin)
  if (this.sourceObj.comm_params) {
    if (typeof this.sourceObj.comm_params !== 'object') {
      throw new Error("Communication params field must be an object. It should contain name/value pairs.");
    }
    this.comm_params = this.sourceObj.comm_params;
  }
}

// inheritance
ServiceSpec.prototype = Object.create(ServiceQuery.prototype);

module.exports = ServiceSpec;