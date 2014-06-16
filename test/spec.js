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

/** @module test/spec */

/**
 * @file Tests if a service specification is correctly validated
 * @see {@link module:test/spec~wellformed|test well-formed service specification}
 */

var expect = require('chai').expect;
var path = require('path');

describe('[spec]', function () {

    /**
     * @function module:test/spec~wellformed
     */
    it("should validate a correct spec without throwing an error", function() {
      var iecf = require('iecf');

      var validator = new iecf.ServiceSpecValidator();
      validator.readServiceSpecFromFile(path.join(__dirname, "resources/serviceSpecs/1889-mqtt-mini-broker-spec.json"));
      var spec = validator.getValidatedSpec();

      expect(spec.name).to.be.a('string');
    });
});
