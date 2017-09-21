 /*eslint-env mocha */
 "use strict";
 
 var fs = require("fs"),
  Promise = require("bluebird"),
  path = require("path");

// config configs {executingPath : process.cwd()}

// -tc = alternate config file used during testing
 
'use strict';

module.exports = function (config) {

  config.module = "args";

  var module = {
    config: config,
    testConfigFile: undefined,
    testConfigSettings: undefined
  };
 
  module.getAlternateConfig= function(args){
    var self = this;
    return new Promise(function(resolve, reject) {
      let requestAlternateConfigIndex = args.indexOf('-tc');
      let configFileName = (requestAlternateConfigIndex != -1 ) ? args[requestAlternateConfigIndex+1] : null;

      if(!configFileName) reject("config file name is malformed");

      self.readConfigFilePromise(configFileName).then(data => {
        self.testConfigSettings = data;
        resolve();
      }).catch(err => {
        reject(err);
      });
    });
  };
  module.getTestConfigFile=function(){
    return this.testConfigFile;
  };
  module.getTestConfigSettings=function(){
    return this.testConfigSettings;
  };
  module.readConfigFilePromise= function(filename){
    var self = this;
    return new Promise(function(resolve, reject) {
      if(!filename) return reject("empty params");

      let filePath = path.join(config.executingPath,filename);

      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          return reject(err);
        }
        self.testConfigSettings = data;
        self.testConfigFile = filePath;
        return resolve (data);
      });
    });
  };

  return module;
}

