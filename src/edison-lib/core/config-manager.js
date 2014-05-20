/**
 * <insert one-line description of what the program does>
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
var fs = require('fs');
var path = require('path');

var CORE_PLUGINS_DIR_NAME = "plugins";
var CORE_PLUGIN_INTERFACE_DIR_NAME = "plugin-interfaces";
var PLUGIN_SUPER_INTERFACE_FILE_NAME = "interface-for-interfaces.json";
var USER_DEFINED_CONFIG_FILE_NAME = ".edison-config.json";

function getUserHomeDirPath() {
  return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
}

function concatUserDefinedConfigFile() {
  "use strict";
  var userDefinedConfigFilePath = path.join(getUserHomeDirPath(), USER_DEFINED_CONFIG_FILE_NAME);
  if (!fs.existsSync(userDefinedConfigFilePath)) {
    console.log("INFO: no user defined configuration file '" + userDefinedConfigFilePath + "' found. " +
      "Continuing as usual.");
    return;
  }

  try {
    var userConfig = JSON.parse(fs.readFileSync(userDefinedConfigFilePath));
  } catch (err) {
    console.log("ERROR: empty or malformed configuration file at '" + userDefinedConfigFilePath +
      "'. Config file must be in JSON format.");
    throw err;
  }

  if (!userConfig.pluginDirPaths || userConfig.pluginDirPaths.length == 0) {
    return;
  }

  exports.config.pluginDirPaths = exports.config.pluginDirPaths.concat(userConfig.pluginDirPaths);
  exports.config.pluginInterfaceDirPaths = exports.config.pluginInterfaceDirPaths.concat(userConfig.pluginInterfaceDirPaths);
}

exports.config = null;

exports.init = function (dir, configFileName) {
  "use strict";
  exports.config = JSON.parse(fs.readFileSync(path.join(dir, configFileName)));
  exports.config.pluginDirPaths.push(path.join(dir, CORE_PLUGINS_DIR_NAME));
  var pluginInterfaceDirPath = path.join(dir, CORE_PLUGIN_INTERFACE_DIR_NAME);
  exports.config.pluginInterfaceDirPaths.push(pluginInterfaceDirPath);
  exports.config.superInterfaceFilePath = path.join(pluginInterfaceDirPath, PLUGIN_SUPER_INTERFACE_FILE_NAME);

  concatUserDefinedConfigFile();
};