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
 *
 * Created by adua.
 */
var expect = require('chai').expect;

describe('[edisonlib installation]', function () {
  it("should verify if edison library is correctly installed", function() {
    var edisonLib = require('edisonapi');
    expect(edisonLib.sayhello()).to.equal("Hello Edison user!");
  });
});