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
 * Created by Pradeep.
 */

var mqtt = require('mqtt');

/**
 * Name of interface this plugin would like to adhere to ({@tutorial plugin})
 * @type {string}
 */
EnableIoTCloudClient.prototype.interface = "client-interface";
EnableIoTCloudClient.prototype.provides_secure_comm = true;

/**
 * Topic to publish or subscribe data to. This is the only topic
 * the cloud supports.
 */
EnableIoTCloudClient.prototype.topic = "data";

/**
 * Create a client that connects to the {@tutorial cloud}. The cloud is described just like any other service:
 * by using a service specification.
 * @param serviceSpec {object} specification for the cloud ({@tutorial service-spec-query})
 * @constructor
 */
function EnableIoTCloudClient(serviceSpec) {
  this.client = mqtt.createClient(1884, "127.0.0.1");
  this.spec = serviceSpec;

  var self = this;

  var nameParts = this.spec.name.split("/");
  if (!nameParts[nameParts.length - 1] || !nameParts[nameParts.length - 2]) {
    throw new Error(this.spec.name +
    " has an incorrect format. Correct format is [namespace]/sensorType/sensorName");
  }
  this.sensor = nameParts[nameParts.length - 1];
  this.sensorType = nameParts[nameParts.length - 2];

  this.client.subscribe(this.topic);

  this.client.on('message', function (topic, message) {
    if (self.receivedMsgHandler) {
      var msgobj = JSON.parse(message);
      self.receivedMsgHandler(msgobj.data[0].value, {event: 'message'});
    }
  });
}

EnableIoTCloudClient.prototype.send = function(msg, context) {
  throw new Error("send() is not supported. A cloud-client can only receive messages from the cloud.");
};

/**
 * Set a handler for all received messages.
 * @param handler {function} called when a message is received
 */
EnableIoTCloudClient.prototype.setReceivedMessageHandler = function(handler) {
  this.receivedMsgHandler = handler;
};

/**
 * close connection. Sends FIN to the {@tutorial cloud}.
 */
EnableIoTCloudClient.prototype.done = function (context) {
  this.client.unsubscribe(this.spec.name);
  this.client.end();
};

module.exports = EnableIoTCloudClient;
