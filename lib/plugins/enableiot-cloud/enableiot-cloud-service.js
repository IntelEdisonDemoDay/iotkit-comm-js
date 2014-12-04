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
EnableIoTCloudService.prototype.interface = "client-interface";
EnableIoTCloudService.prototype.provides_secure_comm = true;
EnableIoTCloudService.prototype.communicates_via_proxy = true;

/**
 * Topic to publish or subscribe data to. This is the only topic
 * the cloud supports.
 */
EnableIoTCloudService.prototype.topic = "data";

/**
 * Create a client that connects to the {@tutorial cloud}. The cloud is described just like any other service:
 * by using a service specification.
 * @param serviceSpec {object} specification for the cloud ({@tutorial service-spec-query})
 * @constructor
 */
function EnableIoTCloudService(serviceSpec) {
  if (!serviceSpec.port) {
    serviceSpec.port = 1884;
  }

  if (!serviceSpec.address) {
    serviceSpec.address = "127.0.0.1";
  }

  this.client = mqtt.createClient(serviceSpec.port, serviceSpec.address);
  this.spec = serviceSpec;

  var nameParts = this.spec.name.split("/");
  if (!nameParts[nameParts.length - 1] || !nameParts[nameParts.length - 2]) {
    throw new Error(this.spec.name +
    " has an incorrect format. Correct format is [namespace]/sensorType/sensorName");
  }
  this.sensor = nameParts[nameParts.length - 1];
  this.sensorType = nameParts[nameParts.length - 2];
  registerSensor.call(this);
}

/*
 * Register a new sensor with the cloud. Once registered, data can be published to the
 * cloud for this sensor (see {@tutorial cloud}).
 * @param sensorname {string} name of the sensor to register
 * @param type {string} supported types are 'temperature.v1.0', 'humidity.v1.0' ({@tutorial cloud})
 * @param unit {string} not supported yet. This parameter is ignored.
 */
function registerSensor() {
  this.client.publish(this.topic, JSON.stringify({"n":this.sensor, "t": this.sensorType}));
}

/**
 * Send a message to the cloud broker. Equivalent to publishing to a topic.
 * @param msg {string} Message to send to cloud broker (see {@tutorial cloud}).
 * @param context {object.<string, string>} context.topic is contains the topic string
 */
EnableIoTCloudService.prototype.send = function (msg, context) {
  this.client.publish(this.topic, JSON.stringify({"n": this.sensor,"v": msg}));
};

/**
 * Set a handler for all received messages.
 * @param handler {function} called when a message is received
 */
EnableIoTCloudService.prototype.setReceivedMessageHandler = function(handler) {
  console.log("WARNING: setReceivedMessageHandler() is not supported because cloud does not send any messages.");
};

/**
 * close connection. Sends FIN to the {@tutorial cloud}.
 */
EnableIoTCloudService.prototype.done = function (context) {
  this.client.end();
};

module.exports = EnableIoTCloudService;
