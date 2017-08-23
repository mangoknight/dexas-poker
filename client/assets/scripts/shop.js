var num;
var socket;
var m;
var RMB;
var type;
cc.Class({
    extends: cc.Component,

    properties: {
               s:{
            type:cc.Label,
            default:null
        },
        g:{
            type:cc.Label,
            default:null
        },
        d:{
            type:cc.Label,
            default:null
        },
        yuan:{
            type:cc.Label,
            default:null
        },
         pay:cc.Node,
         type:cc.Label,
         num:cc.Label,
         money:cc.Label,
         
    },

    // use this for initialization
    onLoad: function () {
         if(cc.ss.soket){
         socket=cc.ss.soket;
            }
      //socket=window.io('http://192.168.0.100:7777');
      m=JSON.parse(cc.sys.localStorage.getItem("UserMessage"));
          var xxx={name:m.name};
          socket.emit('homeCoin',xxx);
      socket.on(m.name+'addCoin',(msg)=>{
          msg=JSON.parse(msg);
          console.log(msg);
        
           var xxx={name:m.name};
          socket.emit('homeCoin',xxx);
         
      })   
    
      socket.on('home'+m.name,(msg)=>{
             msg=JSON.parse(msg);
             if(msg.status===true){
                  if(msg.msg.Diamond>10000){
                     this.d.string=(msg.msg.Diamond/10000).toFixed(2)+'万';
                 } else{
                     this.d.string=msg.msg.Diamond;
                 }
                 if(msg.msg.Gcoin>10000){
                     this.g.string=(msg.msg.Gcoin/10000).toFixed(2)+'万';
                 } else{
                      this.g.string=msg.msg.Gcoin;
                 }
                 if(msg.msg.Scoin>10000){
                      this.s.string=(msg.msg.Scoin/10000).toFixed(2)+'万';
                 }else{
                      this.s.string=msg.msg.Scoin;
                 }
                 if(msg.msg.yuanbao>10000){
                      this.yuan.string=(msg.msg.yuanbao/10000).toFixed(2)+'万';
                 }else{
                      this.yuan.string=msg.msg.yuanbao;
                 }
            //   this.d.string=msg.msg.Diamond;
            //  this.g.string=msg.msg.Gcoin;
            // this.s.string=msg.msg.Scoin;
            // this.yuan.string=msg.msg.yuanbao;
             }
         })      
    },
  update: function (dt) {
        if(!cc.ss.soket){
       cc.ss.soket=cc.ss.config.socket();
        }
    },
    chongzhi1:function(){
        var param={userid:m.Userid,name:m.name,type:'银币',num:1000,RMB:12};
        this.pay.active=true;
        this.type.string='银币';
        this.num.string='数量:1000';
        this.money.string='12.00';
        // socket.emit('addCoin',param);
        
    },
    chongzhi2:function(){
        var param={userid:m.Userid,name:m.name,type:'金币',num:100,RMB:120};
        // socket.emit('addCoin',param);
        this.pay.active=true;
        this.type.string='金币';
        this.num.string='数量:100';
        this.money.string='120.00';
        
    },
    chongzhi3:function(){
        var param={userid:m.Userid,name:m.name,type:'钻石',num:1,RMB:120};
        // socket.emit('addCoin',param);
        this.pay.active=true;
        this.type.string='钻石';
        this.num.string='数量:1';
        this.money.string='120.00';       
    },
    chongzhi4:function(){
        var param={userid:m.Userid,name:m.name,type:'元宝',num:10,RMB:120};
        // socket.emit('addCoin',param);
        this.pay.active=true;
        this.type.string='元宝';
        this.num.string='数量:10';
        this.money.string='120.00'; 
    },
    chongzhi5:function(){
        var param={userid:m.Userid,name:m.name,type:'银币',num:5000,RMB:50};
        // socket.emit('addCoin',param);
        this.pay.active=true;
        this.type.string='银币';
        this.num.string='数量:5000';
        this.money.string='50.00'; 
    },
    chongzhi6:function(){
        var param={userid:m.Userid,name:m.name,type:'金币',num:500,RMB:500};
        // socket.emit('addCoin',param);
        this.pay.active=true;
        this.type.string='金币';
        this.num.string='数量:500';
        this.money.string='500.00'; 
    },
    chongzhi7:function(){
        var param={userid:m.Userid,name:m.name,type:'钻石',num:5,RMB:500};
        // socket.emit('addCoin',param);
        this.pay.active=true;
        this.type.string='钻石';
        this.num.string='数量:5';
        this.money.string='500.00'; 
        
    },
    chongzhi8:function(){
        var param={userid:m.Userid,name:m.name,type:'元宝',num:100,RMB:998};
        // socket.emit('addCoin',param);
        this.pay.active=true;
        this.type.string='元宝';
        this.num.string='数量:100';
        this.money.string='998.00'; 
    },
    payback:function(){
        this.pay.active=false;
    },
    // called every  frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
