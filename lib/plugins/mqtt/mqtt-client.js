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
var mqtt = require('mqtt');

/**
 * Name of interface this plugin would like to adhere to ({@tutorial plugin})
 * @type {string}
 */
EdisonMQTTClient.prototype.interface = "client-interface";

/**
 * The internal client object this plugin ({@tutorial plugin}) creates to communicate with the remote client.
 * @type {object}
 */
EdisonMQTTClient.prototype.client = {};

/**
 * The client-side plugin needs a received message handler to process messages coming from the server
 * ({@tutorial plugin}).
 * @type {function}
 */
EdisonMQTTClient.prototype.receivedMsgHandler = null;

/**
 * Create a client that connects to a mqtt broker described in the service specification.
 * @param serviceSpec {object} {@tutorial service-spec-query}
 * @constructor module:plugins/mqtt~EdisonMQTTClient
 */
function EdisonMQTTClient(serviceSpec) {
  "use strict";

  if (serviceSpec.type_params && serviceSpec.type_params['ssl']) {
    this.client = mqtt.createSecureClient(serviceSpec.port, serviceSpec.address,
      serviceSpec.type_params.args);
  } else {
    this.client = mqtt.createClient(serviceSpec.port, serviceSpec.address);
  }

  var self = this;
  this.client.on('message', function (topic, message) {
    if (self.receivedMsgHandler) {
      self.receivedMsgHandler(message, {event: 'message', topic: topic});
    }
  });
}

/**
 * Send a message to the broker. Equivalent to publishing to a topic.
 * @param msg {string} Message to send to broker.
 * @param context {object.<string, string>} context.topic contains the topic string
 */
EdisonMQTTClient.prototype.send = function (msg, context) {
    this.client.publish(context.topic, msg);
};

/**
 * subscribe to a topic.
 * @param topic {string}
 */
EdisonMQTTClient.prototype.subscribe = function (topic) {
  this.client.subscribe(topic);
};

/**
 * unsubscribe from a topic
 * @param topic {string}
 * @todo not supported at the moment, but will be by beta.
 */
EdisonMQTTClient.prototype.unsubscribe = function (topic) {
  "use strict";
};

/**
 * Set a handler for all received messages.
 * todo: document handler. specifically the context object.
 * @param handler {function} called when a message is received
 */
EdisonMQTTClient.prototype.setReceivedMessageHandler = function(handler) {
  "use strict";
  this.receivedMsgHandler = handler;
};

/**
 * close connection. Sends FIN to the other side.
 */
EdisonMQTTClient.prototype.done = function () {
    this.client.end();
};

module.exports = EdisonMQTTClient;