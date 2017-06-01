"use strict";
const exec = require('child_process').exec,
  _ = require('underscore')
  Promise = require("bluebird");

let TypingsMachine = {
  excludeTheseModules: ["bluebird", "cheerio", "request-promise", "request","underscore"],
  createTypingFile: function(moduleName){
    return new Promise(function(resolve, reject) {
      exec("dts-gen -m " + moduleName + " -overwrite -f ./src/types/" + moduleName + ".d.ts", (error, stdout, stderr) => {
        if (error) reject(error);
        if (stderr) reject(stderr);
        resolve(moduleName);
      });
    });
  },
  objToArray: function(obj){

    let self = this;
    let items = [];

    _(obj).each(function(elem, key){
      items.push(key);
    });

    // filter out modules that already have d.ts files,
    // as discovered from errors in createTypingsFiles.out.js
    let filteredList = _.reject(items, function(item) {
      return _.contains(self.excludeTheseModules,item);
    });

    return filteredList;

  },
  readPackageDependencies: function(){
    let packageList = require("./package.json");

    if(packageList && packageList.dependencies) {
      this.objToArray(packageList.dependencies).forEach(function(moduleName, i, collection) {
        this.createTypingFile(moduleName).then(modName => {
          console.log(modName + " d.ts created ");
        }).catch( err => {
          console.log(moduleName + " " + err);
        });

      }, this);
    }
    //if(packageList && packageList.devDependencies) this.packageDependency(packageList.devDependencies);
  }
}
TypingsMachine.readPackageDependencies();