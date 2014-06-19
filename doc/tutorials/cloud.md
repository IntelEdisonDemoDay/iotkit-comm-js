To publish data to the cloud and later subscribe to it, you will need to:

1. Create a cloud account
1. Create a profile for your Edison
1. Connect your Edison to its profile in the cloud
1. Publish data from your Edison
1. Subscribe to data

#### Create a cloud account

Go to Intel's [enableiot cloud][1] site and follow instructions to create an account. Once an account is created,
an `activation key` will be available in the account details section ![account details](../images/cloud-account-details
.png). Note down this activation key.

#### Create a profile for your Edison

Creating a profile involves:
1. Getting your Edison's ID
1. Using the ID to register your Edison with the cloud

###### Getting your Edison's ID

You can get the device id by running the following in an Edison terminal:

```sh
cd /usr/lib/node_modules/iotkit-agent
node iotkit-admin.js device-id
```

###### Using the ID to register your Edison with the cloud

When you log in to your account, the first page you see is the dashboard. Click on 'devices'
![devices](../images/cloud-devices.png); then, click on the 'Add New Device' button. Enter appropriate details about
your device; if you do not have a *gateway id* or don't know what that means,
just enter the Edison ID in this field. Once you have saved the profile, proceed to the next step: connecting your
Edison to this profile.

#### Connect your Edison to its profile in the cloud

Before you connect your Edison, you should first test if it can reach the cloud:

```sh
cd /usr/lib/node_modules/iotkit-agent
node iotkit-admin.js test
```

If there are no errors, do the following:

```sh
cd /usr/lib/node_modules/iotkit-agent
node iotkit-admin.js activate [your-activation-key]
```

If there are no errors, your Edison is connected and ready to publish data.

#### Publish data from your Edison

*This section assumes that you know how to write a client application using iecf. If not,
please go through the [client]{@tutorial client} tutorial first.*

Create a service query for the cloud (`enableiot-cloud-query.json`):

```json
{
    "name" : "enableiot_cloud",
    "type" : {
        "name": "iotkit",
        "protocol" : "tcp"
    },
    "address" : "127.0.0.1",
    "port" : 1884
}
```

Write the code to publish data:

```js
var iecf = require('iecf');

var validator = new iecf.ServiceSpecValidator();
validator.readServiceSpecFromFile(path.join(__dirname, "enableiot-cloud-query.json"));

iecf.createClientForGivenService(validator.getValidatedSpec(), function (client) {
  client.comm.registerSensor("garage","temperature.v1.0");

  var msg = {"n": "garage","v": i};
  client.comm.send(JSON.stringify(msg), {"topic": "data"} );
});
```

Note above, that data can only be published using sensors. The cloud supports two types of sensors by default
temperature (`temperature.v1.0`) and humidity (`humidity.v1.0`). You may create other types by going to
the account details ![account details](../images/cloud-account-details.png) page; then, clicking on the 'Catalog'
tab; and then finally, clicking on the 'Add a New Catalog Item' button.

After you've registered the sensor you can publish a reading or observation by using `client.comm.send`. Make sure
the observation is a valid JSON object that contains both the `n` (name) and `v` (value) fields. Also,
note that the topic under which the observation is published is "data". This is currently the only topic supported by
 the cloud.

#### Subscribe to data

*This section assumes that you know how to write a client application using iecf. If not,
please go through the [client]{@tutorial client} tutorial first.*

Create a service query for the cloud (`enableiot-cloud-query.json`):

```json
{
    "name" : "enableiot_cloud",
    "type" : {
        "name": "iotkit",
        "protocol" : "tcp"
    },
    "address" : "127.0.0.1",
    "port" : 1884
}
```

Write the code to subscribe to the data:

```js
var iecf = require('iecf');

var validator = new iecf.ServiceSpecValidator();
validator.readServiceSpecFromFile(path.join(__dirname, "enableiot-cloud-query.json"));

iecf.createClientForGivenService(validator.getValidatedSpec(), function (client) {
  client.comm.subscribe();

  client.comm.setReceivedMessageHandler(function(message, context) {
    console.log(message)
  });
});
```

To receive data you must first `subscribe` to it. Note that `subscribe` does not take a topic as
argument. This is because the only supported topic, for now, is "data" and so it is assumed by default.

[1]: https://dashboard.us.enableiot.com