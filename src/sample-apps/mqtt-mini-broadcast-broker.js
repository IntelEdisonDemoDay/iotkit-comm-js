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

/**
 * @file Shows a mini broadcast broker. The broker also advertises its existence on the LAN.
 * In this case, it advertises itself with the word 'minibroker' in its name. Please note that this is
 * merely a convention. To test this service, run it and then start the MQTT client
 * {@link sample-apps/browse-services-create-mqtt-client.js} somewhere on the LAN. Notice that this
 * client queries for a service with the word 'minibroker' in its name.
 */

var edisonLib = require('iecf');

var validator = new edisonLib.ServiceSpecValidator();
validator.readServiceSpecFromFile("./serviceSpecs/mqtt-mini-broker-spec.json");

edisonLib.createService(validator.getValidatedSpec(), function (service) {
  "use strict";

  var clients = {};

  service.comm.setReceivedMessageHandler(function(client, msg, context) {
    "use strict";

    switch (context.event) {
      case 'connect':
        clients[msg.clientId] = client;
        service.comm.sendTo(client, msg, {ack: 'connack'});
        break;
      case 'publish':
        for (var clientId in clients) {
          if (!clients.hasOwnProperty(clientId))
            continue;
          service.comm.sendTo(clients[clientId], msg);
        }
        break;
      case 'subscribe':
        service.comm.sendTo(client, msg, {ack: 'suback'});
        break;
      case 'close':
        for (var clientId in clients) {
          if (!clients.hasOwnProperty(clientId))
            continue;
          if (clients[clientId] == client) {
            delete clients[clientId];
          }
        }
        break;
      case 'pingreq':
        service.comm.sendTo(client, msg, {ack: 'pingresp'});
        break;
      case 'disconnect':
      case 'error':
        service.comm.manageClient(client, {action: 'endstream'});
        break;
      default:
        console.log(context.event);
    }
  });

});