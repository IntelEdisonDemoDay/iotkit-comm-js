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
