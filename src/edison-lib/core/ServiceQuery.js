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
var fs = require('fs');

ServiceQuery.prototype.rawQuery = null;
ServiceQuery.prototype.nameRegEx = null;

function ServiceQuery(rawQueryObj) {
  "use strict";
  if (!rawQueryObj) {
    return;
  }
  this.rawQuery = rawQueryObj;
  setup.call(this);
}

ServiceQuery.prototype.initServiceQueryFromFile = function (serviceQueryFilePath) {
  "use strict";
  this.rawQuery = JSON.parse(fs.readFileSync(serviceQueryFilePath));
  setup.call(this);
};

ServiceQuery.prototype.initServiceQueryFromString = function (serviceQueryString) {
  "use strict";
  this.rawQuery = JSON.parse(serviceQueryString);
  setup.call(this);
};

function setup() {
  "use strict";
  this.validate();
  if (this.rawQuery.name) {
    this.nameRegEx = new RegExp(this.rawQuery.name);
  }
}

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

// export the class
module.exports = ServiceQuery;