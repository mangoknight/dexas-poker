var num=0;
var drink="";
var socket;
var m;
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function () {
         if(cc.ss.soket){
         socket=cc.ss.soket;
            }
      //socket=window.io('http://192.168.0.100:7777');
         m=JSON.parse(cc.sys.localStorage.getItem("UserMessage"));
         socket.on(m.name+'buyDrink',(msg)=>{
             
             console.log(msg);
             console.log(msg.status);
         });
    },
       update: function (dt) {
        if(!cc.ss.soket){
       cc.ss.soket=cc.ss.config.socket();
        }
    },
    kele:function(){
    num=-6;
    drink='可乐';
    var param={userid:m.Userid,name:m.name,num:num,drink:drink};
       socket.emit('BuyDrink',param);
    },
    pijiu:function(){
        num=-30;
        drink='啤酒';
        var param={userid:m.Userid,name:m.name,num:num,drink:drink};
       socket.emit('BuyDrink',param);
    },
    putaojiu:function(){
        num=-50;
        drink='葡萄酒';
        var param={userid:m.Userid,name:m.name,num:num,drink:drink};
       socket.emit('BuyDrink',param);
    },
    jiweijiu:function(){
        num=-20;
        drink='鸡尾酒';
        var param={userid:m.Userid,name:m.name,num:num,drink:drink};
       socket.emit('BuyDrink',param);
    },
   BuyDrink:function(){
       var param={userid:m.userid,name:m.name,num:num,drink:drink};
       socket.emit('BuyDrink',param);
   }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
