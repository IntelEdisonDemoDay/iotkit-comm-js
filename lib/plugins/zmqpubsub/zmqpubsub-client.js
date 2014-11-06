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
var zeromq = require('zmq');

ZMQPubSubClient.prototype.interface = "client-interface";
ZMQPubSubClient.prototype.provides_secure_comm = false;

/**
 * Create a zmq subscriber that connects to a publisher described by the given service specification
 * @param serviceSpec {object} {@tutorial service-spec-query}
 * @see {@link http://zeromq.org}
 * @constructor
 */
function ZMQPubSubClient(serviceSpec) {
  "use strict";
  this.socket = zeromq.socket('sub');
  this.socket.connect('tcp://' + serviceSpec.address + ':' + serviceSpec.port);

  this.spec = serviceSpec;
  this.socket.subscribe(this.spec.name);

  var self = this;
  this.socket.on('message', function (message) {
    if (self.receivedMsgHandler) {
      var strmsg = message.toString();
      var colonidx = strmsg.indexOf(":");
      self.receivedMsgHandler(strmsg.substring(colonidx+1), {event: 'message'});
    }
  });
}

ZMQPubSubClient.prototype.send = function (msg, context) {
  throw new Error("send() is not supported. A ZMQ subscriber can only receive messages from a publisher.");
};

ZMQPubSubClient.prototype.setReceivedMessageHandler = function (handler) {
  this.receivedMsgHandler = handler;
};

ZMQPubSubClient.prototype.done = function () {
    this.socket.close();
};

module.exports = ZMQPubSubClient;