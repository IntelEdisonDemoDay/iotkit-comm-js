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
EdisonIoTKitClient.prototype.interface = "edison-iotkit-client-interface";

/**
 * The client instance this plugin creates ({@tutorial plugin}).
 * @type {object}
 */
EdisonIoTKitClient.prototype.client = {};

/**
 * The client-side plugin needs a received message handler to process messages coming from the server
 * ({@tutorial plugin}).
 * @type {function}
 */
EdisonIoTKitClient.prototype.receivedMsgHandler = null;

/**
 * Create a client that connects to the cloud. The cloud is described just like any other service:
 * by using a service specification ({@tutorial cloud}).
 * @param serviceSpec {object} specification for the cloud ({@tutorial service-spec})
 * @constructor
 */
function EdisonIoTKitClient(serviceSpec) {
    "use strict";

    if (serviceSpec.comm_params && serviceSpec.comm_params['ssl']) {
        this.client = mqtt.createSecureClient(serviceSpec.port, serviceSpec.address,
            serviceSpec.comm_params.args);
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
 * Register a new sensor with the cloud. Once registered, data can be published to the
 * cloud for this sensor ({@tutorial cloud}).
 * @param sensorname {string} name of the sensor to register
 * @param type {string} supported types are 'temperature.v1.0', 'humidity.v1.0' ({@tutorial cloud})
 * @param unit {string} not supported yet. This parameter is ignored.
 */
EdisonIoTKitClient.prototype.registerSensor = function(sensorname, type, unit){
    this.client.publish("data", JSON.stringify({"n":sensorname, "t": type}));
}

/**
 * Send a message to the cloud broker. Equivalent to publishing to a topic.
 * @param msg {string} Message to send to cloud broker.
 * @param context {object.<string, string>} context.topic is contains the topic string
 */
EdisonIoTKitClient.prototype.send = function (msg, context) {
    this.client.publish(context.topic, msg);
};

/**
 * subscribe to data published by all your sensors. No other topic subscriptions are supported
 */
EdisonIoTKitClient.prototype.subscribe = function () {
    this.client.subscribe("data");
};

/**
 * Not supported at the moment.
 * @param topic
 */
EdisonIoTKitClient.prototype.unsubscribe = function (topic) {
    "use strict";
};

/**
 * Set a handler for all received messages.
 * @param handler {function} called when a message is received
 */
EdisonIoTKitClient.prototype.setReceivedMessageHandler = function(handler) {
    "use strict";
    this.receivedMsgHandler = handler;
};

/**
 * close connection. Sends FIN to the cloud.
 */
EdisonIoTKitClient.prototype.done = function () {
    this.client.end();
};

module.exports = EdisonIoTKitClient;
