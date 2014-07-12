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

var ServiceSpecValidator = require("./ServiceSpecValidator.js");

/**
 * Portions of the service specification ({@tutorial service-spec-query}) are inserted into the TXT record of an
 * mDNS advertisement ({@tutorial service-record}). The set of parameters to the communication plugin is one such portion.
 * @type {string}
 * @todo This should eventually be eliminated.
 * @constant module:service~ServiceRecord.COMM_PARAMS_PREFIX
 */
exports.COMM_PARAMS_PREFIX = "_comm_params_";

/**
 * The raw service record object.
 * @type {object}
 */
ServiceRecord.prototype.rawRecord = {};

/**
 * The service specification ({@tutorial service-spec-query}) derived from the service record ({@tutorial service-record}).
 * @type {object}
 */
ServiceRecord.prototype.spec = {};

/**
 * The {@link ServiceDirectory} module suggests the best addresses to reach the service at. suggestedAddresses[0]
 * contains the module's best suggestion followed by the second best and so on
 * ({@link ServiceDirectory.serviceAddressFilter}).
 * @type {Array}
 */
ServiceRecord.prototype.suggestedAddresses = [];

/**
 * Initialize a service record ({@tutorial service-record}) using the given service specification.
 * @param serviceSpec {object} {@tutorial service-spec-query}
 * @constructor module:service~ServiceRecord
 */
function ServiceRecord (serviceSpec) {
  "use strict";
  this.spec = serviceSpec;
  makeServiceRecord.call(this);
}

/**
 * Get a service specification ({@tutorial service-spec-query}) derived from this service record. The specification
 * contains the {@link ServiceDirectory} module's suggested address to reach the service at (see {@tutorial service-record}).
 * @returns {Object}
 */
ServiceRecord.prototype.getSuggestedServiceSpec = function () {
  "use strict";

  if (this.spec.address) {
    return this.spec;
  }

  this.spec.address = this.getSuggestedAddress();
  if (!this.spec.address) {
    throw new Error("No valid address found for this service.");
  }

  return this.spec;
};

/**
 * Get the best address to reach this service at ({@tutorial service-record}).
 * @returns {string} IP address of service
 */
ServiceRecord.prototype.getSuggestedAddress = function () {
  "use strict";

  if (this.spec.address) {
    return this.spec.address;
  }

  if (this.suggestedAddresses.length != 0) {
    return this.suggestedAddresses[0];
  }

  if (this.rawRecord.addresses.length != 0) {
    return this.rawRecord.addresses[0];
  }

  return "";
};

/**
 * Set the best address to reach this service at ({@tutorial service-record}).
 * @param address {string} IP address
 */
ServiceRecord.prototype.setSuggestedAddress = function (address) {
  "use strict";
  this.spec.address = address;
};

/**
 * Get all addresses this service was found at. Addresses are in order: best address to reach service at is first.
 * ({@tutorial service-record})
 * @returns {Array} IP addresses this service can be reached at
 */
ServiceRecord.prototype.getSuggestedAddresses = function (addresses) {
  "use strict";
  return this.suggestedAddresses;
};

/**
 * Set all addresses this service can be reached at. Addresses are should be in order: best address
 * to reach service at is first ({@tutorial service-record}).
 * @returns {Array} IP addresses this service can be reached at
 */
ServiceRecord.prototype.setSuggestedAddresses = function (addresses) {
  "use strict";
  this.suggestedAddresses = addresses;
};

/**
 * Initialize this object for a raw service record object received from mDNS.
 * @param serviceRecord {object} {@tutorial service-record}
 */
ServiceRecord.prototype.initFromRawServiceRecord = function (serviceRecord) {
  "use strict";

  ServiceSpecValidator.validateRawServiceRecord(serviceRecord);

  this.rawRecord = serviceRecord;
  this.spec = serviceRecord;

  if (this.rawRecord.addresses && this.rawRecord.addresses.length > 0) {
    this.suggestedAddresses = this.rawRecord.addresses;
    this.spec.address = this.rawRecord.addresses[0];
  } else {
    this.spec.address = "";
  }

  if (typeof this.rawRecord.properties === 'undefined') {
    return;
  }

  if (typeof this.spec.comm_params === 'undefined') {
    this.spec.comm_params = {};
  }

  var properties = Object.keys(this.rawRecord.properties);
  for (var i = 0; i < properties.length; i++) {
    if (properties[i].indexOf(exports.COMM_PARAMS_PREFIX) != 0) {
      continue;
    }

    var comm_param_key = properties[i].substring(exports.COMM_PARAMS_PREFIX.length);
    var comm_param_value = this.rawRecord.properties[properties[i]];

    this.spec.comm_params[comm_param_key] = comm_param_value;
  }
};

/**
 * Initialize this service record ({@tutorial service-record}) from a service specification ({@tutorial service-spec-query})
 * @constant module:service~ServiceRecord.makeServiceRecord
 */
function makeServiceRecord () {
  "use strict";

  this.rawRecord = this.spec;

  if (!this.spec) {
    return;
  }

  if (!this.spec.comm_params) {
    return;
  }

  if (typeof this.rawRecord.properties === 'undefined') {
    this.rawRecord.properties = {};
  }

  var commparams = Object.keys(this.spec.comm_params);
  for (var i = 0; i < commparams.length; i++) {
    var propertyName = exports.COMM_PARAMS_PREFIX + commparams[i];
    if (this.rawRecord.properties[propertyName]) {
      continue;
    }
    this.rawRecord.properties[propertyName] = this.spec.comm_params[commparams[i]];
  }
}

module.exports = ServiceRecord;