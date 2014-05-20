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

Client.prototype.comm = null;
Client.prototype.spec = null;

function Client(serviceSpec) {
  "use strict";

  this.spec = serviceSpec;

  var commplugin;
  try {
    commplugin =  PluginManager.getClientPlugin(serviceSpec.type.name);
  } catch (err) {
    console.log("ERROR: Could not load communication plugin needed to interact with service at '" +
      serviceSpec.address + ":" + serviceSpec.port + "'. Plugin '" + serviceSpec.type.name + "' was not found or produced errors while loading.");
    console.log(err);
    return;
  }

  this.comm = new commplugin(serviceSpec);
}

// export the class
module.exports = Client;