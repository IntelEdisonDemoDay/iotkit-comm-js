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

var mqtt = require ('mqtt');

var calist = [];
calist.push('/usr/local/iotkit-comm/myca_credentials/myca.crt');

var opts = {
  keyPath: '/Users/adua/.iotkit-comm/adua-mac01.local_adua_credentials/adua-mac01.local_adua_key',
  certPath: '/Users/adua/.iotkit-comm/adua-mac01.local_adua_credentials/adua-mac01.local_adua_key.crt',
  ca: calist
};

var client = mqtt.createSecureClient(8883, "adua-mac01.local", opts);

setInterval(function () {
  client.publish("/INTEL/NDG/temperature", "test message");
}, 200);
