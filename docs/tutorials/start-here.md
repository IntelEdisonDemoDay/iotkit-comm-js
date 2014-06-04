To start working with the IECF node.js library you will need to:

  1. Setup the Edison board
  2. Setup the IECF library
  3. Run a sample program (just to make sure IECF is correctly configured)

### Setup the Edison board

From the perspective of the IECF library, an Edison board is setup when you can log into it from your PC using `ssh`
and successfully reach an Internet service via WiFi. The relevant instructions can be found at:

  1. {@tutorial connecting-to-pc}
  2. {@tutorial wifi-setup}

### Setup the IECF library

Login to the Edison using `ssh` from a terminal application. Then, to setup the IECF library do the following:

```
mkdir ~/edisonapps
cd ~/edisonapps
npm link iecf
```

We have assumed above, that you will be working in the `~/edisonapps` directory. However,
this is not a requirement.

### Run a sample program

To run a sample program provided with the library, do the following in an `ssh` terminal session established with the
Edison board:

```
cd ~/edisonapps
cp -r node_modules/iecf/src/sample-apps .
cd sample-apps
node zmq-publisher.js
```

Then, in another `ssh` terminal:

```
cd ~/edisonapps/sample-apps
node zmq-subscriber.js
```

In the `zmq-subscriber` terminal, you should see output like this:

```
{ event: 'message' }
mytopic: my message
{ event: 'message' }
mytopic: my message
{ event: 'message' }
mytopic: my message
```

Note: the order in which the publisher and subscriber are run is not important.

### Next Steps

Now that the IECF library is setup and you can run sample programs, its time to [write one of your own]{@tutorial
edison-apps}. Of course, feel free to browse through the rest of the sample programs in `~/edisonapps/sample-apps`.