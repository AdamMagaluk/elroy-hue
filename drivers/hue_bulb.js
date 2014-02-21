var HueBulbDriver = module.exports = function() {
  this.type = 'huebulb';
  this.name = data.id;
  this.data = data;
  this.state = 'off';
};

HueBulbDriver.prototype.init = function(config) {
  config
    .when('on', { allow: ['turn-off', 'toggle'] })
    .when('off', { allow: ['turn-on', 'toggle'] })
    .map('turn-on', this.turnOn)
    .map('turn-off', this.turnOff)
    .map('toggle', this.toggle)
};

HueBulbDriver.prototype.turnOn = function(cb) {
  this.state = 'on';
  cb();
};

HueBulbDriver.prototype.turnOff = function(cb) {
  this.state = 'off';
  cb();
};

HueBulbDriver.prototype.toggle = function(cb) {
  if (this.state === 'off') {
    this.call('turn-on');
    cb();
  } else if (this.state === 'on') {
    this.call('turn-off');
    cb();
  } else {
    cb(new Error('Invalid state - Valid states are "on" and "off".'));
  }
};
