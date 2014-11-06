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
MQTTService.prototype.interface = "client-interface";
MQTTService.prototype.provides_secure_comm = true;

/**
 * Create a client that connects to an MQTT broker described in the service specification.
 * @param serviceSpec {object} {@tutorial service-spec-query}
 * @constructor
 */
function MQTTService(serviceSpec, crypto) {
  if (!serviceSpec.port) {
      serviceSpec.port = 1883;
  }

  if (!serviceSpec.address) {
      serviceSpec.address = "127.0.0.1";
  }

  if (crypto) {
    if(!serviceSpec.properties) {
      serviceSpec.properties = {};
    }
    serviceSpec.properties.secureaddress = crypto.getHost();
    serviceSpec.properties.secureport = crypto.getMosquittoSecurePort();
  }

  if (serviceSpec.type_params.mustsecure) {
    if (!crypto) {
      throw new Error("Cannot secure communication channel." +
      " Please setup and configure credentials using iotkit-comm setupAuthentication.");
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
}

/**
 * Send a message to the broker. Equivalent to publishing to a topic.
 * @param msg {string} Message to send to broker.
 * @param context {object.<string, string>} context.topic contains the topic string
 */
MQTTService.prototype.send = function (msg, context) {
  if (context && context.topic) {
    this.client.publish(context.topic, msg);
  } else {
    this.client.publish(this.spec.name, msg);
  }
};

/**
 * Set a handler for all received messages.
 * @param handler {function(message,context)} called when a message is received
 */
MQTTService.prototype.setReceivedMessageHandler = function(handler) {
  throw new Error("WARNING: setReceivedMessageHandler() is not supported for MQTT Services." +
  " They can only publish data.");
};

/**
 * close connection. Sends FIN to the other side.
 */
MQTTService.prototype.done = function () {
  this.client.end();
};

module.exports = MQTTService;