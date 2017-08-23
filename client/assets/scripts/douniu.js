
var socket;
var clockCallback=null;
cc.Class({
    extends: cc.Component,

    properties: {
        player1Name:{
            type:cc.Label,
            default:null
        },
          player2Name:{
            type:cc.Label,
            default:null
        },
          player3Name:{
            type:cc.Label,
            default:null
        },
          player4Name:{
            type:cc.Label,
            default:null
        },
          player5Name:{
            type:cc.Label,
            default:null
        },
          player6Name:{
            type:cc.Label,
            default:null
        },
          player7Name:{
            type:cc.Label,
            default:null
        },
          player8Name:{
            type:cc.Label,
            default:null
        },
         money1Label:{
            type:cc.Label,
            default:null
        },
        money2Label:{
            type:cc.Label,
            default:null
        },
        money3Label:{
            type:cc.Label,
            default:null
        },
        money4Label:{
            type:cc.Label,
            default:null
        },
        money5Label:{
            type:cc.Label,
            default:null
        },
        money6Label:{
            type:cc.Label,
            default:null
        },
        money7Label:{
            type:cc.Label,
            default:null
        },
        money8Label:{
            type:cc.Label,
            default:null
        },
        player1:cc.Node,
        player2:cc.Node,
        player3:cc.Node,
        player4:cc.Node,
        player5:cc.Node,
        player6:cc.Node,
        player7:cc.Node,
        player8:cc.Node,
        you:cc.Node,
        zuo:cc.Node,
        ping:cc.Node,
        zuo1:cc.Node,
        zuo2:cc.Node,
        zuo3:cc.Node,
        zuo4:cc.Node,
        zuo5:cc.Node,
        you1:cc.Node,
        you2:cc.Node,
        you3:cc.Node,
        you4:cc.Node,
        you5:cc.Node,
        zhu100:cc.Node,
        zhu1000:cc.Node,
        zhu5000:cc.Node,
        younum:cc.Label,
        pingnum:cc.Label,
        zuonum:cc.Label,
        zuo1num:cc.Label,
        zuo2num:cc.Label,
        zuo3num:cc.Label,
        zuo4num:cc.Label,
        zuo5num:cc.Label,
        you1num:cc.Label,
        you2num:cc.Label,
        you3num:cc.Label,
        you4num:cc.Label,
        you5num:cc.Label,
        younumAll:cc.Label,
        pingnumAll:cc.Label,
        zuonumAll:cc.Label,
        zuo1numAll:cc.Label,
        zuo2numAll:cc.Label,
        zuo3numAll:cc.Label,
        zuo4numAll:cc.Label,
        zuo5numAll:cc.Label,
        you1numAll:cc.Label,
        you2numAll:cc.Label,
        you3numAll:cc.Label,
        you4numAll:cc.Label,
        you5numAll:cc.Label,
        zhunum:0,
        younum1:0,
        pingnum1:0,
        zuonum1:0,
        zuo1num1:0,
        zuo2num1:0,
        zuo3num1:0,
        zuo4num1:0,
        zuo5num1:0,
        you1num1:0,
        you2num1:0,
        you3num1:0,
        you4num1:0,
        you5num1:0,
        userid:'0000',
        audioMng:cc.Node,
        userMoney:0,
         xintiao:0,
        message:cc.Node,
        room:'',
        clockBar:cc.ProgressBar,
        BullWin:cc.Node,
        CowWin:cc.Node,
        pingping:cc.Node,
    },

    // use this for initialization
    onLoad: function () {
         if(cc.ss.soket){
         socket=cc.ss.soket;
            }
        var m=JSON.parse(cc.sys.localStorage.getItem("UserMessage"));
             this.audioMng = this.audioMng.getComponent('Audio');
            this.audioMng.playTableMusic();
             socket.on('tuifangS'+m.name,(msg)=>{
                msg=JSON.parse(msg);
                cc.director.loadScene('Home');
            });
            
            
            
            this.player1Name.string=JSON.parse(cc.sys.localStorage.getItem("roomid")).player1;
            this.player2Name.string=JSON.parse(cc.sys.localStorage.getItem("roomid")).player2;
            this.player3Name.string=JSON.parse(cc.sys.localStorage.getItem("roomid")).player3;
            this.player4Name.string=JSON.parse(cc.sys.localStorage.getItem("roomid")).player4;
            this.player5Name.string=JSON.parse(cc.sys.localStorage.getItem("roomid")).player5;
            this.player6Name.string=JSON.parse(cc.sys.localStorage.getItem("roomid")).player6;
            this.player7Name.string=JSON.parse(cc.sys.localStorage.getItem("roomid")).player7;
            this.player8Name.string=JSON.parse(cc.sys.localStorage.getItem("roomid")).player8;
             if(JSON.parse(cc.sys.localStorage.getItem("roomid")).player1!=""){
                this.player1.active=true;
            }if(JSON.parse(cc.sys.localStorage.getItem("roomid")).player2!=""){
                this.player2.active=true;
            }
            if(JSON.parse(cc.sys.localStorage.getItem("roomid")).player3!=""){
                this.player3.active=true;
            }
            if(JSON.parse(cc.sys.localStorage.getItem("roomid")).player4!=""){
                this.player4.active=true;
            }
            if(JSON.parse(cc.sys.localStorage.getItem("roomid")).player5!=""){
                this.player5.active=true;
            }
            if(JSON.parse(cc.sys.localStorage.getItem("roomid")).player6!=""){
                this.player6.active=true;
            }
            if(JSON.parse(cc.sys.localStorage.getItem("roomid")).player7!=""){
                this.player7.active=true;
            }
            if(JSON.parse(cc.sys.localStorage.getItem("roomid")).player8!=""){
                this.player8.active=true;
            }
        this.zhunum=100;
       // socket=window.io('http://192.168.0.100:7777');
        this.room=JSON.parse(cc.sys.localStorage.getItem("roomid")).roomid;
        // this.allmoney=JSON.parse(cc.sys.localStorage.getItem("UserMessage")).Scoin;
        this.userid=JSON.parse(cc.sys.localStorage.getItem("UserMessage")).Userid;
        
        var message={roomid:this.room,name:m.name,Scoin:m.Scoin,change:0,actionn:'',changeType:''};
        var self=this;
        socket.emit('exp',{id:self.userid,ss:'win'});
        //  //心跳
        // self.schedule(function() {
        //     self.xintiao=0;
        //      console.log('在外面打印的7秒一次'+self.xintiao);
        //     // 这里的 this 指向 component
        //   socket.emit('xintiao',{message:'我现在在线吗?',userid:self.userid});
        //   self.scheduleOnce(function() {
        //         if(self.xintiao==0){
        //             self.tuifang();
        //             console.log('在里面打印的5秒一次'+self.xintiao);
        //         }else if(self.xintiao==1){
        //             console.log('你还在线'+self.xintiao);
        //         }
        //     }, 5);
        // }, 7);
        // socket.on('xintiaohuidiao'+self.userid,(a)=>{
        //     a=JSON.parse(a);
        //       if(a.message=='你还在线'){
        //           self.xintiao=1;
        //       }
        //   });
        //socket.emit('qingkong',{a:0});
         socket.emit('douniujiaru',{roomid:self.room,uid:self.userid,name:m.name});
        socket.emit('UpdateRoom',this.room);
        socket.on('UpdateRoomBack'+this.room,(msg)=>{
           
            var a=JSON.parse(msg);
            console.log('aaaaaa'+a.number1);
            if(m.name==a.number1){
                socket.emit('coming1',message);
            }
            if(m.name==a.number2){
                socket.emit('coming2',message);
            }
            if(m.name==a.number3){
                socket.emit('coming3',message);
            }
            if(m.name==a.number4){
                socket.emit('coming4',message);
            }
            if(m.name==a.number5){
                socket.emit('coming5',message);
            }
            if(m.name==a.number6){
                socket.emit('coming6',message);
            }
            if(m.name==a.number7){
                socket.emit('coming7',message);
            }
            if(m.name==a.number8){ 
                socket.emit('coming8',message);
            }
        });
        socket.on(self.room+'come1',(msg)=>{
             msg=JSON.parse(msg);
            self.player1.active=true;
            self.player1Name.string=msg.name;
            self.money1Label.string=msg.Scoin;
       });
       
       socket.on(self.room+'come2',(msg)=>{
            msg=JSON.parse(msg);
            self.player2.active=true;
            self.player2Name.string=msg.name;
            self.money2Label.string=msg.Scoin;
       });
       socket.on(self.room+'come3',(msg)=>{
         msg=JSON.parse(msg);
            self.player3.active=true;
           self.player3Name.string=msg.name;
           self.money3Label.string=msg.Scoin;
       });
        socket.on(self.room+'come4',(msg)=>{
          msg=JSON.parse(msg);
             self.player4.active=true;
           self.player4Name.string=msg.name;
           self.money4Label.string=msg.Scoin;
       });
       socket.on(self.room+'come5',(msg)=>{
           msg=JSON.parse(msg);
            self.player5.active=true;
           self.player5Name.string=msg.name;
           self.money5Label.string=msg.Scoin;
       });
       socket.on(self.room+'come6',(msg)=>{
        msg=JSON.parse(msg);
            self.player6.active=true;
           self.player6Name.string=msg.name;
           self.money6Label.string=msg.Scoin;
       });
       socket.on(self.room+'come7',(msg)=>{
           msg=JSON.parse(msg);
            self.player7.active=true;
           self.player7Name.string=msg.name;
           self.money7Label.string=msg.Scoin;
       });
       socket.on(self.room+'come8',(msg)=>{
          msg=JSON.parse(msg);
            self.player8.active=true;
           self.player8Name.string=msg.name;
           self.money8Label.string=msg.Scoin;
       });
       socket.on('tuifang'+self.room,(data)=>{
           data=JSON.parse(data);
           if(data==self.player1Name.string){
               self.player1.active=false;
           }else if(data==self.player2Name.string){
               self.player2.active=false;
           }
           else if(data==self.player3Name.string){
               self.player3.active=false;
           }
           else if(data==self.player4Name.string){
               self.player4.active=false;
           }
           else if(data==self.player5Name.string){
               self.player5.active=false;
           }
           else if(data==self.player6Name.string){
               self.player6.active=false;
           }
           else if(data==self.player7Name.string){
               self.player7.active=false;
           }
           else if(data==self.player8Name.string){
               self.player8.active=false;
           }
       });
      
     self.userMoney=m.Scoin;
        //this.name111.string=JSON.parse(cc.sys.localStorage.getItem("UserMessage")).name;
        //之后要改成定时发牌的  不能由用户提醒服务端  要服务端自己做决定
        // 
        //======================================
               // 倒计时  
        socket.on('douniukaijiang'+self.room,(data)=>{
             var data=JSON.parse(data);
            self.clockBar.node.active=true;
        self.clockBar.progress=1;
         clockCallback = function () {
            if(self.clockBar.progress>0){
                self.clockBar.progress-=0.05;
            }else{
              
                
            }
        }
        self.schedule(clockCallback, 1,20, 0.5);
        });   
        
        socket.on('kaijiangniu'+self.room,(data)=>{
             var data=JSON.parse(data);
            self.unschedule(clockCallback);
            self.clockBar.node.active=false;
        });
        

        socket.on(self.room+'Alldouniu',(msg)=>{
             msg=JSON.parse(msg);
            self.younumAll.string=msg.num.yousheng;
            self.pingnumAll.string=msg.num.pingsheng;
            self.zuonumAll.string=msg.num.zuosheng;
            self.zuo1numAll.string=msg.num.dantong;
            self.zuo2numAll.string=msg.num.danlian;
            self.zuo3numAll.string=msg.num.danduizi;
            self.zuo4numAll.string=msg.num.dantonglian;
            self.zuo5numAll.string=msg.num.danduiyi;
            self.you1numAll.string=msg.num.shengyidui;
            self.you2numAll.string=msg.num.shengerdui;
            self.you3numAll.string=msg.num.shengshun;
            self.you4numAll.string=msg.num.shenghulu;
            self.you5numAll.string=msg.num.shenghuang;
        });
       socket.on(self.userid+'niu',(msg)=>{
            msg=JSON.parse(msg);
           console.log('获得奖金'+msg.jiangjin+'dengji'+msg.type);
           if(msg.type=='左'){
               console.log('huangxin1');
               self.CowWin.active=true;
               self.BullWin.active=false;
               self.pingping.active=false;
                var winCallback = function () {
                    self.CowWin.active=false;
                    self.BullWin.active=false;
                    self.pingping.active=false;
                }
            self.schedule(winCallback, 1,0, 1.5);
            }else if(msg.type=='右'){
                console.log('huangxin2');
               self.CowWin.active=false;
               self.BullWin.active=true;
               self.pingping.active=false;
                var winCallback = function () {
                    self.BullWin.active=false;
                    self.CowWin.active=false;
                    self.pingping.active=false;
                }
            self.schedule(winCallback, 1,0, 1.5);
            }else if(msg.type=='平'){
                console.log('huangxin3');
               self.CowWin.active=false;
               self.BullWin.active=false;
               self.pingping.active=true;
                var winCallback = function () {
                    self.BullWin.active=false;
                    self.CowWin.active=false;
                    self.pingping.active=false;
                }
            self.schedule(winCallback, 1,0, 1.5);
            }
        
        
            
                     self.userMoney+=msg.jiangjin;
                     self.money1Label.string=self.userMoney;
                     socket.emit('baocunmoney',{name:m.name,money:self.userMoney,type:'sliver'});
                     //console.log('changeMoney'+mmsg.name+mmsg.num);
                     
             
       });
       socket.on(self.room+'xin',function(msg){
            msg=JSON.parse(msg);
           self.chongzhi();
       });
    },
     update: function (dt) {
        if(!cc.ss.soket){
       cc.ss.soket=cc.ss.config.socket();
        }
    },
    chongzhi:function(){
     
        this.younum1=0;
        this.pingnum1=0;
        this.zuonum1=0;
        this.zuo1num1=0;
        this.zuo2num1=0;
        this.zuo3num1=0;
        this.zuo4num1=0;
        this.zuo5num1=0;
        this.you1num1=0;
        this.you2num1=0;
        this.you3num1=0;
        this.you4num1=0;
        this.you5num1=0;
        this.zuonum.string=this.zuonum1;
        this.pingnum.string=this.pingnum1;
        this.younum.string=this.younum1;
        this.zuo1num.string=this.zuo1num1;
        this.zuo2num.string=this.zuo2num1;
        this.zuo3num.string=this.zuo3num1;
        this.zuo4num.string=this.zuo4num1;
        this.zuo5num.string=this.zuo5num1;
        this.you1num.string=this.you1num1;
        this.you2num.string=this.you2num1;
        this.you3num.string=this.you3num1;
        this.you4num.string=this.you4num1;
        this.you5num.string=this.you5num1;
        var self=this;
        socket.emit('douniuAll',{roomid:self.room,type:'new',num:0});   
    },
    buttonzuosheng:function(){
        var self=this;
        if(self.userMoney>=self.zhunum){
            self.userMoney-=self.zhunum;
            self.money1Label.string=self.userMoney;
        self.zuonum1+=self.zhunum;
        self.zuonum.string=self.zuonum1;
        
        socket.emit('douniuxiazhu',{uid:self.userid,type:'zuo',num:self.zuonum1});
        socket.emit('douniuAll',{roomid:self.room,type:'zuo',num:self.zhunum});   
        }else{
           self.message.active=true;
            var timeCallback = function () {
             self.message.active=false;
        }
        self.schedule(timeCallback, 1, 0, 1.5);
        }
    },
    buttonping:function(){
        var self=this;
        if(self.userMoney>=self.zhunum){
            self.userMoney-=self.zhunum;
            self.money1Label.string=self.userMoney;
        self.pingnum1+=self.zhunum;
        
        self.pingnum.string=self.pingnum1;
        socket.emit('douniuxiazhu',{uid:self.userid,type:'ping',num:self.pingnum1});
        socket.emit('douniuAll',{roomid:self.room,type:'ping',num:self.zhunum});  
        }else{
               self.message.active=true;
            var timeCallback = function () {
             self.message.active=false;
        }
        self.schedule(timeCallback, 1, 0, 1.5);
        }
    },
    buttonyousheng:function(){
        var self=this;
        if(self.userMoney>=self.zhunum){
            self.userMoney-=self.zhunum;
            self.money1Label.string=self.userMoney;
        self.younum1+=self.zhunum;
        self.younum.string=self.younum1;
        socket.emit('douniuxiazhu',{uid:self.userid,type:'you',num:self.younum1});
        socket.emit('douniuAll',{roomid:self.room,type:'you',num:self.zhunum});  
        }else{
                self.message.active=true;
            var timeCallback = function () {
             self.message.active=false;
        }
        self.schedule(timeCallback, 1, 0, 1.5);
        }
    },
    buttonzuo1sheng:function(){
        var self=this;
        if(self.userMoney>=self.zhunum){
            self.userMoney-=self.zhunum;
            self.money1Label.string=self.userMoney;
        self.zuo1num1+=self.zhunum;
        self.zuo1num.string=self.zuo1num1;
        socket.emit('douniuxiazhu',{uid:self.userid,type:'zuo1',num:self.zuo1num1});
        socket.emit('douniuAll',{roomid:self.room,type:'zuo1',num:self.zhunum});  
        }else{
               self.message.active=true;
            var timeCallback = function () {
             self.message.active=false;
        }
        self.schedule(timeCallback, 1, 0, 1.5);
        }
    },
    buttonzuo2sheng:function(){
        var self=this;
        if(self.userMoney>=self.zhunum){
            self.userMoney-=self.zhunum;
            self.money1Label.string=self.userMoney;
        self.zuo2num1+=self.zhunum;
        self.zuo2num.string=self.zuo2num1;
        socket.emit('douniuxiazhu',{uid:self.userid,type:'zuo2',num:self.zuo2num1});
        socket.emit('douniuAll',{roomid:self.room,type:'zuo2',num:self.zhunum});  
        }else{
                self.message.active=true;
            var timeCallback = function () {
             self.message.active=false;
        }
        self.schedule(timeCallback, 1, 0, 1.5);
        }
    },
    buttonzuo3sheng:function(){
        var self=this;
        if(self.userMoney>=self.zhunum){
            self.userMoney-=self.zhunum;
            self.money1Label.string=self.userMoney;
        self.zuo3num1+=self.zhunum;
        self.zuo3num.string=self.zuo3num1;
        socket.emit('douniuxiazhu',{uid:self.userid,type:'zuo3',num:self.zuo3num1});
        socket.emit('douniuAll',{roomid:self.room,type:'zuo3',num:self.zhunum});  
        }else{
                self.message.active=true;
            var timeCallback = function () {
             self.message.active=false;
        }
        self.schedule(timeCallback, 1, 0, 1.5);
        }
    },
    buttonzuo4sheng:function(){
        var self=this;
        if(self.userMoney>=self.zhunum){
            self.userMoney-=self.zhunum;
            self.money1Label.string=self.userMoney;
        self.zuo4num1+=self.zhunum;
        self.zuo4num.string=self.zuo4num1;
        socket.emit('douniuxiazhu',{uid:self.userid,type:'zuo4',num:self.zuo4num1});
        socket.emit('douniuAll',{roomid:self.room,type:'zuo4',num:self.zhunum});  
        }else{    self.message.active=true;
            var timeCallback = function () {
             self.message.active=false;
        }
        self.schedule(timeCallback, 1, 0, 1.5);//弹出余额不足
        }
    },
    buttonzuo5sheng:function(){
        var self=this;
        if(self.userMoney>=self.zhunum){
            self.userMoney-=self.zhunum;
            self.money1Label.string=self.userMoney;
        self.zuo5num1+=self.zhunum;
        self.zuo5num.string=self.zuo5num1;
        socket.emit('douniuxiazhu',{uid:self.userid,type:'zuo5',num:self.zuo5num1});
        socket.emit('douniuAll',{roomid:self.room,type:'zuo5',num:self.zhunum});  
}else{
               self.message.active=true;
            var timeCallback = function () {
             self.message.active=false;
        }
        self.schedule(timeCallback, 1, 0, 1.5);
        }
    },
    buttonyou1sheng:function(){
        var self=this;
        if(self.userMoney>=self.zhunum){
            self.userMoney-=self.zhunum;
            self.money1Label.string=self.userMoney;
        self.you1num1+=self.zhunum;
        
        self.you1num.string=self.you1num1;
        socket.emit('douniuxiazhu',{uid:self.userid,type:'you1',num:self.you1num1});
        socket.emit('douniuAll',{roomid:self.room,type:'you1',num:self.zhunum});  
        }else{
              self.message.active=true;
            var timeCallback = function () {
             self.message.active=false;
        }
        self.schedule(timeCallback, 1, 0, 1.5);
        }
    },
    buttonyou2sheng:function(){
        var self=this;
        if(self.userMoney>=self.zhunum){
            self.userMoney-=self.zhunum;
            self.money1Label.string=self.userMoney;
        self.you2num1+=self.zhunum;
        self.you2num.string=self.you2num1;
        socket.emit('douniuxiazhu',{uid:self.userid,type:'you2',num:self.you2num1});
        socket.emit('douniuAll',{roomid:self.room,type:'you2',num:self.zhunum});  
        }else{
               self.message.active=true;
            var timeCallback = function () {
             self.message.active=false;
        }
        self.schedule(timeCallback, 1, 0, 1.5);
        }
    },
    buttonyou3sheng:function(){
        var self=this;
        if(self.userMoney>=self.zhunum){
            self.userMoney-=self.zhunum;
            self.money1Label.string=self.userMoney;
        self.you3num1+=self.zhunum;
        self.you3num.string=self.you3num1;
        socket.emit('douniuxiazhu',{uid:self.userid,type:'you3',num:self.you3num1});
        socket.emit('douniuAll',{roomid:self.room,type:'you3',num:self.zhunum});  
        }else{
                self.message.active=true;
            var timeCallback = function () {
             self.message.active=false;
        }
        self.schedule(timeCallback, 1, 0, 1.5);}
    },
    buttonyou4sheng:function(){
        var self=this;
        if(self.userMoney>=self.zhunum){
            self.userMoney-=self.zhunum;
            self.money1Label.string=self.userMoney;
        self.you4num1+=self.zhunum;
        self.you4num.string=self.you4num1;
        socket.emit('douniuxiazhu',{uid:self.userid,type:'you4',num:self.you4num1});
        socket.emit('douniuAll',{roomid:self.room,type:'you4',num:self.zhunum});  
        }else{
              self.message.active=true;
            var timeCallback = function () {
             self.message.active=false;
        }
        self.schedule(timeCallback, 1, 0, 1.5);
        }
    },
    buttonyou5sheng:function(){
        var self=this;
        if(self.userMoney>=self.zhunum){
            self.userMoney-=self.zhunum;
            self.money1Label.string=self.userMoney;
        self.you5num1+=self.zhunum;
        self.you5num.string=self.you5num1;
        socket.emit('douniuxiazhu',{uid:self.userid,type:'you5',num:self.you5num1});
        socket.emit('douniuAll',{roomid:self.room,type:'you5',num:self.zhunum});  
        }else{
                self.message.active=true;
            var timeCallback = function () {
             self.message.active=false;
        }
        self.schedule(timeCallback, 1, 0, 1.5);
        }
    },
    buttonzhunum100:function(){
        this.zhunum=100;
    },
    buttonzhunum1000:function(){
        this.zhunum=1000;
    },
    buttonzhunum5000:function(){
        this.zhunum=5000;
    },
      tuifang:function(){
      var  id=JSON.parse(cc.sys.localStorage.getItem("roomid"));
      console.log(id);
      var PersonMsg=JSON.parse(cc.sys.localStorage.getItem("UserMessage"));
      var param={userid:PersonMsg.Userid,name:PersonMsg.name,roomid:id.roomid,xiazhu:id.type};
        socket.emit('tuifang',param);
       // cc.director.loadScene('Home');
    }
});
