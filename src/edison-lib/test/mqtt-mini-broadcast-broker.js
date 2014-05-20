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
 * Created by adua.
 */
exports.run = function () {
  "use strict";
  var path = require('path');
  var edisonLib = require('edisonapi');

  var validator = new edisonLib.ServiceSpecValidator();
  validator.readServiceSpecFromFile(path.join(__dirname, "serviceSpecs/temperatureServiceMQTT.json"));

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
};

if (process.argv[2] === 'dependency') { // running as a dependency to another test
  exports.run();
} else if (process.argv[1] === __filename) { // running from command line
  exports.run();
} else { // run by mocha as a test
  // do nothing
}