var HelloApp = module.exports = function() {
  this.name = 'hello';
};

HelloApp.prototype.init = function(elroy) {
  var self = this;
  elroy.on('deviceready',function(device){
    if(device.type !== 'huehub')
      return;

    elroy.expose(device);

    device.on('newlight',function(light){
      self.elroy.expose(light);
    });

    device.on('error',function(err){
      console.log('hue hub error:'+err);
    });

  });

};
