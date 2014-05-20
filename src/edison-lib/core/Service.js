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
var PluginManager = require("./plugin-manager.js");

Service.prototype.comm = null;
Service.prototype.spec = null;

function Service(serviceSpec) {
  "use strict";

  this.spec = serviceSpec;

  var commplugin;
  try {
    commplugin =  PluginManager.getServicePlugin(this.spec.type.name);
  } catch (err) {
    console.log("ERROR: An appropriate communication plugin could not be found for service '" + this.spec.name +
      "'. Service needs communication plugin '" + this.spec.type.name + "'.");
    throw err;
  }

  this.comm = new commplugin(serviceSpec);
}

// export the class
module.exports = Service;