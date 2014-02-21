var HueApi = require("node-hue-api").HueApi;
var HueBulbDriver = require('./hue_bulb');
var Scientist = require("elroy/scientist");

var HueHubDriver = module.exports = function(data) {
  this.type = 'huehub';
  this.name = data.id;
  this.data = data;
  this.lights = [];

  if(!data.registered)
    this.state = 'unregistered';
  else{
    this.state = 'registered';
    this.hue = new HueApi(this.data.ipaddress, this.data.user);
    this.findlights(function(){});
  }
};

HueHubDriver.prototype.init = function(config) {
  config
    .when('unregistered', { allow: ['register'] })
    .when('registered', { allow: ['findlights'] })
    .map('register', this.register)
    .map('findlights', this.findlights)
    .devices(this.lights);
};

HueHubDriver.prototype.register = function(cb) {
  var self = this;
  var hue = new HueApi();
  hue.createUser(this.data.ipaddress, null, null, function(err, user) {
    if (err)
      return cb(err);

    self.data.user = user;
    self.data.registered = true;
    self.state = 'registered';
    self.hue = new HueApi(self.data.ipaddress, self.data.user);
    self.findlights(function(){
      cb(null,user);
    })
  });
};

HueHubDriver.prototype._lightExists = function(light) {
  return (this.lights.filter(function(l){
    return (l.data.id === light.data.id);
  }).length > 0);
};

HueHubDriver.prototype.findlights = function(cb) {
  var self = this;
  this.hue.lights(function(err, res) {
    if (err)
      return cb(err);

    res.lights.forEach(function(light){
      var machine = Scientist.configure(HueBulbDriver,light,self.hue);

      if(self._lightExists(machine))
        return;

      self.lights.push(machine);
      self.emit('newlight',machine);
    });
    
    cb();
  });
};