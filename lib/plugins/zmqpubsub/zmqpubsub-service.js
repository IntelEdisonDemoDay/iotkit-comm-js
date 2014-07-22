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

/** @module plugins/zmqpubsub */

var zeromq = require('zmq');

EdisonZMQPubSubService.prototype.interface = "service-interface";
EdisonZMQPubSubService.prototype.socket = null;
EdisonZMQPubSubService.prototype.receivedMsgHandler = null;

/**
 * Create a zmq publisher based on the given service specification
 * @param serviceSpec {object} {@tutorial service-spec-query}
 * @constructor module:plugins/zmqpubsub~EdisonZMQPubSubService
 * @see {@link http://zeromq.org}
 */
function EdisonZMQPubSubService(serviceSpec) {
    "use strict";
  this.socket = zeromq.socket('pub');
  if (serviceSpec.address) {
    this.socket.bindSync('tcp://' + serviceSpec.address + ':' + serviceSpec.port);
  } else {
    this.socket.bindSync('tcp://*:' + serviceSpec.port);
  }
}

EdisonZMQPubSubService.prototype.sendTo = function (client, msg, context) {

};

EdisonZMQPubSubService.prototype.publish = function (msg, context) {
  "use strict";
  this.socket.send(msg);
};

EdisonZMQPubSubService.prototype.manageClient = function (client, context) {

};

EdisonZMQPubSubService.prototype.setReceivedMessageHandler = function (handler) {

};

EdisonZMQPubSubService.prototype.done = function () {
    this.socket.close();
};

module.exports = EdisonZMQPubSubService;