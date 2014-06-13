var path = require("path");
var iecf = require('iecf');

var validator = new iecf.ServiceSpecValidator();
validator.readServiceSpecFromFile("../serviceSpecs/IOTKitCloudBrokerBM.json");

validator.spec.comm_params.args.keyPath = path.resolve("../serviceSpecs/", validator.spec.comm_params.args.keyPath);
validator.spec.comm_params.args.certPath = path.resolve("../serviceSpecs/", validator.spec.comm_params.args.certPath);

var brokerSpec = validator.getValidatedSpec();

exports.client = {};

exports.deviceId = "b8-e8-56-37-7a-33";

exports.publishTopic = brokerSpec.name + "/" + exports.deviceId;

var msgTemplate = {
  "msg_type": "metrics_msg",
  "sender_id": exports.deviceId,
  "account_id": "pradeeptmp",
  "timestamp": 1399318044904,
  "data_source": [
    {
      "name": "self",
      "metrics": [
        {
          "name": "brandmessage",
          "sample": [
            {
              "value": "new brand message",
              "timestamp": 1399318044904
            }
          ]
        }
      ]
    }
  ]
};

iecf.createClientForGivenService(brokerSpec, function (client) {

    client.comm.subscribe(brokerSpec.name + "/" + exports.deviceId);

    client.comm.setReceivedMessageHandler(function(message, context) {
        "use strict";
        var m = JSON.parse(message);
        if (m.data_source[0].metrics[0].name === 'brandmessage') {
            console.log(m.data_source[0].metrics[0]);
        }
    });

    exports.client = client;

    setInterval(function () {
        "use strict";

        var mybm = {
            text: "Akshay's brand message",
            location: ["Portland", "Airplane"],
            timestamp: 12345678
        };

        exports.publishBrandMessage(mybm);

    }, 1000);

});

exports.publishBrandMessage = function (bm) {

  msgTemplate.timestamp = bm.timestamp;
  msgTemplate.data_source[0].metrics[0].name = 'brandmessage';
  msgTemplate.data_source[0].metrics[0].sample[0].value = bm.text;
  msgTemplate.data_source[0].metrics[0].sample[0].timestamp = bm.timestamp;

  exports.client.comm.send(JSON.stringify(msgTemplate), {topic: exports.publishTopic});
};
