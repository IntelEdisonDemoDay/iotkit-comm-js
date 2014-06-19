var mqtt = require('mqtt');

// Sample data, replace it with sensor call results
var msg = {
  "n": "temp-sensor-4",
  "v": 26.7
};

var regmsg = {
  "n" : "temp-sensor-4",
  "t" : "temperature.v1.0",
};

// iotkit-agent's MQTT listener runs on 1884
var client = mqtt.createClient(1884);

client.publish("data", JSON.stringify(regmsg));

setInterval(function () {
  msg.v = getRandomInt(24, 48);
  var msgstr = JSON.stringify(msg);
  client.publish("data", msgstr);
}, 2000);

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
