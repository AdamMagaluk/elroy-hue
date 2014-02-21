var HelloApp = module.exports = function() {
  this.name = 'hello';
};

HelloApp.prototype.init = function(elroy) {
  var self = this;
  this.elroy = elroy;

  elroy.find("device:huehub:*",function(err,lights){
    lights.forEach(self.foundHue,self);
  });

  elroy.on('deviceready',function(device){
    if(device.type !== 'huehub')
      return;
    self.foundHue(device);
  });

};

HelloApp.prototype.foundHue = function(hue) {
  var self = this;
  this.elroy.expose(hue);

  hue.on('newlight',function(light){
    self.elroy.expose(light);    
  });

  hue.on('error',function(err){
    console.log('hue hub error:'+err);
  })
};