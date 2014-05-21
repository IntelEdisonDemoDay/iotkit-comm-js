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
 * Created by Pradeep.
 */
var mqtt = require('mqtt');

EdisonIoTKitClient.prototype.interface = "edison-iotkit-client-interface";

EdisonIoTKitClient.prototype.service = {};
EdisonIoTKitClient.prototype.receivedMsgHandler = null;

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

EdisonIoTKitClient.prototype.registerSensor = function(sensorname, type, unit){
    this.client.publish("data", JSON.stringify({"n":sensorname, "t": type}));
}

EdisonIoTKitClient.prototype.send = function (msg, context) {
    this.client.publish(context.topic, msg);
};

EdisonIoTKitClient.prototype.subscribe = function () {
    this.client.subscribe("data");
};

EdisonIoTKitClient.prototype.unsubscribe = function (topic) {
    "use strict";
};

EdisonIoTKitClient.prototype.setReceivedMessageHandler = function(handler) {
    "use strict";
    this.receivedMsgHandler = handler;
};

EdisonIoTKitClient.prototype.done = function () {
    this.client.end();
};

module.exports = EdisonIoTKitClient;
