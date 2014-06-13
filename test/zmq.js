/*
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
 */

/** @module test/zmq */

/**
 * @file Tests the zmq plugin using various clients. Clients are either subscribers in the zmq pub/sub model
 * or requesters in the zmq req/rep model. In each case the client first discovers the service (a publisher
 * or replier) and then interacts with it.
 * @see {@link module:test/zmq~subscriber}
 * @see {@link module:test/zmq~requester}
 */

var path = require('path');
var spawn = require('child_process').spawn;
var expect = require('chai').expect;

var zmqpublisher, zmqreplier;

describe('[zmq]', function () {

  before(function () {
    "use strict";
    zmqpublisher = spawn('node', [path.join(__dirname, '../example/zmq-publisher.js')]);
    zmqreplier = spawn('node', [path.join(__dirname, '../example/zmq-replier.js')]);
  });

  after(function() {
    "use strict";
    zmqpublisher.kill();
    zmqreplier.kill();
  });

  // The mdns browser returns all new services it finds. This means, that once it
  // finds a service record, it won't find it again unless that service went down and came back up.
  // Since the service we want to discover is not restarted between tests, just restart the
  // service browser for each test.
  beforeEach(function() {
    var iecf = require('iecf');
    iecf.stopDiscoveringServices();
  });

  describe('#subscriber', function () {
    /**
     * Subscribes to topic "mytopic" from a ZMQ publisher.
     * @see {@link example/zmq-publisher.js}
     * @function module:test/zmq~subscriber
     */
    it("should successfully subscribe to messages from ZMQ publisher",
      function(done) {
        var iecf = require('iecf');

        var query = new iecf.ServiceQuery();
        query.initServiceQueryFromFile(path.join(__dirname, "../example/serviceQueries/temperatureServiceQueryZMQPUBSUB.json"));

        iecf.createClient(query, serviceFilter, function (client) {
          "use strict";

          client.comm.subscribe("mytopic");

          client.comm.setReceivedMessageHandler(function(message, context) {
            "use strict";
            expect(context.event).to.equal("message");
            expect(message.toString()).to.equal("mytopic: my message");

            // close client connection
            client.comm.done();
            done();
          });
        });

        function serviceFilter (serviceRecord) {
          "use strict";
          return true;
        }
      });
  }); // end #subscriber

  describe("#requester", function() {

    /**
     * Sends a request string to ZMQ replier. Any request should result in
     * the reply "hi".
     * @see {@link example/zmq-replier.js}
     * @function module:test/zmq~requester
     */
    it("should successfully receive reply from a ZMQ replier", function(done) {
      var iecf = require('iecf');

      var query = new iecf.ServiceQuery();
      query.initServiceQueryFromFile(path.join(__dirname, "../example/serviceQueries/temperatureServiceQueryZMQREQREP.json"));

      iecf.createClient(query, serviceFilter, function (client) {
        "use strict";

        client.comm.setReceivedMessageHandler(function(message, context) {
          "use strict";
          expect(context.event).to.equal("message");
          expect(message.toString()).to.equal("hi");
          client.comm.done();
          done();
        });

        client.comm.send("hello");
      });

      function serviceFilter (serviceRecord) {
        "use strict";
        return true;
      }
    });
  }); // end #requester

});