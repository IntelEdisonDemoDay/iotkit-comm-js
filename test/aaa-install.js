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
 * Tests if the Edison library is correctly installed. File is named
 * aaa-install.js so that when the test runner ('mocha') sorts test files, this
 * one will be run first. If any test in this suite fails, please ignore errors
 * in the rest of the tests.
 * @module test/install
 * @see module:test/install~configuration
 */

var expect = require('chai').expect;

describe('[install]', function () {
  /**
   * @function module:test/install~configuration
   */
  it("should verify if edison library is correctly installed", function() {
    var iecf = require('iecf');
    expect(iecf.sayhello()).to.equal("Hello Edison user!");
  });
});