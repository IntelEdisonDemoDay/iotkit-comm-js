To publish data to the cloud, you will need to:

1. Create a cloud account
1. Register your Edison
1. Setup your Edison to publish data
1. Publish data
1. View the published data *(optional)*
1. Subscribe to the data

*Note: the first three steps only need to be done once*

#### Create a cloud account

Go to Intel's [enableiot cloud][1] site and follow instructions to create an account. Once an account is created,
an `activation key` will be available in the account details section ![account details](../images/cloud-account-details
.png). Record this activation key.

#### Register your Edison

```sh
iotkit-admin activate [your-activation-key]
```

#### Setup your Edison to publish data

```sh
systemctl enable iotkit-agent
systemctl start iotkit-agent
```

#### Publish data

*This section assumes that you know how to write a client application using iotkit-comm. If not,
please go through the [client]{@tutorial client} tutorial first.*

Create a service specification for your sensor (example: `garage-sensor-spec.json`):

```json
{
    "name" : "temperature.v1.0/garage_sensor",
    "type" : {
        "name": "enableiot-cloud"
    }
}
```

Write the code to publish data:

```js
var path = require('path');
var iotkit = require('iotkit-comm');
var spec = new iotkit.ServiceSpec(path.join(__dirname, "garage-sensor-spec.json"));
iotkit.createService(spec, function (service) {
  setInterval(function () {
    service.comm.send(68);
  }, 500);
});
```

It is important to know that data can only be published using sensors. The cloud supports two types of sensors by
default: temperature (`temperature.v1.0`) and humidity (`humidity.v1.0`). You may create other types by going to the
account details ![account details](../images/cloud-account-details.png) page; then, clicking on the 'Catalog' tab;
and then finally, clicking on the 'Add a New Catalog Item' button. These need to specified as the second-last
path element in the `name` field of the specification. The last path element is the friendly name of the sensor, e.g.
 `garage_sensor`. As soon as the service is started, the sensor `garage_sensor` is registered with the cloud and data
  can be published as necessary.

#### View the published data

Go to Intel's [enableiot cloud][1] site, login, click on the "Menu" button ![Menu](../images/menu.png),
and click "Charts". Then, select your device and sensor-type to see a graph of your published data vs.
time.

#### Subscribe to the data

To receive the data published by the sample `garage_sensor` service, create the needed service query (example:
`garage-sensor-spec.json`):

```json
{
    "name" : "temperature.v1.0/garage_sensor",
    "type" : {
        "name": "enableiot-cloud"
    }
}
```

Then, write the code to receive the data:

```js
var path = require('path');
var iotkit = require('iotkit-comm');
var spec = new iotkit.ServiceSpec(path.join(__dirname, "garage-sensor-spec.json"));
iotkit.createClient(spec, function (client) {
  client.comm.setReceivedMessageHandler(function(message, context) {
    console.log(message);
  });
});
```

[1]: https://dashboard.us.enableiot.com