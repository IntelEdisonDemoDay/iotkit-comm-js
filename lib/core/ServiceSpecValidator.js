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

var fs = require('fs');

/**
 * The service specification.
 * @type {object} {@tutorial service-spec-query}
 */
ServiceSpecValidator.prototype.spec = null;

/**
 * Validates a given service specification
 * @param serviceSpec {@tutorial service-spec-query}
 * @constructor module:service~ServiceSpecValidator
 */
function ServiceSpecValidator(serviceSpec) {
  "use strict";
  this.spec = serviceSpec;
}

/**
 * Read service specification from JSON file ({@tutorial service-spec-query})
 * @param serviceSpecFilePath {string} absolute path to service spec file
 */
ServiceSpecValidator.prototype.readServiceSpecFromFile = function (serviceSpecFilePath) {
  "use strict";
  this.spec = JSON.parse(fs.readFileSync(serviceSpecFilePath));
};

/**
 * Read a service specification from a JSON string.
 * @param serviceSpecString {string} JSON service spec string
 */
ServiceSpecValidator.prototype.readServiceSpecFromString = function (serviceSpecString) {
  "use strict";
  this.spec = JSON.parse(serviceSpecString);
};

/**
 * Validate a service specification.
 * @param serviceSpec {object} {@tutorial service-spec-query}
 * @returns {object} validated service specification object
 */
ServiceSpecValidator.validate = function (serviceSpec) {
  "use strict";
  if (typeof serviceSpec.name === 'undefined') {
    throw new Error("Service must have a name.");
  }

  if (!typeof serviceSpec.name === "string" || serviceSpec.name.length == 0) {
    throw new Error("Service name must be a non-zero string.");
  }

  if (typeof serviceSpec.type === 'undefined'
    || typeof serviceSpec.type.name === 'undefined'
    || typeof serviceSpec.type.protocol === 'undefined') {
    throw new Error("Service must have a type; a type.name; and a type.protocol field.");
  }

  if (typeof serviceSpec.type.subtypes !== 'undefined') {
    if (!Array.isArray(serviceSpec.type.subtypes)) {
      throw new Error("Subtypes of a service type must be in an array.");
    }

    if (serviceSpec.type.subtypes.length > 1) {
      throw new Error("More than one subtype is not supported at this time. This is a known issue.");
    }
  }

  if (typeof serviceSpec.port === 'undefined') {
    throw new Error("Service must have a port number.");
  }

  if (typeof serviceSpec.port !== 'number') {
    throw new Error("Service port must be a number.");
  }

  if (typeof serviceSpec.properties !== 'undefined') {
    if (typeof serviceSpec.properties !== 'object' || Array.isArray(serviceSpec.properties)) {
      throw new Error("Service properties must be in an object containing name/value pairs.");
    }
  }

  if (typeof serviceSpec.advertise !== 'undefined') {
    if (typeof serviceSpec.advertise.locally === 'undefined') {
      throw new Error("Missing boolean property 'advertise.locally. " +
        "Service needs to state if it must be locally advertised or not.");
    }
    if (typeof serviceSpec.advertise.locally !== 'boolean') {
      throw new Error("advertise.locally must be a Boolean property.");
    }

    if (typeof serviceSpec.advertise.cloud === 'undefined') {
      throw new Error("Missing boolean property 'advertise.cloud. " +
        "Service needs to state if it must be advertised in the cloud or not.");
    }

    if (typeof serviceSpec.advertise.locally !== 'boolean') {
      throw new Error("advertise.cloud must be a Boolean property.");
    }
  }

  if (typeof serviceSpec.address !== 'undefined') {
    if (typeof serviceSpec.address !== 'string') {
      throw new Error("Address must be a string. Currently, only IPv4 is supported.");
    }
  }

  if (typeof serviceSpec.comm_params !== 'undefined') {
    if (typeof serviceSpec.comm_params !== 'object') {
      throw new Error("Communication params field must be an object. It should contain name/value pairs.");
    }
  }

  return serviceSpec;
};

/**
 * Validate and return the service specification object
 * @returns {Object} validated service specification
 */
ServiceSpecValidator.prototype.getValidatedSpec = function () {
  "use strict";
  return ServiceSpecValidator.validate(this.spec);
};

/**
 * Validate a service record {@tutorial service-record}. A service record is just a more detailed version
 * of a service spec. Can be thought of as "service-record inherits from service-spec" ({@tutorial service-spec-query}).
 * @param rawServiceRecord
 */
ServiceSpecValidator.validateRawServiceRecord = function (rawServiceRecord) {
  "use strict";
  ServiceSpecValidator.validate(rawServiceRecord);
};

module.exports = ServiceSpecValidator;
