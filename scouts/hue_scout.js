var util = require('util')
  , EventEmitter = require('events').EventEmitter
  , hue = require("node-hue-api")
  , HueHubDriver = require('../drivers/hue_hub');

var HueScout = module.exports = function() {
  EventEmitter.call(this);
};
util.inherits(HueScout, EventEmitter);

HueScout.prototype.init = function(registry,cb) {
  cb();
};

HueScout.prototype.search = function() {
  hue.locateBridges(function(err, hubs) {
    if(err)
      return;

    hubs.forEach(function(hueHub){
      console.log('found hue ' + hueHub)
      self.emit('discover', HueHubDriver,hueHub);
    });

  });
};

HueScout.prototype.compare = function(a,b) {
  return (a.data.id === b.data.id);
};




