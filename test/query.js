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

/**
 * Tests if a service query is correctly validated
 * @module test/query
 * @see {@link module:test/query~wellformed|test well-formed service query}
 */

var expect = require('chai').expect;
var path = require('path');

describe('[query]', function () {

  /**
   * @function module:test/query~wellformed
   */
  it("should validate a correct query without throwing an error", function() {
    var iecf = require('iecf');
    var query = new iecf.ServiceQuery(path.join(__dirname, "resources/serviceQueries/mqtt-mini-broker-query.json"));
    expect(query.name).to.be.a('string');
  });
});