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
var zeromq = require('zmq');

EdisonZMQPubSubClient.prototype.interface = "edison-client-interface";
EdisonZMQPubSubClient.prototype.socket = null;
EdisonZMQPubSubClient.prototype.receivedMsgHandler = null;

function EdisonZMQPubSubClient(serviceSpec) {
  "use strict";
  this.socket = zeromq.socket('sub');
  this.socket.connect('tcp://' + serviceSpec.address + ':' + serviceSpec.port);

  var self = this;
  this.socket.on('message', function (message) {
    if (self.receivedMsgHandler) {
      self.receivedMsgHandler(message, {event: 'message'});
    }
  });
}

EdisonZMQPubSubClient.prototype.send = function (msg, context) {
  "use strict";

};

EdisonZMQPubSubClient.prototype.subscribe = function (topic) {
    this.socket.subscribe(topic);
};

EdisonZMQPubSubClient.prototype.setReceivedMessageHandler = function (handler) {
  "use strict";
  this.receivedMsgHandler = handler;
};

EdisonZMQPubSubClient.prototype.unsubscribe = function (topic) {
  "use strict";
};

EdisonZMQPubSubClient.prototype.done = function () {
    this.socket.close();
};

module.exports = EdisonZMQPubSubClient;