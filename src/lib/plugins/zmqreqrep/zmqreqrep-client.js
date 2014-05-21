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

EdisonZMQReqRepClient.prototype.interface = "edison-client-interface";
EdisonZMQReqRepClient.prototype.socket = null;
EdisonZMQReqRepClient.prototype.receivedMsgHandler = null;

function EdisonZMQReqRepClient(serviceSpec) {
  "use strict";
  this.socket = zeromq.socket('req');
  this.socket.connect('tcp://' + serviceSpec.address + ':' + serviceSpec.port);

  var self = this;
  this.socket.on('message', function (message) {
    if (self.receivedMsgHandler) {
      self.receivedMsgHandler(message, {event: 'message'});
    }
  });
}

EdisonZMQReqRepClient.prototype.send = function (msg, context) {
  "use strict";
  this.socket.send(msg);
};

EdisonZMQReqRepClient.prototype.subscribe = function (topic) {
};

EdisonZMQReqRepClient.prototype.setReceivedMessageHandler = function (handler) {
  "use strict";
  this.receivedMsgHandler = handler;
};

EdisonZMQReqRepClient.prototype.unsubscribe = function (topic) {
  "use strict";
};

EdisonZMQReqRepClient.prototype.done = function () {
    this.socket.close();
};

module.exports = EdisonZMQReqRepClient;