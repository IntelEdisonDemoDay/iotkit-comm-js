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

/** @module ServiceQuery */
var fs = require('fs');

/** the service query object provided by the user ({@tutorial service-query})*/
ServiceQuery.prototype.rawQuery = null;

/**
 * the name field of the service query is treated a regular expression. This is the object representing
 * that regular expression
 * @type {object}
 */
ServiceQuery.prototype.nameRegEx = null;

/**
 * The service query object. Users provide this to find the desired service records returned by mDNS.
 * @param rawQueryObj {object} ({@tutorial service-query})
 * @constructor
 */
function ServiceQuery(rawQueryObj) {
  "use strict";
  if (!rawQueryObj) {
    return;
  }
  this.rawQuery = rawQueryObj;
  setup.call(this);
}

/**
 * Read a service query json file and initialize this object ({@tutorial service-query}).
 * @param serviceQueryFilePath {string} Absolute path to service query file
 */
ServiceQuery.prototype.initServiceQueryFromFile = function (serviceQueryFilePath) {
  "use strict";
  this.rawQuery = JSON.parse(fs.readFileSync(serviceQueryFilePath));
  setup.call(this);
};

/**
 * Read a service query string and initialize this object ({@tutorial service-query}).
 * @param serviceQueryString {string} JSON string representing service query.
 */
ServiceQuery.prototype.initServiceQueryFromString = function (serviceQueryString) {
  "use strict";
  this.rawQuery = JSON.parse(serviceQueryString);
  setup.call(this);
};

/** Validate service query object (see {@link ServiceQuery.validate}) and initialize regular expression object */
function setup() {
  "use strict";
  this.validate();
  if (this.rawQuery.name) {
    this.nameRegEx = new RegExp(this.rawQuery.name);
  }
}

/**
 * Validate the service query object ({@tutorial service-query}).
 */
ServiceQuery.prototype.validate = function () {
  "use strict";

  if (typeof this.rawQuery.type === 'undefined'
    || typeof this.rawQuery.type.name === 'undefined'
    || typeof this.rawQuery.type.protocol === 'undefined') {
    throw new Error("Service query must have a type; a type.name; and a type.protocol field.");
  }

  if (typeof this.rawQuery.name !== 'undefined') {
    if (!typeof this.rawQuery.name === "string" || this.rawQuery.name.length == 0) {
      throw new Error("Service name in a query must be a non-zero string.");
    }
  }

  if (typeof this.rawQuery.port !== 'undefined') {
    if (typeof this.rawQuery.port !== 'number') {
      throw new Error("In a service query, service port must be a number.");
    }
  }

  if (typeof this.rawQuery.type.subtypes !== 'undefined') {
    if (!Array.isArray(this.rawQuery.type.subtypes)) {
      throw new Error("In a service query, the type.subtypes field must be an array.");
    }
    if (this.rawQuery.type.subtypes.length > 1) {
      throw new Error("More than one subtype is not supported in the query. This is a known issue.");
    }
  }
};

module.exports = ServiceQuery;