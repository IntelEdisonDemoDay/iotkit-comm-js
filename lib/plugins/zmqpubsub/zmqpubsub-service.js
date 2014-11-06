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

ZMQPubSubService.prototype.interface = "service-interface";
ZMQPubSubService.prototype.provides_secure_comm = false;

/**
 * Create a zmq publisher based on the given service specification
 * @param serviceSpec {object} {@tutorial service-spec-query}
 * @see {@link http://zeromq.org}
 * @constructor
 */
function ZMQPubSubService(serviceSpec) {
  this.socket = zeromq.socket('pub');
  if (serviceSpec.address) {
    this.socket.bindSync('tcp://' + serviceSpec.address + ':' + serviceSpec.port);
  } else {
    this.socket.bindSync('tcp://*:' + serviceSpec.port);
  }
  this.spec = serviceSpec;
}

function publish(msg, context, client) {
  if (context && context.topic) {
    msg = context.topic + ":" + msg;
  } else {
    msg = this.spec.name + ":" + msg;
  }
  client.send(msg);
}

ZMQPubSubService.prototype.send = function (msg, context, client) {
  if (client) {
    publish.call(this, msg, context, client);
  } else {
    publish.call(this, msg, context, this.socket);
  }
};

ZMQPubSubService.prototype.broadcast = function (msg, context, clients) {
  if (clients) {
    for (var i = 0; i < clients.length; i++) {
      publish.call(this, msg, context, clients[i]);
    }
  } else {
    publish.call(this, msg, context, this.socket);
  }
};

ZMQPubSubService.prototype.administerClientConnection = function (context, client) {
  console.log("WARNING: administerClientConnection() is not yet supported.");
};

ZMQPubSubService.prototype.setReceivedMessageHandler = function (handler) {
  throw new Error("setReceivedMessageHandler() is not supported. " +
    "A ZMQ publisher cannot receive messages from the subscriber");
};

ZMQPubSubService.prototype.done = function () {
    this.socket.close();
};

module.exports = ZMQPubSubService;