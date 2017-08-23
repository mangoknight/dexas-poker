
var socket;
var power=null;
var  RMB=0;
var num=0;
var m;
var v;
cc.Class({
    extends: cc.Component,

    properties: {
        message:cc.Node,
        messageLabel:{
            default:null,
            type:cc.Label
        },
       
        
    },

    // use this for initialization
    onLoad: function () {
        if(cc.ss.soket){
         socket=cc.ss.soket;
            }
       var self=this;
         //socket=window.io('http://192.168.0.100:7777');
         m=JSON.parse(cc.sys.localStorage.getItem("UserMessage"));
         v=JSON.parse(cc.sys.localStorage.getItem("VIPMoney"));
         socket.on(m.name+'buyVIP',(msg)=>{
             msg=JSON.parse(msg);
            if(msg.status===true){
                console.log(msg.data);
                self.message.active=true;
                self.messageLabel.string='充值成功！';
                var timeCallback = function () {
                    self.message.active=false;
                    
                };
                self.schedule(timeCallback, 1.5, 0, 1.5);
            }
            else{
                console.log(msg.data);
                self.message.active=true;
                self.messageLabel.string='充值失败！';
                var timeCallback = function () {
                    self.message.active=false;
                    
                };
                self.schedule(timeCallback, 1.5, 0, 1.5);
                
            }
         });
            
    },   update: function (dt) {
        if(!cc.ss.soket){
       cc.ss.soket=cc.ss.config.socket();
        }
    },
     VIP1:function(){
        var self=this,
        power=2;
        
        num=8;  
        if(m.Power<power){
        var param={userid:m.Userid,name:m.name,num:num,power:power,RMB:v.VIP1};
        socket.emit('buyVIP',param);
        }else{
            self.message.active=true;
                self.messageLabel.string='您是VIP'+m.Power-1;
                var timeCallback = function () {
                    self.message.active=false;
                    
                };
                self.schedule(timeCallback, 1.5, 0, 1.5);
            // console.log('您是VIP'+m.Power-1);
        }
     },
    VIP2:function(){
        var self=this,
        power=3;
        
        num=18; 
        if(m.Power<power){
        var param={userid:m.Userid,name:m.name,num:num,power:power,RMB:v.VIP2};
        socket.emit('buyVIP',param);
        }else{
           self.message.active=true;
                self.messageLabel.string='您是VIP'+m.Power-1;
                var timeCallback = function () {
                    self.message.active=false;
                    
                };
                self.schedule(timeCallback, 1.5, 0, 1.5);
        }
     },
    VIP3:function(){
        var self=this;
        power=4;
        
        num=38; 
        if(m.Power<power){
        var param={userid:m.Userid,name:m.name,num:num,power:power,RMB:v.VIP3};
        socket.emit('buyVIP',param);
         }else{
            self.message.active=true;
                self.messageLabel.string='您是VIP'+m.Power-1;
                var timeCallback = function () {
                    self.message.active=false;
                    
                };
                self.schedule(timeCallback, 1.5, 0, 1.5);
        }
     },
     VIP4:function(){
        var self=this;
        power=5;
        RMB=8000;
        num=78; 
        if(m.Power<power){
        var param={userid:m.Userid,name:m.name,num:num,power:power,RMB:v.VIP4};
        socket.emit('buyVIP',param);
        }else{
           self.message.active=true;
                self.messageLabel.string='您是VIP'+m.Power-1;
                var timeCallback = function () {
                    self.message.active=false;
                    
                };
                self.schedule(timeCallback, 1.5, 0, 1.5);
        }
     },
    VIP5:function(){
        var self=this;
        power=6; 
        RMB=16000;
        num=168;
         if(m.Power<power){
        var param={userid:m.Userid,name:m.name,num:num,power:power,RMB:v.VIP5};
        socket.emit('buyVIP',param);
        }else{
            self.message.active=true;
                self.messageLabel.string='您是VIP'+m.Power-1;
                var timeCallback = function () {
                    self.message.active=false;
                    
                };
                self.schedule(timeCallback, 1.5, 0, 1.5);
        }
     },
     VIP6:function(){
        var self=this;
      power=7;
      num=338; 
       if(m.Power<power){
      var param={userid:m.Userid,name:m.name,num:num,power:power,RMB:v.VIP6};
      socket.emit('buyVIP',param);
       }else{
            self.message.active=true;
                self.messageLabel.string='您是VIP'+m.Power-1;
                var timeCallback = function () {
                    self.message.active=false;
                    
                };
                self.schedule(timeCallback, 1.5, 0, 1.5);
            
        }
     },
     VIP7:function(){
         var self=this;
         power=8;
         RMB=64000;
         num=668; 
           if(m.Power<power){
         var param={userid:m.Userid,name:m.name,num:num,power:power,RMB:v.VIP7};
         socket.emit('buyVIP',param);
         }else{
            self.message.active=true;
                self.messageLabel.string='您是VIP'+m.Power-1;
                var timeCallback = function () {
                    self.message.active=false;
                    
                };
                self.schedule(timeCallback, 1.5, 0, 1.5);
        }
     },
     VIP8:function(){
         var self= this;
         power=9;
         RMB=128000;
        num=1314;
          if(m.Power<power){
         var param={userid:m.Userid,name:m.name,num:num,power:power,RMB:v.VIP8};
        socket.emit('buyVIP',param);
          }else{
           
            self.message.active=true;
                self.messageLabel.string='您是VIP'+m.Power-1;
                var timeCallback = function () {
                    self.message.active=false;
                    
                };
                self.schedule(timeCallback, 1.5, 0, 1.5);
        }
     },
     VIP9:function(){
        var self=this;
        power=10;
        RMB=256000;
        num=2688;
         if(m.Power<power){
          var param={userid:m.Userid,name:m.name,num:num,power:power,RMB:v.VIP9};
        socket.emit('buyVIP',param);
     }else{
         self.message.active=true;
                self.messageLabel.string='您是VIP'+m.Power-1;
                var timeCallback = function () {
                    self.message.active=false;
                    
                };
                self.schedule(timeCallback, 1.5, 0, 1.5);
        }
     },
    //  BuyVIP:function(){
    //     var param={userid:m.userid,name:m.name,num:num,power:power};
    //     socket.emit('buyVIP',param);
    //  }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
