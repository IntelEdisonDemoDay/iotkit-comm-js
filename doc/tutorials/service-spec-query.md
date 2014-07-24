Service specifications and queries are central to understanding how the iecf library simplifies the
development of distributed applications. A distributed application written using iecf is composed essentially
of clients and services. When creating a service, the developer:

1. Writes a *service specification*
2. Requests the iecf library to create a service based on that specification

When creating a client, the developer:

1. Writes a *service query*
2. Requests iecf to find and connect to a service whose attributes match that query

It is important to know that service specifications and queries are very similar: in code, service specification
is a child of service query. Thus, any function that takes a service query can be passed a service specification.
The fundamental difference between the two is that a service query is used by clients whereas a service specification
 is used by services: a specification is used to *initialize* a service while a query is used to *find* a service.

At this point, we will digress a little and explain what it means to find a service on the network. The act of
finding a service involves querying for it (by name, the protocol it uses, etc.) and getting the corresponding ip
address and port number in return. Now, a service can only be found if it is first advertised on the network. One can
 think of advertising a service as constantly broadcasting the corresponding service specification on the LAN (not
 actually true, but does simplify explaining the idea). When one of these service specifications "matches" a service
 query then we say that a service has been found. The protocol that takes care of advertising service specifications
 and matching them to service queries is called mDNS and you can learn more about it [here][1]. Please note that
 service specifications, queries, and matching are iokit-comm abstractions for underlying mDNS concepts. So you
 should not expect to find these terms in documents describing mDNS.

We will now explain how to write service specifications and queries. Before we get into the details though,
it is important to note that both service specifications and queries are *JSON strings* that fully or partially
describe the attributes of a service.

#### Service Specification

Here is a sample service specification:

```json
{
  "name": "/my/home/thermostat/temperature_sensor",
  "type": {
    "name": "zmqpubsub",
    "protocol": "tcp"
  },
  "type_params": {"ssl": false},
  "address" : "127.0.0.1",
  "port": 8999,
  "properties": {"dataType": "float", "unit": "F", "sensorType": "ambient"},
  "advertise": {"locally": true, "cloud": false}
}
```

Let's go through each of the above attributes:

* `name` *(compulsory)*: a string, preferably a user-friendly one, since service names might be displayed by other
applications
* `type` *(compulsory)*: the details of how messages are sent and received are indicated by the `type` field. The
`type` field usually contains the `name` of a *communication plugin*. In iecf, plugins abstract away the details of
*how* messages are sent, thus allowing developers to focus more on the contents of those messages.
  * `name` *(compulsory)*: name of the protocol this service will be speaking; this is also the name of the
  corresponding communication plugin.
  * protocol *(compulsory)*: this is the transport protocol; only 'tcp' or 'udp' is supported
* type_params *(optional)*:  A communication plugin may support configuration parameters that can be set here. iecf
passes this field "as-is" to the communication plugin.
* port *(compulsory)*: port number the service will run on
* properties *(optional)*: any user defined properties the service has. Each property must be a `"name": value` pair.
 Here, the properties indicate that the sensor is publishing the ambient temperature in Fahrenheit using a
 floating-point format. More on these properties when we talk about the thermostat.
* address *(optional)*: the address the service will run at. When not specified, `localhost` is used.
* advertise *(optional)*: when not present, service is advertised locally (on the LAN) by default. Currently,
iecf does not support advertising services in the cloud, so the 'cloud' field is essentially ignored.

This specification can then be passed to {@link module:main.createService}, which will eventually return an instance
of a service running at the given address and port.

#### Service Query

Here is a sample service query:

```json
{
  "name": ".*temperature_sensor$",
  "type": {
    "name": "zmqpubsub",
    "protocol": "tcp"
  }
}
```

Notice that this query matches the sample specification in the previous section. Additionally,
this query will find all temperature sensors on the LAN that speak the `zmqpubsub` protocol. With that in mind,
let's go through each of the above attributes:
* name *(optional)*: can be specified as a regular expression
* type *(compulsory)*
  * name *(compulsory)*: the higher level communication protocol the service uses. This allows the client to find only
   those services with which it can communicate. For example, a zmq subscriber will find only zmq publishers if it
   specifies `zmqpubsub` in the `type.name` field of the query (see [zeromq pub/sub sockets][2]).
  * protocol *(compulsory)*: the transport layer protocol (only tcp or udp supported)

This query can then be passed to {@link module:main.createClient}, which will eventually return a client instance
connected to the corresponding service. Now, here is a more detailed service query:

```json
{
  "name": "/my/home/thermostat/temperature_sensor",
  "type": {
    "name": "zmqpubsub",
    "protocol": "tcp"
  },
  "type_params": {"ssl": false}
  "address" : "127.0.0.1",
  "port": 8999,
  "properties": {"dataType": "float", "unit": "F", "sensorType": "ambient"}
}
```

Notice that it looks exactly like the specification in the previous section. An address and port number in a query
implies that the client already knows where the service is, thus, iecf will not search for the service. Instead,
a client instance connected to a service at the given address and port will be returned. Note also, that the
`type_params` field here can be used in the same way as the one in the service specification.

#### Learn more

* An [overview of communication plugins]{@tutorial plugin}

[1]: http://en.wikipedia.org/wiki/Multicast_DNS
[2]: http://zguide.zeromq.org/page:all#Getting-the-Message-Out