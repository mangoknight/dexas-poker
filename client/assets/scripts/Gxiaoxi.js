var socket;
var m;
cc.Class({
    extends: cc.Component,

    properties: {
        MLabel:{
           default:null,
           type:cc.Label,
       },
       msgwindow:cc.Node,
       
    },

    // use this for initialization
    onLoad: function () {
        if(cc.ss.soket){
         socket=cc.ss.soket;
            }
    
           // console.log(socket.id);
            // 'G5p5...'
            m=JSON.parse(cc.sys.localStorage.getItem("UserMessage"));
            var param={userid:m.Userid,name:m.name,power:m.Power};
        socket.emit('System',param);
        socket.emit('Allfriend',param); 
         
         // 系统消息 
         socket.on('System'+m.name,(msg)=>{
             msg=JSON.parse(msg);
             console.log(msg);
            for(var i=0;i<msg.msg.length;i++){
                this.msgs.push(msg.msg[i]);
            }
             var param={userid:m.Userid,name:m.name};
            socket.emit('Gfriend',param);
            //this.displaymsg(this.msgs);
         });
          //加好友消息 
          socket.on('Gfriend'+m.name,(msg)=>{
             
              msg=JSON.parse(msg);
             console.log(msg);
            // console.log(JSON.parse(msg));
             //console.log(msg.);
             if(msg.status===true){
             console.log(msg.msg);
             var m={id:msg.msg.id,from:msg.msg.from,};
            cc.sys.localStorage.setItem("YN",JSON.stringify(m));
             this.MLabel.string=msg.msg.msgcontent;
              this.msgwindow.active=true;
             return ;
             }
          });
          socket.on(m.name+'res',(msg)=>{
              msg=JSON.parse(msg);
              //msg 为好友回应后的相应 
            console.log(msg);
          });
          //展示你的好友 
          socket.on('Allfriend'+m.name,(msg)=>{
              msg=JSON.parse(msg);
              if(msg.status===true){ 
                  //msg.msg数组 为好友信息 
                  this.displayfriend(msg.msg);
              }else{
                  // 错误信息msg.msg 
                  
              }
          });
          socket.on(m.name+'res',(msg)=>{
              msg=JSON.parse(msg);
              console.log('res'+msg);
              console.log(msg);
          });
          socket.on('homeChat'+m.name,(msg)=>{
              msg=JSON.parse(msg);
              if(msg.type===0){
                  if(msg.statu===200){
                     // 没有聊过天 
                    }else{
                     //msg.status 为聊天记录
                     this.chattext.string=msg.statu;
                    }
              }else if(msg.type===1){
                 //  msg.msg 为发的消息 s
                  this.chattext.string+=msg.msg;
                  var param={userid:m.Userid,name:m.name,friendname:msg.friendname,type:2,msgContext:this.chattext.string};
                  socket.emit('homeChat',msg);
              }else{
                  console.log('baocun');
              }
          });
        
    },
       update: function (dt) {
        if(!cc.ss.soket){
       cc.ss.soket=cc.ss.config.socket();
        }
    },
tongyi:function(){
     this.msgwindow.active=false;
        var msg=JSON.parse(cc.sys.localStorage.getItem("YN"));
        var param={M_name:"",Y_name:m.name,myuserid:msg.from,youruserid:m.Userid,type:2,id:msg.id};
        socket.emit('addfriend',param);
    },
    jujue:function(){
        this.msgwindow.active=false;
         var msg=JSON.parse(cc.sys.localStorage.getItem("YN"));
         var param={M_name:'',Y_name:m.name,myuserid:msg.from,youruserid:m.Userid,type:3,id:msg.id};
          socket.emit('addfriend',param);
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
