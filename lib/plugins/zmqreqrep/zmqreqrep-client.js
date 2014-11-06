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

ZMQReqRepClient.prototype.interface = "client-interface";
ZMQReqRepClient.prototype.provides_secure_comm = false;

/**
 * Create a zmq requester that connects to a replier described by the given service specification
 * @param serviceSpec {object} {@tutorial service-spec-query}
 * @see {@link http://zeromq.org}
 * @constructor
 */
function ZMQReqRepClient(serviceSpec) {
  "use strict";
  this.socket = zeromq.socket('req');
  this.socket.connect('tcp://' + serviceSpec.address + ':' + serviceSpec.port);
  this.spec = serviceSpec;

  var self = this;
  this.socket.on('message', function (message) {
    if (self.receivedMsgHandler) {
      self.receivedMsgHandler(message, {event: 'message'});
    }
  });
}

ZMQReqRepClient.prototype.send = function (msg, context) {
  this.socket.send(msg);
};

ZMQReqRepClient.prototype.setReceivedMessageHandler = function (handler) {
  this.receivedMsgHandler = handler;
};

ZMQReqRepClient.prototype.done = function () {
    this.socket.close();
};

module.exports = ZMQReqRepClient;