var path = require("path");

var iecf = require('iecf');

var validator = new iecf.ServiceSpecValidator();
validator.readServiceSpecFromFile("../serviceSpecs/IOTKitCloudBrokerSubOnly.json");

validator.spec.comm_params.args.keyPath = path.resolve("../serviceSpecs/", validator.spec.comm_params.args.keyPath);
validator.spec.comm_params.args.certPath = path.resolve("../serviceSpecs/", validator.spec.comm_params.args.certPath);

var brokerSpec = validator.getValidatedSpec();

iecf.createClientForGivenService(brokerSpec, function (client) {

  client.comm.subscribe(brokerSpec.name + "/b8-e8-56-37-7a-55");
  client.comm.subscribe(brokerSpec.name + "/b8-e8-56-37-7a-33");

  client.comm.setReceivedMessageHandler(function(message, context) {
    "use strict";

    var m = JSON.parse(message);
    if (m.data_source[0].metrics[0].name === 'love'
      || m.data_source[0].metrics[0].name === 'steps') {
      console.log(m.data_source[0].metrics[0]);
    }

  });

});