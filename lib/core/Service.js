/*
 * Copyright (c) 2014 Intel Corporation.
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/** @module service */

var PluginManager = require("./plugin-manager.js");
var Crypto = require("./Crypto.js");

/**
 * Create a service instance using the given specification
 * @param serviceSpec {object} ({@tutorial service-spec-query})
 * @constructor module:service~Service
 */
function Service(serviceSpec) {
  "use strict";

  var commplugin;
  try {
    commplugin =  PluginManager.getServicePlugin(serviceSpec.type.name);
  } catch (err) {
    console.log("ERROR: Could not load or find the appropriate communication plugin for service '" + serviceSpec.name +
      "'. Service needs communication plugin '" + serviceSpec.type.name + "'.");
    throw err;
  }

  this.spec = serviceSpec;

  // setup security if needed
  var c = null;
  var canSecure = true;
  try {
    c = new Crypto();
  } catch (e) {
    c = null;
    canSecure = false;
  }

  if (!this.spec.properties) {
    this.spec.properties = {};
  }

  if (!this.spec.type_params) {
    this.spec.type_params = {};
  }

  if (this.spec.type_params.mustsecure)
  { // service wants clients to only connect securely
    if (!canSecure && !commplugin.prototype.provides_secure_comm)
    { // no credentials setup, and plugin does not provide own security mechanism
      throw new Error("Service expects clients to connect securely but credentials are not setup.\n" +
      "Run iotkit-comm setupAuthentication to create and configure credentials.");
    }
    this.spec.properties.__mustsecure = true;
  }

  if (canSecure && !commplugin.prototype.provides_secure_comm) {
    // plugin does not provide its own security mechanisms.
    // so, allow clients to connect securely through SSH tunnels if they wish
    //   - advertise the user account (on this machine) that will be used to create the secure tunnels.
    this.spec.properties.__user = c.user;
  } else if (commplugin.prototype.provides_secure_comm) { // plugin provides own security mechanism.
    if (!this.spec.properties.__mustsecure)
    { // secure channels are optional
      this.spec.properties.__cansecure = true;
    }
  }

  this.comm = new commplugin(this.spec, c);
}

/** If this service is advertised on the LAN, call this function */
Service.prototype.setDirectory = function (serviceDirectory) {
  this.directory = serviceDirectory;
};

module.exports = Service;