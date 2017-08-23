


cc.Class({
    extends: cc.Component,
    
    socket: function(){
      return  window.io.connect('http://106.14.40.93:7777');
    //   return window.io.connect('http://192.168.2.155:7777');
    }
       
});
