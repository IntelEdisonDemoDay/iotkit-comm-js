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

var mqtt = require('mqtt');

/**
 * Name of interface this plugin would like to adhere to ({@tutorial plugin})
 * @type {string}
 */
MQTTService.prototype.interface = "service-interface";
MQTTService.prototype.provides_secure_comm = true;


/**
 * The service instance this plugin creates ({@tutorial Service}).
 * @type {object}
 */
MQTTService.prototype.service = {};

/**
 * The server-side plugin ({@tutorial plugin}) needs a received message handler to process
 * messages coming from the clients.
 * @type {function}
 */
MQTTService.prototype.receivedMsgHandler = null;

/**
 * Create a minimal MQTT broker based on the given specification ({@tutorial Service}).
 * @param serviceSpec {object} {@tutorial service-spec-query}
 * @constructor
 */
function MQTTService(serviceSpec) {
  "use strict";

  var self = this;
  this.service = mqtt.createServer(function(client) {
    client.on('connect', function(packet) {
      if (self.receivedMsgHandler) {
        self.receivedMsgHandler(client, packet, {event: 'connect'});
      }
    });

    client.on('publish', function(packet) {
      if (self.receivedMsgHandler) {
        self.receivedMsgHandler(client, packet, {event: 'publish'});
      }
    });

    client.on('subscribe', function(packet) {
      if (self.receivedMsgHandler) {
        self.receivedMsgHandler(client, packet, {event: 'subscribe'});
      }
    });

    client.on('pingreq', function(packet) {
      if (self.receivedMsgHandler) {
        self.receivedMsgHandler(client, packet, {event: 'pingreq'});
      }
    });

    client.on('disconnect', function(packet) {
      if (self.receivedMsgHandler) {
        self.receivedMsgHandler(client, packet, {event: 'disconnect'});
      }
    });

    client.on('close', function(err) {
      if (self.receivedMsgHandler) {
        self.receivedMsgHandler(client, err, {event: 'close'});
      }
    });

    client.on('error', function(err) {
      if (self.receivedMsgHandler) {
        self.receivedMsgHandler(client, err, {event: 'error'});
      }
    });
  });

  this.service.listen(serviceSpec.port);
}

/**
 * Send a message to a client.
 * @param client {object} instance of client on the server-side
 * @param msg {string} message to send
 * @param context {object.<string, string>} describes what to do with message.
 * <ul>
 * <li> If empty, message is sent as-is to the client </li>
 * <li> If context.ack is set, then an acknowledgement to the given message is sent
 * as described by the MQTT protocol (also see {@link sample-apps/mqtt-mini-broadcast-broker.js}).
 * <ul>
 * <li> If context.ack is 'connack', then a connection acknowledgement is returned</li>
 * <li> if it is 'suback', then a subscription acknowledgement is returned</li>
 * <li> if it is 'pingrep', then response to the ping request is sent</li>
 * <li> otherwise, simply send message to client</li></ul></li></ul>
 */
MQTTService.prototype.sendTo = function (client, msg, context) {

  if (!context) {
    client.publish(msg);
    return;
  }

  switch (context.ack) {
    case 'connack':
      client.connack({returnCode: 0});
      break;
    case 'suback':
      var granted = [];
      for (var i = 0; i < msg.subscriptions.length; i++) {
        granted.push(msg.subscriptions[i].qos);
      }
      client.suback({granted: granted, messageId: msg.messageId});
      break;
    case 'pingresp':
      client.pingresp();
      break;
    default:
      client.publish(msg);
  }
};

/**
 * Does nothing for now. Eventually might be used to broadcast messages to all clients, or
 * publish status messages to another portal etc.
 * @param msg {string} message to publish
 * @param context {object} the plugin looks at properties in this object to determine if it should
 * process the given message in any special way.
 */
MQTTService.prototype.publish = function (msg, context) {
  "use strict";

};

/**
 * Set a handler for all received messages
 * @param handler {function}
 */
MQTTService.prototype.setReceivedMessageHandler = function(handler) {
  "use strict";
  this.receivedMsgHandler = handler;
};

/**
 * End the server. Currently does nothing. Could possibly handle signals here.
 */
MQTTService.prototype.done = function () {
};

/**
 * Perform actions related to client instances on server side. For example, if
 * an error occurs on the communication stream, destroy the stream.
 * @param client {object} client instance on server-side
 * @param context {object} properties here indicate what action to take on the client instance.
 * If context.action is 'endstream', close the connection stream between server and client.
 */
MQTTService.prototype.manageClient = function (client, context) {
  "use strict";
  switch (context.action) {
    case 'endstream':
      client.stream.end();
  }
};

module.exports = MQTTService;
