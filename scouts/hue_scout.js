var util = require('util')
  , EventEmitter = require('events').EventEmitter
  , hue = require("node-hue-api")
  , HueHubDriver = require('../drivers/hue_hub');

var HueScout = module.exports = function() {
  this.interval = 15000;
  EventEmitter.call(this);
};
util.inherits(HueScout, EventEmitter);

HueScout.prototype.init = function(registry,cb) {

  // init devices in registry first.
  registry.json_devices.map(function(device){
    if(device.type !== 'huehub')
      return;
    registry.setupDevice(HueHubDriver,device.data);
  });

  cb();

  // start search logic
  this.search();
  setInterval(this.search.bind(this),this.interval);
};

HueScout.prototype.search = function() {
  var self = this;
  hue.locateBridges(function(err, hubs) {
    if(err)
      return;

    hubs.forEach(function(hueHub){
      self.emit('discover', HueHubDriver,hueHub);
    });
  });
};

HueScout.prototype.compare = function(a,b) {
  return (a.data.id === b.data.id);
};
