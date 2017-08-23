
var CreateCards = require('CreateCards');
var Cards = require('Cards');
var Decks = require('Decks');
var socket;
var clockCallback;

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
        p1:cc.Node,
        p2:cc.Node,
        p3:cc.Node,
        p4:cc.Node,
        p5:cc.Node,
        p6:cc.Node,
        p7:cc.Node,
        p8:cc.Node,
        player1:cc.Node,
        player2:cc.Node,
        player3:cc.Node,
        player4:cc.Node,
        player5:cc.Node,
        player6:cc.Node,
        player7:cc.Node,
        player8:cc.Node,
        action1Label:{
            type:cc.Label,
            default:null
        },
        action2Label:{
            type:cc.Label,
            default:null
        },
        action3Label:{
            type:cc.Label,
            default:null
        },
        action4Label:{
            type:cc.Label,
            default:null
        },
        action5Label:{
            type:cc.Label,
            default:null
        },
        action6Label:{
            type:cc.Label,
            default:null
        },
        action7Label:{
            type:cc.Label,
            default:null
        },
        action8Label:{
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
        
        genzhu:{
            default:null,
            type:cc.Node
        },
         qipai:{
            default:null,
            type:cc.Node
        },
         jiazhu111:{
            default:null,
            type:cc.Node
        },
        
         genzhunum:{
            default:null,
            type:cc.Label
        },
         jiazhunum:{
            default:null,
            type:cc.Label
        },
        
        xiazhu:{
            default:null,
            type:cc.Label
        },
        xiazhuInfo:{
            default:null,
            type:cc.Label
        },
        dichi:{
            default:null,
            type:cc.Label
        },
        item:{
            default:null,
            type:cc.Label
        },
        slider: cc.Slider,
        room:'',
        userid:'',
        id:'',
        money:0,
        xiazhumoney:0,
        allmoney:0,
        all1:0,//总钱总钱数
        jiazhu:0,
        xintiao:0,
        dealer11:cc.Node,
        dealer12:cc.Node,
        dealer13:cc.Node,
        dealer14:cc.Node,
        dealer15:cc.Node,
        dealer1:cc.Node,
        dealer2:cc.Node,
        clock:cc.Node,
        clockBar:cc.ProgressBar,
        audioMng:cc.Node,
        type:'',
           flagJ:0,
        resultWindow:cc.Node,
        lose:cc.Node,
        win:cc.Node,
        expLabel:cc.Label,
        moneyrrr:cc.Label,
        moneyrtype:cc.Label,
        zhuang1:cc.Node,
        zhuang2:cc.Node,
        zhuang3:cc.Node,
        zhuang4:cc.Node,
        zhuang5:cc.Node,
        zhuang6:cc.Node,
        zhuang7:cc.Node,
        zhuang8:cc.Node,
           mmsg:'',
        xmsg:'',
        act:'',
        time1:cc.Node,
        time2:cc.Node,
        time3:cc.Node,
        time4:cc.Node,
        time5:cc.Node,
        time6:cc.Node,
        time7:cc.Node,
        time8:cc.Node,
              d1:cc.Node,
        d2:cc.Node,
        d3:cc.Node,
        d4:cc.Node,
        d5:cc.Node,
        d6:cc.Node,
        d7:cc.Node,
        d8:cc.Node,
        d9:cc.Node,
        d10:cc.Node,
        d11:cc.Node,
        d12:cc.Node,
        d13:cc.Node,
        d14:cc.Node,
        d15:cc.Node,
        d16:cc.Node,
        newcard1:'',
        newcard2:'',
        newcard3:'',
        newcard4:'',
        newcard5:'',
        newcard6:'',
        newcard7:'',
        newcard8:'',
        newcard9:'',
        newcard10:'',
        newcard11:'',
        newcard12:'',
        newcard13:'',
        newcard14:'',
        newcard15:'',
        newcard16:'',
        cardPrefab: {
            default: null,
            type: cc.Prefab
        },
        onefapai: 0,
        usertype: '',
        flagQ:0,
         jiang1:cc.Label,
        jiang2:cc.Label,
        jiang3:cc.Label,
        jiang4:cc.Label,
        jiang5:cc.Label,
        jiang6:cc.Label,
        jiang7:cc.Label,
        jiang8:cc.Label,
        shoupai:[],
    },

    // use this for initialization
    onLoad: function () {
        this.act='';
        this.flagJ=0;
        this.flagQ=0;
         if(cc.ss.soket){
         socket=cc.ss.soket;
            }
            this.audioMng = this.audioMng.getComponent('Audio');
            this.audioMng.playTableMusic();
             var m=JSON.parse(cc.sys.localStorage.getItem("UserMessage"));
             var message;
             var xxx={name:m.name};
             var self=this;
            socket.emit('homeCoin',xxx);
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
            this.room=JSON.parse(cc.sys.localStorage.getItem("roomid")).roomid;
            this.slider.node.on('slider', this.callback, this);
        
       
          socket.on('home'+m.name,(msg)=>{
                msg=JSON.parse(msg);
               
                if(JSON.parse(cc.sys.localStorage.getItem("roomid")).coin=='sliver'){
                    self.allmoney=msg.msg.Scoin;
                    message={roomid:self.room,name:m.name,Scoin:m.Scoin,change:0,action:'',coinType:'sliver'};
                    self.type='sliver';
                }else if(JSON.parse(cc.sys.localStorage.getItem("roomid")).coin=='gold'){
                    self.allmoney=msg.msg.Gcoin;
                    message={roomid:self.room,name:m.name,Gcoin:m.Gcoin,change:0,action:'',coinType:'gold'};
                    self.type='gold';
                }else if(JSON.parse(cc.sys.localStorage.getItem("roomid")).coin=='diamond'){
                    self.allmoney=msg.msg.Diamond;
                    message={roomid:self.room,name:m.name,Diamond:m.Diamond,change:0,action:'',coinType:'diamond'};
                    self.type='diamond';
                }
                self.all1=self.allmoney;
                if(m.name==self.player1Name.string){
                    if(self.allmoney>10000){
                     self.money1Label.string=(self.allmoney/10000).toFixed(2)+'万';
                 } else{
                     self.money1Label.string=self.allmoney;
                 }
                }if(m.name==self.player2Name.string){
                    if(self.allmoney>10000){
                     self.money2Label.string=(self.allmoney/10000).toFixed(2)+'万';
                 } else{
                     self.money2Label.string=self.allmoney;
                 }
                }
                if(m.name==self.player3Name.string){
                    if(self.allmoney>10000){
                     self.money3Label.string=(self.allmoney/10000).toFixed(2)+'万';
                 } else{
                     self.money3Label.string=self.allmoney;
                 }
                }
                if(m.name==self.player4Name.string){
                    if(self.allmoney>10000){
                     self.money4Label.string=(self.allmoney/10000).toFixed(2)+'万';
                 } else{
                     self.money4Label.string=self.allmoney;
                 }
                }
                if(m.name==self.player5Name.string){
                    if(self.allmoney>10000){
                     self.money5Label.string=(self.allmoney/10000).toFixed(2)+'万';
                 } else{
                     self.money5Label.string=self.allmoney;
                 }
                }
                if(m.name==self.player6Name.string){
                    if(self.allmoney>10000){
                     self.money6Label.string=(self.allmoney/10000).toFixed(2)+'万';
                 } else{
                     self.money6Label.string=self.allmoney;
                 }
                }
                if(m.name==self.player7Name.string){
                    if(self.allmoney>10000){
                     self.money7Label.string=(self.allmoney/10000).toFixed(2)+'万';
                 } else{
                     self.money7Label.string=self.allmoney;
                 }
                }
                if(m.name==self.player8Name.string){
                    if(self.allmoney>10000){
                     self.money8Label.string=(self.allmoney/10000).toFixed(2)+'万';
                 } else{
                     self.money8Label.string=self.allmoney;
                 }
                }
            
            });
        //socket=window.io('http://192.168.0.100:7777');
        //socket.emit('qingkong',{a:0});
        
        socket.emit('UpdateRoom',this.room);
         socket.on('UpdateRoomBack'+this.room,(msg)=>{
            
            var a=JSON.parse(msg);
            console.log('aaaaaa'+a.number1);
            if(m.name==a.number1){
                var mmm={roomid:self.room,name:m.name,money:self.allmoney,change:0,action:'',coinType:self.type};
                socket.emit('coming1',mmm);
            }
            if(m.name==a.number2){
                 var mmm={roomid:self.room,name:m.name,money:self.allmoney,change:0,action:'',coinType:self.type};
                socket.emit('coming2',mmm);
            }
            if(m.name==a.number3){
                 var mmm={roomid:self.room,name:m.name,money:self.allmoney,change:0,action:'',coinType:self.type};
                socket.emit('coming3',mmm);
            }
            if(m.name==a.number4){
                 var mmm={roomid:self.room,name:m.name,money:self.allmoney,change:0,action:'',coinType:self.type};
                socket.emit('coming4',mmm);
            }
            if(m.name==a.number5){
                 var mmm={roomid:self.room,name:m.name,money:self.allmoney,change:0,action:'',coinType:self.type};
                socket.emit('coming5',mmm );
            }
            if(m.name==a.number6){
                 var mmm={roomid:self.room,name:m.name,money:self.allmoney,change:0,action:'',coinType:self.type};
                socket.emit('coming6',mmm );
            }
            if(m.name==a.number7){
                 var mmm={roomid:self.room,name:m.name,money:self.allmoney,change:0,action:'',coinType:self.type};
                socket.emit('coming7',mmm);
            }
            if(m.name==a.number8){ 
                 var mmm={roomid:self.room,name:m.name,money:self.allmoney,change:0,action:'',coinType:self.type};
                socket.emit('coming8',mmm);
            }
        });
            socket.on(self.room+'come1',(msg)=>{
            msg=JSON.parse(msg);
            console.log(msg.money);
            self.player1.active=true;
            self.player1Name.string=msg.name;
              if(msg.money>10000){
                     self.money1Label.string=(msg.money/10000).toFixed(2)+'万';
                 } else{
                     self.money1Label.string=msg.money;
                 }
             
       });
       
       socket.on(self.room+'come2',(msg)=>{
             msg=JSON.parse(msg);
            self.player2.active=true;
            self.player2Name.string=msg.name;
           if(msg.money>10000){
                     self.money2Label.string=(msg.money/10000).toFixed(2)+'万';
                 } else{
                     self.money2Label.string=msg.money;
                 }
           
          
       });
       socket.on(self.room+'come3',(msg)=>{
         msg=JSON.parse(msg);
            self.player3.active=true;
           self.player3Name.string=msg.name;
           if(msg.money>10000){
                     self.money3Label.string=(msg.money/10000).toFixed(2)+'万';
                 } else{
                     self.money3Label.string=msg.money;
                 }
            
       });
        socket.on(self.room+'come4',(msg)=>{
         msg=JSON.parse(msg);
             self.player4.active=true;
           self.player4Name.string=msg.name;
           if(msg.money>10000){
                     self.money4Label.string=(msg.money/10000).toFixed(2)+'万';
                 } else{
                     self.money4Label.string=msg.money;
                 }
            
       });
       socket.on(self.room+'come5',(msg)=>{
      msg=JSON.parse(msg);
            self.player5.active=true;
           self.player5Name.string=msg.name;
           if(msg.money>10000){
                     self.money5Label.string=(msg.money/10000).toFixed(2)+'万';
                 } else{
                     self.money5Label.string=msg.money;
                 }
           
       });
       socket.on(self.room+'come6',(msg)=>{
        msg=JSON.parse(msg);
            self.player6.active=true;
           self.player6Name.string=msg.name;
           if(msg.money>10000){
                     self.money6Label.string=(msg.money/10000).toFixed(2)+'万';
                 } else{
                     self.money6Label.string=msg.money;
                 }
           
       });
       socket.on(self.room+'come7',(msg)=>{
            msg=JSON.parse(msg);
            self.player7.active=true;
           self.player7Name.string=msg.name;
           if(msg.money>10000){
                     self.money7Label.string=(msg.money/10000).toFixed(2)+'万';
                 } else{
                     self.money7Label.string=msg.money;
                 }
            
       });
       socket.on(self.room+'come8',(msg)=>{
            msg=JSON.parse(msg);
            self.player8.active=true;
           self.player8Name.string=msg.name;
           if(msg.money>10000){
                     self.money8Label.string=(msg.money/10000).toFixed(2)+'万';
                 } else{
                     self.money8Label.string=msg.money;
                 }
            
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
            socket.on(self.room+'xiazhuChanged',(msg)=>{
          msg=JSON.parse(msg);
            if(msg.name==self.player1Name.string){
               if(msg.num>10000){
                     self.action1Label.string=(msg.num/10000).toFixed(2)+'万';
                 } else{
                     self.action1Label.string=msg.num;
                 }
           }if(msg.name==self.player2Name.string){
               if(msg.num>10000){
                     self.action2Label.string=(msg.num/10000).toFixed(2)+'万';
                 } else{
                     self.action2Label.string=msg.num;
                 }
           }if(msg.name==self.player3Name.string){
              if(msg.num>10000){
                     self.action3Label.string=(msg.num/10000).toFixed(2)+'万';
                 } else{
                     self.action3Label.string=msg.num;
                 }
           }if(msg.name==self.player4Name.string){
              if(msg.num>10000){
                     self.action4Label.string=(msg.num/10000).toFixed(2)+'万';
                 } else{
                     self.action4Label.string=msg.num;
                 }
           }if(msg.name==self.player5Name.string){
               if(msg.num>10000){
                     self.action5Label.string=(msg.num/10000).toFixed(2)+'万';
                 } else{
                     self.action5Label.string=msg.num;
                 }
           }if(msg.name==self.player6Name.string){
               if(msg.num>10000){
                     self.action6Label.string=(msg.num/10000).toFixed(2)+'万';
                 } else{
                     self.action6Label.string=msg.num;
                 }
           }if(msg.name==self.player7Name.string){
              if(msg.num>10000){
                     self.action7Label.string=(msg.num/10000).toFixed(2)+'万';
                 } else{
                     self.action7Label.string=msg.num;
                 }
           }if(msg.name==self.player8Name.string){
              if(msg.num>10000){
                     self.action8Label.string=(msg.num/10000).toFixed(2)+'万';
                 } else{
                     self.action8Label.string=msg.num;
                 }
           }
       });
       socket.on(self.room+'moneyChanged',(msg)=>{
            msg=JSON.parse(msg);
              if(msg.action=='check'){
                 self.audioMng.playCheck();
         }else if(msg.action=='allin'){
              self.audioMng.playAll();
         }else if(msg.action=='raise'){
             self.audioMng.playRaise();
         }else if(msg.action=='call'){
              self.audioMng.playCall();
         }
           console.log('moneyChanged'+msg.name+msg.Scoin);
            if(msg.name==self.player1Name.string){
              if(msg.num>10000){
                     self.money1Label.string=(msg.num/10000).toFixed(2)+'万';
                 } else{
                     self.money1Label.string=msg.num;
                 }
           }if(msg.name==self.player2Name.string){
               
               if(msg.num>10000){
                     self.money2Label.string=(msg.num/10000).toFixed(2)+'万';
                 } else{
                     self.money2Label.string=msg.num;
                 }
           }if(msg.name==self.player3Name.string){
               if(msg.num>10000){
                     self.money3Label.string=(msg.num/10000).toFixed(2)+'万';
                 } else{
                     self.money3Label.string=msg.num;
                 }
           }if(msg.name==self.player4Name.string){
               if(msg.num>10000){
                     self.money4Label.string=(msg.num/10000).toFixed(2)+'万';
                 } else{
                     self.money4Label.string=msg.num;
                 }
           }if(msg.name==self.player5Name.string){
              if(msg.num>10000){
                     self.money5Label.string=(msg.num/10000).toFixed(2)+'万';
                 } else{
                     self.money5Label.string=msg.num;
                 }
           }if(msg.name==self.player6Name.string){
                if(msg.num>10000){
                     self.money6Label.string=(msg.num/10000).toFixed(2)+'万';
                 } else{
                     self.money6Label.string=msg.num;
                 }
           }if(msg.name==self.player7Name.string){
               if(msg.num>10000){
                     self.money7Label.string=(msg.num/10000).toFixed(2)+'万';
                 } else{
                     self.money7Label.string=msg.num;
                 }
           }if(msg.name==self.player8Name.string){
               if(msg.num>10000){
                     self.money8Label.string=(msg.num/10000).toFixed(2)+'万';
                 } else{
                     self.money8Label.string=msg.num;
                 }
           }
       });
                socket.on('zhuang'+self.room,(msg)=>{
           var msg=JSON.parse(msg);
	if(msg.name==self.player1Name.string){
		self.zhuang1.active=true;
		self.zhuang2.active=false;
		self.zhuang3.active=false;
		self.zhuang4.active=false;
		self.zhuang5.active=false;
		self.zhuang6.active=false;
		self.zhuang7.active=false;
		self.zhuang8.active=false;
	}
if(msg.name==self.player2Name.string){
		self.zhuang1.active=false;
		self.zhuang2.active=true;
		self.zhuang3.active=false;
		self.zhuang4.active=false;
		self.zhuang5.active=false;
		self.zhuang6.active=false;
		self.zhuang7.active=false;
		self.zhuang8.active=false;
	}
if(msg.name==self.player3Name.string){
		self.zhuang1.active=false;
		self.zhuang2.active=false;
		self.zhuang3.active=true;
		self.zhuang4.active=false;
		self.zhuang5.active=false;
		self.zhuang6.active=false;
		self.zhuang7.active=false;
		self.zhuang8.active=false;
	}
if(msg.name==self.player4Name.string){
		self.zhuang1.active=false;
		self.zhuang2.active=false;
		self.zhuang3.active=false;
		self.zhuang4.active=true;
		self.zhuang5.active=false;
		self.zhuang6.active=false;
		self.zhuang7.active=false;
		self.zhuang8.active=false;
	}
if(msg.name==self.player5Name.string){
		self.zhuang1.active=false;
		self.zhuang2.active=false;
		self.zhuang3.active=false;
		self.zhuang4.active=false;
		self.zhuang5.active=true;
		self.zhuang6.active=false;
		self.zhuang7.active=false;
		self.zhuang8.active=false;
	}
if(msg.name==self.player6Name.string){
		self.zhuang1.active=false;
		self.zhuang2.active=false;
		self.zhuang3.active=false;
		self.zhuang4.active=false;
		self.zhuang5.active=false;
		self.zhuang6.active=true;
		self.zhuang7.active=false;
		self.zhuang8.active=false;
	}
if(msg.name==self.player7Name.string){
		self.zhuang1.active=false;
		self.zhuang2.active=false;
		self.zhuang3.active=false;
		self.zhuang4.active=false;
		self.zhuang5.active=false;
		self.zhuang6.active=false;
		self.zhuang7.active=true;
		self.zhuang8.active=false;
	}
if(msg.name==self.player8Name.string){
		self.zhuang1.active=false;
		self.zhuang2.active=false;
		self.zhuang3.active=false;
		self.zhuang4.active=false;
		self.zhuang5.active=false;
		self.zhuang6.active=false;
		self.zhuang7.active=false;
		self.zhuang8.active=true;
	}
});
           socket.on('selectname'+self.room,(msg)=>{
        msg=JSON.parse(msg);
    if(msg.name==self.player1Name.string){
		self.time1.active=true;
		self.time2.active=false;
		self.time3.active=false;
		self.time4.active=false;
		self.time5.active=false;
		self.time6.active=false;
		self.time7.active=false;
		self.time8.active=false;
	}
if(msg.name==self.player2Name.string){
		self.time1.active=false;
		self.time2.active=true;
		self.time3.active=false;
		self.time4.active=false;
		self.time5.active=false;
		self.time6.active=false;
		self.time7.active=false;
		self.time8.active=false;
	}
if(msg.name==self.player3Name.string){
		self.time1.active=false;
		self.time2.active=false;
		self.time3.active=true;
		self.time4.active=false;
		self.time5.active=false;
		self.time6.active=false;
		self.time7.active=false;
		self.time8.active=false;
	}
if(msg.name==self.player4Name.string){
		self.time1.active=false;
		self.time2.active=false;
		self.time3.active=false;
		self.time4.active=true;
		self.time5.active=false;
		self.time6.active=false;
		self.time7.active=false;
		self.time8.active=false;
	}
if(msg.name==self.player5Name.string){
		self.time1.active=false;
		self.time2.active=false;
		self.time3.active=false;
		self.time4.active=false;
		self.time5.active=true;
		self.time6.active=false;
		self.time7.active=false;
		self.time8.active=false;
	}
if(msg.name==self.player6Name.string){
		self.time1.active=false;
		self.time2.active=false;
		self.time3.active=false;
		self.time4.active=false;
		self.time5.active=false;
		self.time6.active=true;
		self.time7.active=false;
		self.time8.active=false;
	}
if(msg.name==self.player7Name.string){
		self.time1.active=false;
		self.time2.active=false;
		self.time3.active=false;
		self.time4.active=false;
		self.time5.active=false;
		self.time6.active=false;
		self.time7.active=true;
		self.time8.active=false;
	}
if(msg.name==self.player8Name.string){
		self.time1.active=false;
		self.time2.active=false;
		self.time3.active=false;
		self.time4.active=false;
		self.time5.active=false;
		self.time6.active=false;
		self.time7.active=false;
		self.time8.active=true;
	}
        
    });
     socket.on('huojiang2'+self.room,(msg)=>{
         msg=JSON.parse(msg);
         if(msg.name==self.player1Name.string){
            self.jiang1.string="胜利+"+msg.num+"\n"+"经验+1";
            var showCallBack= function () {
                   self.jiang1.string=" ";
                }
            self.schedule(showCallBack, 1,0,2);
         }
          if(msg.name==self.player2Name.string){
            self.jiang2.string="胜利+"+msg.num+"\n"+"经验+1";
             var showCallBack= function () {
                   self.jiang2.string=" ";
                }
            self.schedule(showCallBack, 1,0,2);
         }
          if(msg.name==self.player3Name.string){
            self.jiang3.string="胜利+"+msg.num+"\n"+"经验+1";
             var showCallBack= function () {
                   self.jiang3.string=" ";
                }
            self.schedule(showCallBack, 1,0,2);
         }
          if(msg.name==self.player4Name.string){
            self.jiang4.string="胜利+"+msg.num+"\n"+"经验+1";
             var showCallBack= function () {
                   self.jiang4.string=" ";
                }
            self.schedule(showCallBack, 1,0,2);
         }
          if(msg.name==self.player6Name.string){
            self.jiang6.string="胜利+"+msg.num+"\n"+"经验+1";
             var showCallBack= function () {
                   self.jiang6.string=" ";
                }
            self.schedule(showCallBack, 1,0,2);
         }
          if(msg.name==self.player5Name.string){
            self.jiang5.string="胜利+"+msg.num+"\n"+"经验+1";
             var showCallBack= function () {
                   self.jiang5.string=" ";
                }
            self.schedule(showCallBack, 1,0,2);
         }
          if(msg.name==self.player7Name.string){
            self.jiang7.string="胜利+"+msg.num+"\n"+"经验+1";
             var showCallBack= function () {
                   self.jiang7.string=" ";
                }
            self.schedule(showCallBack, 1,0,2);
         }
          if(msg.name==self.player8Name.string){
            self.jiang8.string="胜利+"+msg.num+"\n"+"经验+1";
             var showCallBack= function () {
                   self.jiang8.string=" ";
                }
            self.schedule(showCallBack, 1,0,2);
         }
         
    });
     self.userid=m.Userid;
     socket.on('paipaipai'+self.room,(msg)=>{
        if(msg.name==m.name){
        self.shoupai=[];
        self.shoupai.push(msg.pai[0]);
        self.shoupai.push(msg.pai[1]);
            
        }

        msg=JSON.parse(msg);
        
        console.log(msg.pai[0]+"carddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd");
        console.log(msg.pai[1]+"carddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd");
        if(msg.name!=self.userid){
            if(msg.name==self.player1Name.string){
                var card1;
                var card2;
                card1=Cards.Card.fromId(msg.pai[0]-1);
                card2=Cards.Card.fromId(msg.pai[1]-1);
                self.newCard1 = cc.instantiate(self.cardPrefab).getComponent('CreateCards');
                self.newCard2 = cc.instantiate(self.cardPrefab).getComponent('CreateCards');
                self.d1.addChild(self.newCard1.node);
                self.d2.addChild(self.newCard2.node);
                self.newCard1.init(card1);
                self.newCard2.init(card2);
                self.d1.active=false;
                self.d2.active=false;
            }
            if(msg.name==self.player2Name.string){
                var card3;
                var card4;
                card3=Cards.Card.fromId(msg.pai[0]-1);
                card4=Cards.Card.fromId(msg.pai[1]-1);
                self.newCard3 = cc.instantiate(self.cardPrefab).getComponent('CreateCards');
                self.newCard4 = cc.instantiate(self.cardPrefab).getComponent('CreateCards');
                self.d3.addChild(self.newCard3.node);
                self.d4.addChild(self.newCard4.node);
                self.newCard3.init(card3);
                self.newCard4.init(card4);
                self.d3.active=false;
                self.d4.active=false;
                console.log(card3+"paipai");
                console.log(card4+"paipai");
            }
            if(msg.name==self.player3Name.string){
                var card5;
                var card6;
                card5=Cards.Card.fromId(msg.pai[0]-1);
                card6=Cards.Card.fromId(msg.pai[1]-1);
                self.newCard5 = cc.instantiate(self.cardPrefab).getComponent('CreateCards');
                self.newCard6 = cc.instantiate(self.cardPrefab).getComponent('CreateCards');
                self.d5.addChild(self.newCard5.node);
                self.d6.addChild(self.newCard6.node);
                self.newCard5.init(card5);
                self.newCard6.init(card6);
                self.d5.active=false;
                self.d6.active=false;
                
            }
            if(msg.name==self.player4Name.string){
                var card7;
                var card8;
                card7=Cards.Card.fromId(msg.pai[0]-1);
                card8=Cards.Card.fromId(msg.pai[1]-1);
                self.newCard7 = cc.instantiate(self.cardPrefab).getComponent('CreateCards');
                self.newCard8 = cc.instantiate(self.cardPrefab).getComponent('CreateCards');
                self.d7.addChild(self.newCard7.node);
                self.d8.addChild(self.newCard8.node);
                self.newCard7.init(card7);
                self.newCard8.init(card8);
                self.d7.active=false;
                self.d8.active=false;
            }
            if(msg.name==self.player5Name.string){
                var card9;
                var card10;
                card9=Cards.Card.fromId(msg.pai[0]-1);
                card10=Cards.Card.fromId(msg.pai[1]-1);
                self.newCard9 = cc.instantiate(self.cardPrefab).getComponent('CreateCards');
                self.newCard10 = cc.instantiate(self.cardPrefab).getComponent('CreateCards');
                self.d9.addChild(self.newCard9.node);
                self.d10.addChild(self.newCard10.node);
                self.newCard9.init(card9);
                self.newCard10.init(card10);
                self.d9.active=false;
                self.d10.active=false;
            }
            if(msg.name==self.player6Name.string){
                var card11;
                var card12;
                card11=Cards.Card.fromId(msg.pai[0]-1);
                card12=Cards.Card.fromId(msg.pai[1]-1);
                self.newCard11 = cc.instantiate(self.cardPrefab).getComponent('CreateCards');
                self.newCard12 = cc.instantiate(self.cardPrefab).getComponent('CreateCards');
                self.d11.addChild(self.newCard11.node);
                self.d12.addChild(self.newCard12.node);
                self.newCard11.init(card11);
                self.newCard12.init(card12);
                self.d11.active=false;
                self.d12.active=false;
            }
            if(msg.name==self.player7Name.string){
                var card13;
                var card14;
                card13=Cards.Card.fromId(msg.pai[0]-1);
                card14=Cards.Card.fromId(msg.pai[1]-1);
                self.newCard13 = cc.instantiate(self.cardPrefab).getComponent('CreateCards');
                self.newCard14 = cc.instantiate(self.cardPrefab).getComponent('CreateCards');
                self.d13.addChild(self.newCard13.node);
                self.d14.addChild(self.newCard14.node);
                self.newCard13.init(card13);
                self.newCard14.init(card14);
                self.d13.active=false;
                self.d14.active=false;
            }
            if(msg.name==self.player8Name.string){
                var card15;
                var card16;
                card15=Cards.Card.fromId(msg.pai[0]-1);
                card16=Cards.Card.fromId(msg.pai[1]-1);
                self.newCard15 = cc.instantiate(self.cardPrefab).getComponent('CreateCards');
                self.newCard16 = cc.instantiate(self.cardPrefab).getComponent('CreateCards');
                self.d15.addChild(self.newcard15.node);
                self.d16.addChild(self.newCard16.node);
                self.newCard15.init(card15);
                self.newCard16.init(card16);
                self.d15.active=false;
                self.d16.active=false;
            }
        }
    });
       socket.on(self.room+'dichi',(msg)=>{
           msg=JSON.parse(msg);
           if(msg.num>10000){
                    self.dichi.string='底池：'+(msg/10000).toFixed(2)+'万';
                 } else{
                    self.dichi.string='底池：'+msg;
                 }
          
       });
       
   
      //  this.genzhunum.string="跟注"+255;//用这个来显示用户要跟注的筹码
        console.log('room'+self.room+'    '+self.userid);
      
        self.scheduleOnce(function() {
               socket.emit('zhunbei',{roomid:self.room,userid:self.userid,name:m.name});
            }, 2);
        //  self.usermoney.string=self.allmoney;
        
         self.xiazhu.string=self.xiazhumoney;
         //监听用户顺序
        socket.on(self.room,function(data){//一直监听  操作需要执行动作的玩家
       data=JSON.parse(data);
        self.dichi=data.dichi;
          self.money=data.money;
          self.jiazhu=data.money;
          if(self.money==self.xiazhumoney){
              self.genzhunum.string='过牌';
          }else if(self.all1<=self.money){
               self.genzhunum.string='allin';
          }
          else {
           self.genzhunum.string='跟'+self.money;
          }
          
          
          if(self.allmoney>self.jiazhu){
            self.jiazhunum.string='加'+self.money;
          }else{
              self.jiazhunum.string='allin';
          }
            console.log(self.id+"+self.id"+data.id);
            //控制轮到自己的时候的按钮的出现
            
            if(data.id== self.userid){
                 socket.emit('selectname',{userid:self.userid,roomid:self.room});
                self.xianshi();
                console.log("显示了");
                
            }
            else
            {
                self.yincang();
                console.log("隐藏了");
            }
            
            
        });
       socket.on(m.name,(data)=>{
            data=JSON.parse(data);
            if(data.sta=='false'){
                socket.emit('baocunmoney',{name:m.name,money:self.allmoney,type:self.type});
            }
        });
        socket.on(self.room+'jieshu',function(data){
             data=JSON.parse(data);
            if(self.userid==data.id&&data.statusa==66){
                self.audioMng.playWin();
                console.log('恭喜你获得了奖金'+data.num);
                    
                     self.all1=self.allmoney+data.num;
                     socket.emit('huojiang1',{name:m.name,room:self.room,num:data.num});
                     self.allmoney=self.all1;
                       var mmsg={roomid:self.room,name:m.name,num:self.allmoney,action:''};
                     socket.emit('changeMoney',mmsg);
                     socket.emit('baocunmoney',{name:m.name,money:self.allmoney,type:self.type});
                     console.log('changeMoney'+mmsg.name+mmsg.num);
                                               if(self.type=='sliver'){
                                m.Scoin=self.allmoney;
                            }
                            else if(self.type=='gold'){
                                m.Gcoin=self.allmoney;
                                
                            }
                            else if(self.type=='diamond'){
                                m.Diamond=self.allmoney;
                            }
                    cc.sys.localStorage.setItem("UserMessage",JSON.stringify(m) );
                     if(self.flagJ==0){
                       socket.emit('exp',{id:self.userid});
                       self.flagJ=1;
                    }
                    
                     socket.emit('homeCoin',xxx);
                     self.yincang();
                    // //     socket.on('dengji',(msg)=>{
                    //           self.resultWindow.active=true;
                    //         self.win.active=true;
                    //         // self.expLabel.string=  msg.exp+"  Lv."+"msg.lv";
                    //         self.moneyrrr.string= self.allmoney;
                    //         if(self.type=='sliver'){
                    //         self.moneyrtype.string='银币:'}
                    //         else if(self.type=='gold'){
                    //         self.moneyrtype.string='金币:'}
                    //         else if(self.type=='diamond'){
                    //         self.moneyrtype.string='钻石:'}
                    //         self.resultWindow.acitve=true;
                        // });
                
            }else{
                 socket.emit('homeCoin',xxx);
               //  socket.emit('exp',{id:self.userid,ss:'lose'});//一开始游戏,先加一部分经验  
                //         socket.on('dengji',(msg)=>{
                            //   self.resultWindow.active=true;
                            // self.lose.active=true;
                            // // self.expLabel.string=  msg.exp+"  Lv."+"msg.lv";
                            // self.moneyrrr.string= self.allmoney;
                            // if(self.type=='sliver'){
                            // self.moneyrtype.string='银币:'}
                            // else if(self.type=='gold'){
                            // self.moneyrtype.string='金币:'}
                            // else if(self.type=='diamond'){
                            // self.moneyrtype.string='钻石:'}
                            // self.resultWindow.acitve=true;
            }
           
        });
        console.log("监听"+self.userid);
        socket.on(self.room+'only',function(data){//只剩一个人的时候通过此监听
             data=JSON.parse(data);
            if(self.userid==data.id){
                 socket.emit('xiazhu',{id:self.userid,roomid:self.room,money:self.xiazhumoney});
                console.log('就剩我一个人');
            }
        
        });
        socket.on('qipaile'+self.room,(msg)=>{
             msg=JSON.parse(msg);
            if(msg==self.player1Name.string){
               
                self.p1.opacity = 100;  
            }
            if(msg==self.player2Name.string){
                
                self.p2.opacity = 100;  
            }
            if(msg==self.player3Name.string){
               
                self.p3.opacity = 100;  
            }
            if(msg==self.player4Name.string){
               
                self.p4.opacity = 100;  
            }
            if(msg==self.player5Name.string){
                
                self.p5.opacity = 100;  
            }
            if(msg==self.player6Name.string){
              
                self.p6.opacity = 100;  
            }
            if(msg==self.player7Name.string){
                
                self.p7.opacity = 100;  
            }
            if(msg==self.player8Name.string){
               
                self.p8.opacity = 100;  
            }
        });
        socket.on('onefapai' + self.room, (data) => {

            data = JSON.parse(data);
            self.onefapai = 1;
        });
        //开始游戏的时候  给用户分配顺序id
        socket.on(self.userid+'one',function(data){
            self.flagQ=0;
            self.onefapai = 11;
             data=JSON.parse(data);
            self.usertype = data.name;
             console.log('datachizhu+++++++++++++++++++++++++++++' + data);
            var fangfei= JSON.parse(cc.sys.localStorage.getItem("roomid")).money;
            self.allmoney-=fangfei*0.02;
            self.p1.opacity = 255;
            self.p2.opacity = 255;
            self.p3.opacity = 255;
            self.p4.opacity = 255;
            self.p5.opacity = 255;
            self.p6.opacity = 255;
            self.p7.opacity = 255;
            self.p8.opacity = 255;
            console.log("zhuangtai"+data.zhuangtai+"zhuang"+data.zhuang+"uid+"+data.uid);
            self.id=data.uid;
             // localStorage.setItem("id",data.uid);
                if(data.name=="zhuang"){
                    console.log("你是庄家");
                     socket.emit('zhuang',{roomid:self.room,name:m.name});
                }else if(data.name=="xiaomang"){
                    self.flagJ==0;
                    self.audioMng.playBet();
                    console.log("你是小盲注");
                    //下注
                     socket.emit('xiaomang',{id:self.userid,roomid:self.room,money:fangfei*0.01});
                     self.allmoney-=fangfei*0.01;
                       var mmsg={roomid:self.room,name:m.name,num:self.allmoney,action:'small blind'};
                     socket.emit('changeMoney',mmsg);
                     console.log('changeMoney'+mmsg.name+mmsg.num);
                    //   self.usermoney.string=self.allmoney;
                     
                     self.xiazhumoney=fangfei*0.01;
                     self.xiazhu.string=self.xiazhumoney;
                   var xmsg={roomid:self.room,name:m.name,num:self.xiazhumoney};
                     socket.emit('changexiazhu',xmsg);
                     socket.emit('findDichi',{roomid:self.room});
                }
                else if(data.name=="damang"){
                    self.flagJ==0;
                    self.audioMng.playBet();
                    console.log("你是大盲注"+"id="+self.id+"roomid="+self.room);
                    self.allmoney-=fangfei*0.02;
                    socket.emit('damangzhu',{id:self.userid,roomid:self.room,money:fangfei*0.02});
                     var mmsg={roomid:self.room,name:m.name,num:self.allmoney,action:'big blind'};
                     socket.emit('changeMoney',mmsg);
                    console.log('changeMoney'+mmsg.name+mmsg.num);
                    //  self.usermoney.string=self.allmoney;
                     
                    self.xiazhumoney=fangfei*0.02;
                    self.xiazhu.string=self.xiazhumoney;
                  var xmsg={roomid:self.room,name:m.name,num:self.xiazhumoney};
                     socket.emit('changexiazhu',xmsg);
                     socket.emit('findDichi',{roomid:self.room});
                    //下注
                    socket.emit('xiazhu',{id:self.userid,roomid:self.room,money:fangfei*0.02});//测试此处，向服务器发送请求，要求发牌和轮流说话
                    //知道自己是大盲之后开始下注并且提示发玩家手牌
                }
                else if(data.name=='pinming'){
                    console.log("你是平民");
                }
                
                if(self.userid==data.id){
                     socket.emit('xiazhu',{id:self.userid,roomid:self.room,money:self.all1});
                     console.log('我已经aillin了');
                }
                
                
                
        });
        socket.on('lunci',function(data){
             data=JSON.parse(data);
            if(data.num==1){
                //执行发第一轮底牌函数
                console.log("第一轮发牌");
            }
            else if(data.num==2){
                //执行发第二轮函数
                console.log("第二轮发牌");  
            }
             else if(data.num==3){
                //执行发第三轮函数
                console.log("第三轮发牌");
            }
            else if(data.num==0){
                //执行结束
                   
              if(self.flagQ==0){self.d1.active=true;
                self.d2.active=true;
                self.d3.active=true;
                self.d4.active=true;
                self.d5.active=true;
                self.d6.active=true;
                self.d7.active=true;
                self.d8.active=true;
                self.d9.active=true;
                self.d10.active=true;
                self.d11.active=true;
                self.d12.active=true;
                self.d13.active=true;
                self.d14.active=true;
                self.d15.active=true;
                self.d16.active=true;
                var showCallBack= function () {
                    self.d1.active=false;
                    self.d2.active=false;
                    self.d3.active=false;
                    self.d4.active=false;
                    self.d5.active=false;
                    self.d6.active=false;
                    self.d7.active=false;
                    self.d8.active=false;
                    self.d9.active=false;
                    self.d10.active=false;
                    self.d11.active=false;
                    self.d12.active=false;
                    self.d13.active=false;
                    self.d14.active=false;
                    self.d15.active=false;
                    self.d16.active=false;
                   
                }
            self.schedule(showCallBack, 1,0,2);}
                self.dealer11.active=false;
                self.dealer12.active=false;
                self.dealer13.active=false;
                self.dealer14.active=false;
                self.dealer15.active=false;
                self.dealer1.active=false;
                self.dealer2.active=false;
                  
                socket.emit('baocunmoney',{name:m.name,money:self.allmoney,type:self.type});
                 socket.emit('homeCoin',xxx);
                self.xiazhumoney=0;
                console.log("结束");
            }
            
        });
    },
     update: function (dt) {
        if(!cc.ss.soket){
       cc.ss.soket=cc.ss.config.socket();
        }
    },
    callback: function (event) {
        var self=this;
       //这里的 event 是一个 EventCustom 对象，你可以通过 event.detail 获取 Slider 组件
       
      this. slider.progress=event.progress;
       //do whatever you want with the slider4
      
      var jiazhu=((parseInt(2*self.money)+parseInt(self.dichi))-self.money)*self.slider.progress;
      self.jiazhu=parseInt(jiazhu)+self.money;
      if(self.jiazhu<self.allmoney){
          self.jiazhunum.string='加'+self.jiazhu;
      }else
      {
          self.jiazhunum.string='all in';
      }
       
     
       console.log(self.jiazhu+'jiazhushu');
    },
    buttonqipai:function(){
        var self=this;
        
        // self.audioMng.playFold();
        var m=JSON.parse(cc.sys.localStorage.getItem("UserMessage"));
        self.flagQ=1;
        socket.emit('qipai', { id: self.userid, name: m.name, roomid: self.room, money: self.money, onepai: self.onefapai });
        self.yincang();
        socket.emit("baocunpai",{uid:self.userid,pai:self.shoupai});

        
    },
      buttonjiazhu: function () {

        var m = JSON.parse(cc.sys.localStorage.getItem("UserMessage"));
        var self = this;
        if (self.jiazhu < self.allmoney) {
            self.xiazhu.string = self.jiazhu + self.xiazhumoney;
            self.mmsg = { roomid: self.room, name: m.name, num: self.allmoney, action: 'raise' };
            socket.emit('changeMoney', self.mmsg);

            self.xiazhumoney += self.jiazhu;
            self.allmoney -= self.jiazhu;
            socket.emit('jiazhu', { id: self.userid, roomid: self.room, money: self.jiazhu, onepai: self.onefapai });
            console.log("jiazhu" + self.id);
            self.xmsg = { roomid: self.room, name: m.name, num: self.xiazhumoney };
            socket.emit('changexiazhu', self.xmsg);
            socket.emit('findDichi', { roomid: self.room });
        } else {
            self.xiazhu.string = self.all1;


            self.xiazhumoney = self.all1;
            self.allmoney = 0;

            self.xmsg = { roomid: self.room, name: m.name, num: self.xiazhumoney };
            socket.emit('changexiazhu', self.xmsg);
            socket.emit('findDichi', { roomid: self.room });
            socket.emit('allin', { id: self.userid, roomid: self.room, money: (self.all1), onepai: self.onefapai });
            console.log("allin" + self.id);
            self.mmsg = { roomid: self.room, name: m.name, num: 0, action: 'All in' };

            socket.emit('changeMoney', self.mmsg);

        }

        // self.num++;
    socket.emit("baocunpai",{uid:self.userid,pai:self.shoupai});


        // socket.emit('youxian', { lunnum: self.num });
        self.yincang();
    },

    buttongenzhu: function () {
        var self = this;
        if (self.genzhunum.string == '过牌') {
            self.act = 'check';
        } else if (self.genzhunum.string == 'allin') {
            self.act = 'allin';
        } else {
            self.act = 'call';
        }

        var m = JSON.parse(cc.sys.localStorage.getItem("UserMessage"));

        if (self.allmoney + self.xiazhumoney <= self.money) {
            self.xiazhu.string = self.all1;

            self.allmoney = 0;


            self.xiazhumoney = self.all1;

            self.xmsg = { roomid: self.room, name: m.name, num: self.xiazhumoney };
            socket.emit('changexiazhu', self.xmsg);
            self.mmsg = { roomid: self.room, name: m.name, num: 0, action: self.act };
            socket.emit('changeMoney', self.mmsg);
            if (self.onefapai == 11 && self.usertype == 'damang') {
                socket.emit('onenumfapai', { flag: self.onefapai, type: self.usertype, roomid: self.room });
                console.log('操作了 ' + self.userid + 'dada');
            } else {
                socket.emit('allin', { id: self.userid, roomid: self.room, money: (self.all1), onepai: self.onefapai });
                console.log('操作了 ' + self.userid);
            }
            
            socket.emit('findDichi', { roomid: self.room });
        }
        else {
            self.xiazhu.string = self.money;

            self.allmoney = self.allmoney - self.money + self.xiazhumoney;

            self.mmsg = { roomid: self.room, name: m.name, num: self.allmoney, action: self.act };
            socket.emit('changeMoney', self.mmsg);
            self.xiazhumoney = self.money;
            self.xmsg = { roomid: self.room, name: m.name, num: self.xiazhumoney };
            socket.emit('changexiazhu', self.xmsg);
            if (self.onefapai == 11 && self.usertype == 'damang') {
                socket.emit('onenumfapai', { flag: self.onefapai, type: self.usertype, roomid: self.room });
                console.log('操作了 ' + self.userid + 'dada');
            } else {
                socket.emit('xiazhu', { id: self.userid, roomid: self.room, money: self.money, onepai: self.onefapai });
                console.log('操作了 ' + self.userid);
            }
            socket.emit("baocunpai",{uid:self.userid,pai:self.shoupai});

            socket.emit('findDichi', { roomid: self.room });
            this.yincang();
        }
    },
    xianshi:function(){
        var self=this;
        self.genzhu.active=true;
        self.qipai.active=true;
        self.jiazhu111.active=true;
        self.clock.active=true;
        self.slider.node.active=true;
        self.clockBar.progress=1;
         clockCallback = function () {
            if(self.clockBar.progress>0){
                self.clockBar.progress-=0.05;
            }else{
                self.buttonqipai();
                self.clockBar.progress=1;
            }
        }
        self.schedule(clockCallback, 1, 20, 0.5);
        console.log("显示1");
    },
    closeresult:function(){
        this.resultWindow.active=false;
        this.win.active=false;
        this.lose.active=false;
        
    },
    yincang:function(){
        this.genzhu.active=false;
        this.qipai.active=false;
        this.jiazhu111.active=false;
        this.clock.active=false;
        this.unschedule(clockCallback);
        this.slider.node.active=false;
        console.log("隐藏了2");
    },
    tuifang:function(){
         //this.buttonqipai();
     var  self=this;
      var  id=JSON.parse(cc.sys.localStorage.getItem("roomid"));
    
      var PersonMsg=JSON.parse(cc.sys.localStorage.getItem("UserMessage"));
      var param={userid:PersonMsg.Userid,name:PersonMsg.name,roomid:id.roomid,xiazhu:id.type};
        socket.emit('tuifang',param);
        socket.emit('tuifangqipai',{id:self.userid,roomid:self.room});
       // cc.director.loadScene('Home');
    }
  
});