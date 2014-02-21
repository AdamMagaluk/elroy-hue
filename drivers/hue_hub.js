var HueHubDriver = module.exports = function(data) {
  this.type = 'huehub';
  this.name = data.id;
  this.data = data;

  if(!data.registered)
    this.state = 'unregistered';
  else
    this.state = 'registered';
};

HueHubDriver.prototype.init = function(config) {
  config
    .when('unregistered', { allow: ['register'] })
    .map('register', this.register);
};

HueHubDriver.prototype.register = function(cb) {
  cb();
};
