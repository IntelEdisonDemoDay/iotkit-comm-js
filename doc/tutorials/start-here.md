To start working with the iecf library, you will need to:

  1. Install it
  2. Write a "hello world" program (optional)
  3. Run a sample program (optional)
  4. Learn more (optional)

### Install it

No installation is required on the Edison device *(support for other platforms coming soon)*.

### Write a "hello world" program

`helloworld.js`:

```
var iecf = require('iecf');
console.log(iecf.sayhello());
```

Then, in a terminal:

```bash
node helloworld.js
```

### Run a sample program

On the Edison device, iecf sample programs can be found in `/usr/share/iecf-js/examples`. On
other platforms, they should most likely be in `/usr/local/lib/node_modules/iecf/example`. Here is how you
run the distributed thermostat sample application included in the iecf sources:

```bash
$ cd path-to-examples-directory # see above
$ node temperature-sensor.js
```

Then, in another terminal:

```
$ cd path-to-examples-directory
$ node thermostat.js
```

In the `thermostat.js` terminal, you should see output like this:

```
Found new temperature sensor - 127.0.0.1:32692
Received sample temperature 84 from 127.0.0.1:32692
New average ambient temperature (cumulative): 42
Received sample temperature 89 from 127.0.0.1:32692
New average ambient temperature (cumulative): 57.666666666666664
Received sample temperature 62 from 127.0.0.1:32692
New average ambient temperature (cumulative): 58.75
```
You can run multiple instances of 'temperature-sensor.js'; the thermostat will find those sensors and
include their temperature data in the mean.

### Learn More

1. Write a [server]{@tutorial service}
1. Write a [client]{@tutorial client}
1. Understand [service specifications and queries]{@tutorial service-spec-query} **(important)**
1. Learn to write a [distributed application]{@tutorial apps} using iecf
1. Learn to publish data to the [cloud]{@tutorial cloud} and subscribe to it
1. Study the unit tests included in the iecf sources *(coming soon)*
1. Understand the iecf architecture *(coming soon)*
