Publishing and subscribing to data from the cloud requires that you:

1. Create a cloud account
2. Publish data
3. View the published data
4. Subscribe to the data
5. Troubleshoot *(if necessary)*

#### Create a cloud account

Go to Intel's [enableiot cloud][1] site and follow instructions to create an account. Once an account is
created, an *activation key* will be available in the account details section ![account details](.
./images/cloud-account-details.png). Record this activation key; note that it will *expire* in less than *one hour*.
If your activation key has expired, you can always create a new one by clicking on the adjacent 'refresh' button.

#### Publish data

Create a service specification for your sensor (example: `garage-sensor-spec.json`):

```json
{
    "name" : "temperature.v1.0/garage_sensor",
    "type" : {
        "name": "enableiot"
    },
    "port": 32452,
    "type_params": {"deviceid":"EdisonInGarage", "activationCode":"<<YOUR DEVICE ACTIVATION CODE>>"}
}
```

Finally, write the code to publish data:

```js
var path = require('path');
var iotkit = require('iotkit-comm');
var spec = new iotkit.ServiceSpec(path.join(__dirname, "garage-sensor-spec.json"));
iotkit.createService(spec, function (service) {
  setInterval(function () {
    service.comm.send({name:'garage_sensor', valuestr: '68'});
  }, 500);
});
```

It is important to know that data can only be published using sensors. The cloud supports two types of sensors by
default: temperature (`temperature.v1.0`) and humidity (`humidity.v1.0`). You may create other types by going to the
account details ![account details](../images/cloud-account-details.png) page; then, clicking on the 'Catalog' tab;
and then finally, clicking on the 'Add a New Catalog Item' button. These need to be specified as the second-last
path element in the `name` field of the specification. The last path element is the friendly name of the sensor, e.g.
 `garage_sensor`. As soon as the service is started, the sensor `garage_sensor` is registered with the cloud and data
  can be published as necessary.

#### View the published data

Go to Intel's [enableiot cloud][1] site, login, click on the "Menu" button ![Menu](../images/menu.png),
and click "Charts". Then, select your device and sensor-type to see a graph of your published data vs.
time.

#### Subscribe to the data

To receive data published by the sample `garage_sensor` service running on `EdisonInGarage`, create a
service query (example: `garage-sensor-query.json`):

```json
{
    "name" : "temperature.v1.0/garage_sensor",
    "type" : {
        "name": "enableiot"
    },
    "type_params": {"deviceid": "EdisonInGarage", "activationCode":"<<YOUR DEVICE ACTIVATION CODE>>", "subscribeto": "EdisonInGarage", "frequencyInterval": 5}
}
```

Then, write the code to receive the data:

```js
var path = require('path');
var iotkit = require('iotkit-comm');
var spec = new iotkit.ServiceSpec(path.join(__dirname, "garage-sensor-query.json"));
iotkit.createClient(spec, function (client) {
  client.comm.setReceivedMessageHandler(function(message, context) {
    var jsonmsg = JSON.parse(message);
    if(jsonmsg.data.series.length > 0) {
      var series = jsonmsg.data.series[0].points;
      for(var data in series) {
          console.log('Received value', series[data].value);
      }
    }
  });
});
```

#### Troubleshooting

Some of the most common issues stem from not being connected to the network. We suggest running the following
command on your Edison to ensure that you are connected to the cloud:

```sh
curl www.intel.com/edison
```

If this command hangs or fails with an error, it means the Edison is not connected to the Internet.

NOTE: please ensure that the activation key has not expired; you can always create a new one as described in the
'Create a cloud account' section above.

[1]: https://dashboard.us.enableiot.com
