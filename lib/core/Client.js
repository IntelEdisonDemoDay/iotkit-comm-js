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

/** @module client */

var PluginManager = require("./plugin-manager.js");
var Crypto = require("./Crypto.js");

/**
 * Initializes a client object that can connect to a service
 * described by serviceSpec.
 * @param {object} serviceSpec - {@tutorial service-spec-query}
 * @constructor module:client~Client
 */
function Client(serviceSpec, serviceDirectory, instanceCreatedCb) {
  "use strict";

  var commplugin;
  try {
    commplugin =  PluginManager.getClientPlugin(serviceSpec.type.name);
  } catch (err) {
    console.log("ERROR: Could not load communication plugin needed to interact with service at '" +
      serviceSpec.address + ":" + serviceSpec.port + "'. Plugin '" + serviceSpec.type.name +
    "' was not found or produced errors while loading.");
    console.log(err);
    return;
  }

  this.spec = serviceSpec;
  this.directory = serviceDirectory;

  // setup secure channels if needed
  var c = null;
  var canSecure = true;
  try {
    c = new Crypto();
  } catch (e) {
    c = null;
    canSecure = false;
  }

  if (!this.spec.type_params) {
    this.spec.type_params = {};
  }

  if (!this.spec.properties) {
    this.spec.properties = {};
  }

  this.spec.type_params.mustsecure = this.spec.type_params.mustsecure || this.spec.properties.__mustsecure;

  if (this.spec.type_params.mustsecure)
  { // client or server want a secure channel
    if (!canSecure && !commplugin.prototype.provides_secure_comm)
    { // no credentials setup and plugin does not provide own security mechanism
      throw new Error("Cannot connect securely because credentials are not setup (a secure\n" +
        "communication channel was requested either by the service or the client).\n" +
        "Run iotkit-comm setupAuthentication to create and configure credentials.");
    }

    if (!this.spec.properties.__mustsecure && !this.spec.properties.__cansecure && !this.spec.properties.__user)
    { // cannot create secure channel because server is not configured for it
      throw new Error("Cannot connect securely because the server does not support secure communications.");
    }

    if (canSecure && !commplugin.prototype.provides_secure_comm) {
      // create secure tunnel
      console.log("Setting up secure communication channel...");
      var self = this;
      c.createSecureTunnel(this.spec, function (localport, localaddr) {
        self.spec.address = localaddr;
        self.spec.port = localport;
        console.log("Secure tunnel setup at " + self.spec.address + ":" + self.spec.port);
        self.comm = new commplugin(self.spec, c);
        instanceCreatedCb(self);
      });
    } else {
      this.comm = new commplugin(this.spec, c);
      instanceCreatedCb(this);
    }
  } else {
    this.comm = new commplugin(this.spec, c);
    instanceCreatedCb(this);
  }
}

module.exports = Client;