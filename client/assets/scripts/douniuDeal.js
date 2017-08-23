var CreateCards = require('CreateCards');
var Cards = require('Cards');
var Decks = require('Decks');
var socket;
cc.Class({
    extends: cc.Component,

    properties: {
        cardPrefab: {
            default: null,
            type: cc.Prefab
        },
        smallCard: {
            default: null,
            type: cc.Prefab
        },
        dealer5:cc.Node,
        dealer6:cc.Node,
        dealer11:cc.Node,
        dealer12:cc.Node,
        dealer13:cc.Node,
        dealer14:cc.Node,
        dealer15:cc.Node,
      
        // numberOfDecks: {
        //     default: 1,
        //     type: 'Integer'
        // },
        cardObj:[],
        isReady:false,
        roomid:0,
        msg:0,
        name1:0,
        userid:0,
        room:0,
        flag:0,
        audioMng:cc.Node,
        newCard1:"",
        newCard2:"",
        newCard3:"",
        newCard4:"",
        newCard5:"",
    },
    onLoad: function(){
        this.newCard1="";
        this.newCard2="";
        this.newCard3="";
        this.newCard4="";
        this.newCard5="";
        if(cc.ss.soket){
         socket=cc.ss.soket;
            }
        this.audioMng = this.audioMng.getComponent('Audio');
       
        var th=this;
        th.flag=0;
        
        this.room=JSON.parse(cc.sys.localStorage.getItem("roomid")).roomid;
        this.userid=JSON.parse(cc.sys.localStorage.getItem("UserMessage")).Userid;
        var m=JSON.parse(cc.sys.localStorage.getItem("UserMessage"));
        //socket=window.io('http://192.168.0.100:7777');
        socket.on('tuifangS'+m.name,(msg)=>{
        msg=JSON.parse(msg);
            cc.director.loadScene('yulematch');
        });
       
         socket.on(th.room+'yuleDeal',function(msg){
             msg=JSON.parse(msg);
             console.log('只能'+msg.id1+msg.id2);
            if(th.userid==msg.uid){
                  th.audioMng.playDeal();
            var card8;
            var card9;
            card8=Cards.Card.fromId((msg.id1-1));
            card9=Cards.Card.fromId((msg.id2-1));
            console.log(card1);
            var newCard8 = cc.instantiate(th.cardPrefab).getComponent('CreateCards');
            var newCard9 = cc.instantiate(th.cardPrefab).getComponent('CreateCards');
            th.dealer5.addChild(newCard8.node);
            th.dealer6.addChild(newCard9.node);
            newCard8.init(card8);
            newCard9.init(card9);
            th.dealer5.active=true;
            th.dealer6.active=true;
            }
            else if(msg.uid=='all1'){
                th.audioMng.playDeal();
                var card1 ;
            var card2;var card3;var card4;var card5;
            card1=Cards.Card.fromId((msg.id1-1));
            card2=Cards.Card.fromId(msg.id2-1);
            card3=Cards.Card.fromId(msg.id3-1);
            card4=Cards.Card.fromId(msg.id4-1);
            card5=Cards.Card.fromId(msg.id5-1);
            
            th.newCard1 = cc.instantiate(th.cardPrefab).getComponent('CreateCards');
            th.newCard2 = cc.instantiate(th.cardPrefab).getComponent('CreateCards');
            th.newCard3 = cc.instantiate(th.cardPrefab).getComponent('CreateCards');
            th.newCard4 = cc.instantiate(th.cardPrefab).getComponent('CreateCards');
            th.newCard5 = cc.instantiate(th.cardPrefab).getComponent('CreateCards');
            th.dealer11.addChild(th.newCard1.node);
            th.dealer12.addChild(th.newCard2.node);
            th.dealer13.addChild(th.newCard3.node);
            th.dealer14.addChild(th.newCard4.node);
            th.dealer15.addChild(th.newCard5.node);
            th.dealer11.active=true;
            th.dealer12.active=true;
            th.dealer13.active=true;
            th.dealer14.active=true;
            th.dealer15.active=true;
            th.newCard1.reveal(false);
            th.newCard2.reveal(false);
            th.newCard3.reveal(false);
            th.newCard4.reveal(false);
            th.newCard5.reveal(false);
            th.newCard1.init(card1);
            th.newCard2.init(card2);
            th.newCard3.init(card3);
            th.newCard4.init(card4);
            th.newCard5.init(card5);
            }
            
        });
         socket.on(th.room+"fanpai",(a)=>{
            th.newCard1.reveal(true);
            setTimeout(function() {th.newCard2.reveal(true);}, 1500);
            setTimeout(function() {th.newCard3.reveal(true);}, 3000);
            setTimeout(function() {th.newCard4.reveal(true);}, 4500);
            setTimeout(function() {th.newCard5.reveal(true);}, 6000);
            
            // th.newCard1.reveal(true);
            // th.newCard2.reveal(true);
            // th.newCard4.reveal(true);
            // th.newCard5.reveal(true);
            // th.newCard6.reveal(true);
            // th.newCard7.reveal(true);
            // th.newCard8.reveal(true);
            // th.newCard9.reveal(true);
        });
        
    },
       update: function (dt) {
        if(!cc.ss.soket){
       cc.ss.soket=cc.ss.config.socket();
        }
    },
    ready:function(){//本客户端账号的准备状态
        this.isReady=true;
    },
    create: function(){//生成扑克
        var th=this;
        
      //  socket.emit("pleaseDeal");
      
        
        
        
        
       
       
        // newCard2.init(card2);
            
            
        //newCard.reveal(show);
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
