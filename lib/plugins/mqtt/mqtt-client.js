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
 */
MQTTClient.prototype.interface = "client-interface";
MQTTClient.prototype.provides_secure_comm = true;

/**
 * Create a client that connects to an MQTT broker described in the service specification.
 * @param serviceSpec {object} {@tutorial service-spec-query}
 * @constructor
 */
function MQTTClient(serviceSpec, crypto) {
  if (serviceSpec.type_params.mustsecure) {
    if (!serviceSpec.properties || !serviceSpec.properties.secureport || !serviceSpec.properties.secureaddress) {
      throw new Error("Cannot create secure communication channel. Service not setup to communicate securely.");
    }
    var calist = [];
    calist.push(crypto.getCA_SSLCert());
    var opts = {
      keyPath: crypto.getUserPrivateKey(),
      certPath: crypto.getUserSSLCert(),
      ca: calist
    };
    console.log("Connecting securely to MQTT broker at " + serviceSpec.properties.secureaddress + ":" +
      serviceSpec.properties.secureport);
    this.client = mqtt.createSecureClient(serviceSpec.properties.secureport, serviceSpec.properties.secureaddress,
      opts);
  } else {
    this.client = mqtt.createClient(serviceSpec.port, serviceSpec.address);
  }

  this.spec = serviceSpec;
  this.client.subscribe(this.spec.name);

  var self = this;
  this.client.on('message', function (topic, message) {
    if (self.receivedMsgHandler) {
      self.receivedMsgHandler(message, {event: 'message'});
    }
  });
}

/**
 * Send a message to the broker. Equivalent to publishing to a topic.
 * @param msg {string} Message to send to broker.
 * @param context {object.<string, string>} context.topic contains the topic string
 */
MQTTClient.prototype.send = function (msg, context) {
  throw new Error("send() is not supported for MQTT clients. They can only subscribe to data from MQTT services.");
};

/**
 * Set a handler for all received messages.
 * @param handler {function(message,context)} called when a message is received
 */
MQTTClient.prototype.setReceivedMessageHandler = function(handler) {
  this.receivedMsgHandler = handler;
};

/**
 * close connection. Sends FIN to the other side.
 */
MQTTClient.prototype.done = function () {
    this.client.end();
};

module.exports = MQTTClient;