var socket;
cc.Class({
    extends: cc.Component,

    properties: {
       nameLabel:{
           default:null,
           type:cc.Label,
       },
       diamondLabel:{
           default:null,
           type:cc.Label,
       },
       goldLabel:{
           default:null,
           type:cc.Label,
       },
       sliverLabel:{
           default:null,
           type:cc.Label,
       },
       yuanbaoLabel:{
           default:null,
           type:cc.Label,
       },
       roomid:'',
       Userid:'',
       selectMoney:'',
       selectCoin:'',
       selectType:'',
       audioMng:cc.Node,
         dengji:cc.Label,
        setting:cc.Node,
        expBar:cc.ProgressBar,
        expLabel:cc.Label,
    },

    // use this for initialization
    onLoad: function () {
        
         if(cc.ss.soket){
         socket=cc.ss.soket;
            }
        cc.log(socket);
        this.audioMng = this.audioMng.getComponent('Audio');
        this.audioMng.playHomeMusic();
      
        
        var  m=JSON.parse(cc.sys.localStorage.getItem("UserMessage"));
       // console.log(m);
         var xxx={name:m.name};
        socket.emit('homeCoin',xxx);
        this.nameLabel.string=m.name;
        // this.diamondLabel.string=m.Diamond;
        // this.goldLabel.string=m.Gcoin;
        // this.sliverLabel.string=m.Scoin;
        // this.yuanbaoLabel.string=m.yuanbao;
        this.Userid=m.Userid;
       
        var param={userid:m.Userid,name:m.name,power:m.Power};
         socket.emit('VIPMoney',param);
         socket.on(m.name+'VIPMoney',(msg)=>{
             msg=JSON.parse(msg);
           
            cc.sys.localStorage.setItem("VIPMoney",JSON.stringify(msg.msg));
            
           
         });
          socket.on('home'+m.name,(msg)=>{
               var  self=this;
             msg=JSON.parse(msg);
             if(msg.status===true){
                 if(msg.msg.Diamond>10000){
                     self.diamondLabel.string=(msg.msg.Diamond/10000).toFixed(2)+'万';
                 } else{
                     self.diamondLabel.string=msg.msg.Diamond;
                 }
                 if(msg.msg.Gcoin>10000){
                     self.goldLabel.string=(msg.msg.Gcoin/10000).toFixed(2)+'万';
                 } else{
                      self.goldLabel.string=msg.msg.Gcoin;
                 }
                 if(msg.msg.Scoin>10000){
                      self.sliverLabel.string=(msg.msg.Scoin/10000).toFixed(2)+'万';
                 }else{
                      self.sliverLabel.string=msg.msg.Scoin;
                 }
                 if(msg.msg.yuanbao>10000){
                      self.yuanbaoLabel.string=(msg.msg.yuanbao/10000).toFixed(2)+'万';
                 }else{
                      self.yuanbaoLabel.string=msg.msg.yuanbao;
                 }
            self.dengji.string='聚气Lv.'+m.lv;
            var expNeed=0;
            if(msg.msg.lv>=1&&msg.msg.lv<=3){
                expNeed =300;
            }else if(msg.msg.lv>=4&&msg.msg.lv<=6){
                expNeed =600;
            }else if(msg.msg.lv>=7&&msg.msg.lv<=9){
                expNeed =900;
            }
            self.expLabel.string=msg.msg.Exp+'/'+expNeed;
            self.expBar.progress=parseFloat(msg.msg.Exp/expNeed);
            cc.sys.localStorage.setItem("UserMessage",JSON.stringify(msg.msg));
             }
         })
   

       
    },
    goBag:function(){
        cc.director.loadScene('baibaoxiang');
    },
   update: function (dt) {
        if(!cc.ss.soket){
       cc.ss.soket=cc.ss.config.socket();
        }
    },
    gameMatch:function(){
       cc.director.loadScene('Match');
    },
    douniuMatch:function(){
        
        // var self=this;
        // var userid=JSON.parse(cc.sys.localStorage.getItem("UserMessage")).Userid;
        //   var m=JSON.parse(cc.sys.localStorage.getItem("UserMessage"));
           
        //  //  console.log(m.name);
        //  var param={name:m.name,money:'1K',coin:'Scoin',type:'douniu'}
        //   socket.emit('douniu',param);
        //   socket.on('douniu'+m.name,(msg)=>{
        //       msg=JSON.parse(msg);
        //       console.log(msg);
        //       var room=msg.msg.roomid;
        //       var msg={roomid:msg.msg.roomid,player1:msg.msg.number1,player2:msg.msg.number2,
        //         player3:msg.msg.number3,player4:msg.msg.number4,player5:msg.msg.number5,
        //         player6:msg.msg.number6,player7:msg.msg.number7,player8:msg.msg.number8};
        //   cc.sys.localStorage.setItem("roomid",JSON.stringify(msg));
           
             //斗牛玩法
          //});
  
            cc.director.loadScene('yulematch');
           
           
      
       
        
    },
    bisaiMatch:function(){
        cc.director.loadScene('Match');
    },
    enterMall:function(){
         cc.director.loadScene('Mall');
    },
    startGame:function(){
        var  m=JSON.parse(cc.sys.localStorage.getItem("UserMessage"));
        var self=this;
        var param={name:m.name,money:1000,coin:'gold',type:'wuxian'}
        // socket=window.io('http://localhost:7777');
        socket.emit('joinroom',param);
        console.log(m.Userid+'m');
        socket.on(m.name,(msg)=>{
            //获得已有的名字
            console.log(msg);
            self.roomid=msg.msg.roomid;
            var r={roomid:msg.msg.roomid,player1:msg.msg.number1,player2:msg.msg.number2,
                player3:msg.msg.number3,player4:msg.msg.number4,player5:msg.msg.number5,
                player6:msg.msg.number6,player7:msg.msg.number7,player8:msg.msg.number8
            };
            cc.sys.localStorage.setItem("roomid",JSON.stringify(r)); 
           
        });
       
      
         cc.director.loadScene('wuxianzhu');
    },
    start111Game:function(){
        //斗牛玩法
            socket.emit('douniujiaru',{roomid:this.roomid,uid:this.Userid});
            console.log('fasongid'+sysMsg.roomid);
             cc.director.loadScene('niuniu');
         
    },
    
    signIn:function(){
        cc.director.loadScene('ChouJiang');
    },
    openSettingWindow:function(){
        this.setting.active=true;
    },
    closeSettingWindow:function(){
        this.setting.active=false;
    },
    zhuxiao:function(){
        cc.sys.localStorage.removeItem("Login");
        cc.director.loadScene('Login');
    }
});
