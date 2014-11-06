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

var zeromq = require('zmq');

ZMQReqRepService.prototype.interface = "service-interface";
ZMQReqRepService.prototype.provides_secure_comm = false;

/**
 * Create a zmq replier based on the given service specification
 * @param serviceSpec {object} {@tutorial service-spec-query}
 * @see {@link http://zeromq.org}
 * @constructor
 */
function ZMQReqRepService(serviceSpec) {
  "use strict";
  this.socket = zeromq.socket('rep');
  if (serviceSpec.address) {
    this.socket.bindSync('tcp://' + serviceSpec.address + ':' + serviceSpec.port);
  } else {
    this.socket.bindSync('tcp://*:' + serviceSpec.port);
  }

  this.spec = serviceSpec;

  var self = this;
  this.socket.on('message', function (message) {
    if (self.receivedMsgHandler) {
      self.receivedMsgHandler(message, {event: 'message'}, self.socket);
    }
  });
}

ZMQReqRepService.prototype.send = function (msg, context, client) {
  if (client) {
    client.send(msg);
  } else {
    this.socket.send(msg);
  }
};

ZMQReqRepService.prototype.broadcast = function (msg, context, clients) {
  if (clients) {
    for (var i = 0; i < clients.length; i++) {
      clients[i].send(msg);
    }
  } else {
    this.socket.send(msg);
  }
};

ZMQReqRepService.prototype.administerClientConnection = function (context, client) {
  console.log("WARNING: administerClientConnection() is not yet supported.");
};

ZMQReqRepService.prototype.setReceivedMessageHandler = function (handler) {
  this.receivedMsgHandler = handler;
};

ZMQReqRepService.prototype.done = function () {
  this.socket.close();
};

module.exports = ZMQReqRepService;