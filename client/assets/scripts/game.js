
var socket;
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
        player1:'空闲中',
        player2:'空闲中',
        player3:'空闲中',
        player4:'空闲中',
        player5:'空闲中',
        player6:'空闲中',
        player7:'空闲中',
        player8:'空闲中',
        roomid:0,
    },

    onLoad: function () {
         if(cc.ss.soket){
         socket=cc.ss.soket;
            }
        var m=JSON.parse(cc.sys.localStorage.getItem("UserMessage"));
        
       // socket=window.io('http://192.168.0.100:7777');
        
        socket.emit('joinroom',param={name:m.name,money:'1K',coin:'gold',type:'wuxian'});
        socket.on(m.name,(msg)=>{
            msg=JSON.parse(msg);
            //获得已有的名字
            this.roomid=msg.msg.roomid;
            this.player1=msg.msg.number1;
            this.player2=msg.msg.number2;
            this.player3=msg.msg.number3;
            this.player4=msg.msg.number4;
            this.player5=msg.msg.number5;
            this.player6=msg.msg.number6;
            this.player7=msg.msg.number7;
            this.player8=msg.msg.number8;
            var massage={
                id:this.roomid,from:m.name,To:"",Msg:msg
            }
            socket.emit('chat',massage);
            socket.on(this.roomid,(msg)=>{
              console.log(msg);
              //刷新已有的名字
            this.player1=msg.msg.msg.number1;
            this.player2=msg.msg.msg.number2;
            this.player3=msg.msg.msg.number3;
            this.player4=msg.msg.msg.number4;
            this.player5=msg.msg.msg.number5;
            this.player6=msg.msg.msg.number6;
            this.player7=msg.msg.msg.number7;
            this.player8=msg.msg.msg.number8;
            })
        });
        
    
    },  
    update: function (dt) {
        
        this.player1Name.string=this.player1;
        this.player2Name.string=this.player2;
        this.player3Name.string=this.player3;
        this.player4Name.string=this.player4;
        this.player5Name.string=this.player5;
        this.player6Name.string=this.player6;
        this.player7Name.string=this.player7;
        this.player8Name.string=this.player8;
         if(!cc.ss.soket){
       cc.ss.soket=cc.ss.config.socket();
        }
    },
});
