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
    },
    onLoad: function(){
        
        if(cc.ss.soket){
         socket=cc.ss.soket;
            }
        this.audioMng = this.audioMng.getComponent('Audio');
       
        var th=this;
        th.flag=0;
        // this.decks = new Decks(this.numberOfDecks);
        // var userEnterMessage=JSON.parse(cc.sys.localStorage.getItem("roomid"));
        // this.roomid=userEnterMessage.roomid;
        // //this.msg=userEnterMessage.msg;
        // this.name1=userEnterMessage.name;
        
        this.room=JSON.parse(cc.sys.localStorage.getItem("roomid")).roomid;
        this.userid=JSON.parse(cc.sys.localStorage.getItem("UserMessage")).Userid;
        var m=JSON.parse(cc.sys.localStorage.getItem("UserMessage"));
        //socket=window.io('http://192.168.0.100:7777');
         socket.on('tuifangS'+m.name,(msg)=>{
         msg=JSON.parse(msg);
            cc.director.loadScene('Match');
        });
         socket.on(th.room+'Deal',function(msg){
             msg=JSON.parse(msg);
            // if(th.flag==0){
            //     var a=[];
            //     a[0]=msg.id1;
            //     a[1]=msg.id2;
                
            //     socket.emit('paipai',{uid:msg.uid,a:JSON.stringify(a)});
            //     th.flag++;
            //  }

             if(th.userid==msg.uid){
                  th.audioMng.playDeal();
            var card1 ;
            var card2;
            card1=Cards.Card.fromId((msg.id1-1));
            card2=Cards.Card.fromId((msg.id2-1));
            console.log(card1);
            var newCard1 = cc.instantiate(th.cardPrefab).getComponent('CreateCards');
            var newCard2 = cc.instantiate(th.cardPrefab).getComponent('CreateCards');
            th.dealer5.addChild(newCard1.node);
            th.dealer6.addChild(newCard2.node);
            newCard1.init(card1);
            newCard2.init(card2);
            th.dealer5.active=true;
            th.dealer6.active=true;
            }
            else if(msg.uid=='all1'){
                    th.audioMng.playDeal();
                var card1 ;
            var card2;var card3;
            card1=Cards.Card.fromId((msg.id1-1));
            card2=Cards.Card.fromId(msg.id2-1);
            card3=Cards.Card.fromId(msg.id3-1);
            console.log(card1);
            var newCard1 = cc.instantiate(th.cardPrefab).getComponent('CreateCards');
            var newCard2 = cc.instantiate(th.cardPrefab).getComponent('CreateCards');
            var newCard3 = cc.instantiate(th.cardPrefab).getComponent('CreateCards');
            th.dealer11.addChild(newCard1.node);
            th.dealer12.addChild(newCard2.node);
            th.dealer13.addChild(newCard3.node);
            th.dealer11.active=true;
            th.dealer12.active=true;
            th.dealer13.active=true;
            
            newCard1.init(card1);
            newCard2.init(card2);
            newCard3.init(card3);
            }
            else if(msg.uid=='all2'){
                    th.audioMng.playDeal();
                 var card1 ;
            card1=Cards.Card.fromId(msg.id1-1);
            console.log(card1);
            var newCard1 = cc.instantiate(th.cardPrefab).getComponent('CreateCards');
            th.dealer14.addChild(newCard1.node);
            newCard1.init(card1);
            th.dealer14.active=true;

            }
            else if(msg.uid=='all3'){
                    th.audioMng.playDeal();
                 var card1 ;
            card1=Cards.Card.fromId(msg.id1-1);
            console.log(card1);
            var newCard1 = cc.instantiate(th.cardPrefab).getComponent('CreateCards');
            th.dealer15.addChild(newCard1.node);
            newCard1.init(card1);
            th.dealer15.active=true;
            th.flag=0;
            }
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
