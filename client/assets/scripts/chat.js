
var socket;
var Toname;
var m;
cc.Class({
    extends: cc.Component,

    properties: {
        emojiCollection:cc.Node,
        chatWindow:cc.Node,
        editBoxText:{
            default:null,
            type:cc.EditBox,
        },
        chatTolabel:{
            default:null,
            type:cc.Label,
        },
         Onechat:{
            default:null,
            type:cc.EditBox,
        },
        richtxt:{
            default:null,
            type:cc.RichText,
        },
        flag1:0,
        flag2:0,
        flagbg1:0,
        flagbg2:0,
        flagbg3:0,
        flagbg4:0,
        flagbg5:0,
        flagbg6:0,
        flagbg7:0,
        flagbg8:0,
        type:0,
        friendbg1:cc.Node,
        friendbg2:cc.Node,
        friendbg3:cc.Node,
        friendbg4:cc.Node,
        friendbg5:cc.Node,
        friendbg6:cc.Node,
        friendbg7:cc.Node,
        friendbg8:cc.Node,
        p1:cc.Label,
        p2:cc.Label,
        p3:cc.Label,
        p4:cc.Label,
        p5:cc.Label,
        p6:cc.Label,
        p7:cc.Label,
        p8:cc.Label,
        result:cc.Node,
        resultLabel:cc.Label,
        friendwindow:cc.Node,
        friendname:cc.Label,
        timelabel:cc.Label,
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
         //socket=window.io('http://192.168.0.100:7777');
         var id1=JSON.parse(cc.sys.localStorage.getItem("roomid")).roomid;
         this.editBoxText.string='';
        
          this.abc=function(){
              this.timelabel.string=this.getNowFormatDate();
          }, 
           this.schedule(this.abc, 1);
         m = JSON.parse(cc.sys.localStorage.getItem("UserMessage"));
          socket.on(id1+'chat',(msg)=>{
             console.log(msg);
             msg=JSON.parse(msg);
            
             this.richtxt.string+=msg;
         });
        //  { status: true, reqname: msg.M_name,resname: msg.Y_name, msg: a, reqid: msg.myuserid, resid: param.msg, id: data1.msg })
          socket.on(m.name+'addfriend',(msg)=>{
              msg=JSON.parse(msg);
               var m={id:msg.id,from:msg.reqid};
              cc.sys.localStorage.setItem("YN",JSON.stringify(m));
              this.msgwindow.active=true;
              this.MLabel.string=msg.msg;
              

          })
          socket.on(m.name+'req',(msg)=>{
              msg=JSON.parse(msg);
              var self=this;
          if(msg.status===true){
              console.log(msg.msg);
              var mmm={M_name:msg.reqname,Y_name:msg.resname,myuserid:msg.reqid,youruserid:msg.resid,id:msg.id};
              cc.sys.localStorage.setItem("addfriend",JSON.stringify(mmm));
              var param={userid:msg.resid,name:res.resname};
             // socket.emit('Gfriend',param);
               this.resultLabel.string='请求发送成功！';
                      var timeCallback = function () {
                        this.result.active=false;
                          }
                     self.schedule(timeCallback, 1.5, 0, 1.5);
            // socket.emit();
          }else{
              console.log(msg.msg);
              this.result.active=true;
                       this.resultLabel.string=msg.msg;
                      var timeCallback = function () {
                        this.result.active=false;
                          }
                     self.schedule(timeCallback, 1.5, 0, 1.5);
          }
      });
         socket.on(m.name+'chat',(msg)=>{
             var self=this;
             msg=JSON.parse(msg);
          if(msg.status==true){
              this.friendwindow.active=true;
              this.friendLabel.string='与'+msg.name+'对话';
              this. chatTolabel.string+=msg.msg;
          }else{
                 this.result.active=true;
                 this.resultLabel.string='请先添加好友！';
                 var timeCallback = function () {
                    this.result.active=false;
                       }
                 self.schedule(timeCallback, 1.5, 0, 1.5);
          }
                      
      });
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
    openPlayer1: function(){
        var a = this;
       // var m = JSON.parse(cc.sys.localStorage.getItem("UserMessage"));
        if(m.name!=this.p1.string){
            if(this.flagbg1%2==0){
                a.friendbg1.active=true;
                a.flagbg1++;
            
            }else{
                a.friendbg1.active=false;
                a.flagbg1++;
            }
        }
    },   update: function (dt) {
        if(!cc.ss.soket){
       cc.ss.soket=cc.ss.config.socket();
        }
    },
    openPlayer2: function(){
        var a = this;
       // var m = JSON.parse(cc.sys.localStorage.getItem("UserMessage"));
        if(m.name!=this.p2.string){
            if(this.flagbg2%2==0){
                a.friendbg2.active=true;
                a.flagbg2++;
            
            }else{
                a.friendbg2.active=false;
                a.flagbg2++;
            }
        }
    },
    openPlayer3: function(){
        var a = this;
       // var m = JSON.parse(cc.sys.localStorage.getItem("UserMessage"));
        if(m.name!=this.p3.string){
            if(this.flagbg3%2==0){
                a.friendbg3.active=true;
                a.flagbg3++;
            
            }else{
                a.friendbg3.active=false;
                a.flagbg3++;
            }
        }
    },
    openPlayer4: function(){
        var a = this;
       //var m = JSON.parse(cc.sys.localStorage.getItem("UserMessage"));
        if(m.name!=this.p4.string){
            if(this.flagbg4%2==0){
                a.friendbg4.active=true;
                a.flagbg4++;
            
            }else{
                a.friendbg4.active=false;
                a.flagbg4++;
            }
        }
    },
    openPlayer5: function(){
        var a = this;
        //var m = JSON.parse(cc.sys.localStorage.getItem("UserMessage"));
        if(m.name!=this.p5.string){
            if(this.flagbg5%2==0){
                a.friendbg5.active=true;
                a.flagbg5++;
            
            }else{
                a.friendbg5.active=false;
                a.flagbg5++;
            }
        }
    },
    openPlayer6: function(){
        var a = this;
        //var m = JSON.parse(cc.sys.localStorage.getItem("UserMessage"));
        if(m.name!=this.p6.string){
            if(this.flagbg6%2==0){
                a.friendbg6.active=true;
                a.flagbg6++;
            
            }else{
                a.friendbg6.active=false;
                a.flagbg6++;
            }
        }
    },
    openPlayer7: function(){
        var a = this;
      // var  m = JSON.parse(cc.sys.localStorage.getItem("UserMessage"));
        if(m.name!=this.p7.string){
            if(this.flagbg7%2==0){
                a.friendbg7.active=true;
                a.flagbg7++;
            
            }else{
                a.friendbg7.active=false;
                a.flagbg7++;
            }
        }
    },
    openPlayer8: function(){
        var a = this;
       // var m = JSON.parse(cc.sys.localStorage.getItem("UserMessage"));
        if(m.name!=this.p8.string){
            if(this.flagbg8%2==0){
                a.friendbg8.active=true;
                a.flagbg8++;
            
            }else{
                a.friendbg8.active=false;
                a.flagbg8++;
            }
        }
    },
    
    openChat: function(){
        var a = this;
        
        if(this.flag2%2==0){
            a.chatWindow.active=true;
            a.flag2++;
            
        }else{
            a.chatWindow.active=false;
            a.flag2++;
        }
        
    },
    openEmoji: function(){
        var a = this;
        
        if(this.flag1%2==0){
            a.emojiCollection.active=true;
            a.flag1++;
            
        }else{
            a.emojiCollection.active=false;
            a.flag1++;
            
        }
        
        
    },
    addp1:function(){
        var name=this.p1.string;
         var param={myuserid:m.Userid,M_name:m.name,Y_name:name,type:1};
        socket.emit('addfriend',param);
        //查询是不是好友
        //是的话   this.result.active=true;
        //               this.resultLabel.string='已经是好友了！';
                    //  var timeCallback = function () {
                                //  this.result.active=false;
                    //      }
                    // self.schedule(timeCallback, 1.5, 0, 1.5);
        //不是 接到服务端回来后 
                        // this.result.active=true;
        //               this.resultLabel.string='添加成功！';
                    //  var timeCallback = function () {
                                //  this.result.active=false;
                    //      }
                    // self.schedule(timeCallback, 1.5, 0, 1.5);
     
    },
    addp2:function(){
        var name=this.p2.string;
         var param={myuserid:m.Userid,M_name:m.name,Y_name:name,type:1};
        socket.emit('addfriend',param);
    },
    addp3:function(){
        var name=this.p3.string;
         var param={myuserid:m.Userid,M_name:m.name,Y_name:name,type:1};
        socket.emit('addfriend',param);
    },
    addp4:function(){
        var name=this.p4.string;
         var param={myuserid:m.Userid,M_name:m.name,Y_name:name,type:1};
        socket.emit('addfriend',param);
    },
    addp5:function(){
        var name=this.p5.string;
         var param={myuserid:m.Userid,M_name:m.name,Y_name:name,type:1};
        socket.emit('addfriend',param);
    },
    addp6:function(){
        var name=this.p6.string;
         var param={myuserid:m.Userid,M_name:m.name,Y_name:name,type:1};
        socket.emit('addfriend',param);
    },
    addp7:function(){
        var name=this.p7.string;
         var param={myuserid:m.Userid,M_name:m.name,Y_name:name,type:1};
        socket.emit('addfriend',param);
    },
    addp8:function(){
        var name=this.p8.string;
         var param={myuserid:m.Userid,M_name:m.name,Y_name:name,type:1};
        socket.emit('addfriend',param);
    },
    talkp1:function(){
         Toname=this.p1.string;
        // var param={fromid:m.Userid,fromname:m.name,toname:name};
        // socket.emit('chat',param);
        //不是好友   this.result.active=true;
        //               this.resultLabel.string='请先添加好友！';
                    //  var timeCallback = function () {
                                //  this.result.active=false;
                    //      }
                    // self.schedule(timeCallback, 1.5, 0, 1.5);
        //是的话  this.friendwindow.active=true;
                    //this.friendLabel.string='与'+name+'对话';
    },
    talkp2:function(){
        Toname=this.p2.string;
        // var param={fromid:m.Userid,fromname:m.name,toname:name};
        // socket.emit('chat',param);
    },
    talkp3:function(){
        Toname=this.p3.string;
        // var param={fromid:m.Userid,fromname:m.name,toname:name};
        // socket.emit('chat',param);
    },
    talkp4:function(){
        Toname=this.p4.string;
        // var param={fromid:m.Userid,fromname:m.name,toname:name};
        // socket.emit('chat',param);
    },
    talkp5:function(){
       Toname=this.p5.string;
        // var param={fromid:m.Userid,fromname:m.name,toname:name};
        // socket.emit('chat',param);
    },
    talkp6:function(){
        Toname=this.p6.string;
        // var param={fromid:m.Userid,fromname:m.name,toname:name};
        // socket.emit('chat',param);
    },
    talkp7:function(){
        Toname=this.p7.string;
        // var param={fromid:m.Userid,fromname:m.name,toname:name};
        // socket.emit('chat',param);
    },
    talkp8:function(){
        Toname=this.p8.string;
        // var param={fromid:m.Userid,fromname:m.name,toname:name};
        // socket.emit('chat',param);
    },
     sendEmoji1: function(){
         this.editBoxText.string="<img src='emoji1'/>";
         this.type=1;
    },
    sendEmoji2: function(){
         this.editBoxText.string="<img src='emoji2'/>";
         this.type=1;
    },
    sendEmoji3: function(){
         this.editBoxText.string="<img src='emoji3'/>";
         this.type=1;
    },
    sendEmoji4: function(){
        this.editBoxText.string="<img src='emoji4'/>";
        this.type=1;
    },
    sendEmoji5: function(){
        
         this.editBoxText.string="<img src='emoji5'/>";
        this.type=1;
    },
    sendEmoji6: function(){
        
        this.editBoxText.string="<img src='emoji6'/>";
        this.type=1;
    },
    sendEmoji7: function(){
        
         this.editBoxText.string="<img src='emoji7'/>";
        this.type=1;
    },
    sendEmoji8: function(){
      this.editBoxText.string="<img src='emoji8'/>";
        this.type=1;
    },
    sendEmoji9: function(){
        this.editBoxText.string="<img src='emoji9'/>";
        this.type=1;
    },
    sendEmoji10: function(){
        
       this.editBoxText.string="<img src='emoji10'/>";
       this.type=1;
    },
    sendEmoji11: function(){
        
       this.editBoxText.string="<img src='emoji11'/>";
       this.type=1;
        
    },
    sendEmoji12: function(){
        
        this.editBoxText.string="<img src='emoji12'/>";
        this.type=1;
        
    },
    sendEmoji13: function(){
         this.editBoxText.string="<img src='emoji13'/>";
         this.type=1;
    },
    sendEmoji14: function(){
        this.editBoxText.string="<img src='emoji14'/>";
        this.type=1;
    },
    sendEmoji15: function(){
        this.editBoxText.string="<img src='emoji15'/>";
        this.type=1;
    },
    sendEmoji16: function(){
       this.editBoxText.string="<img src='emoji16'/>";
       this.type=1;
    },
    sendEmoji17: function(){
       this.editBoxText.string="<img src='emoji17'/>";
       this.type=1;
    },
    sendEmoji18: function(){
        this.editBoxText.string="<img src='emoji18'/>";
        this.type=1;
    },
    sendEmoji19: function(){
       this.editBoxText.string="<img src='emoji19'/>";
       this.type=1;
    },
    sendEmoji20: function(){
       this.editBoxText.string="<img src='emoji20'/>";
       this.type=1;
    },
    sendEmoji21: function(){
       this.editBoxText.string="<img src='emoji21'/>";
       this.type=1;
    },
    sendEmoji22: function(){
       this.editBoxText.string="<img src='emoji22'/>";
       this.type=1;
    },
    sendEmoji23: function(){
      this.editBoxText.string="<img src='emoji23'/>";
      this.type=1;
    },
    sendEmoji24: function(){
      this.editBoxText.string="<img src='emoji24'/>";
      this.type=1;
    },
    sendEmoji25: function(){
      this.editBoxText.string="<img src='emoji25'/>";
      this.type=1;
    },
    send:function(){
        var Msg=this.editBoxText.string;
        if(Msg===null||Msg===undefined||Msg===""){
            this.editBoxText.placeholder='所发信息不能为空';
        }else{
             var id=JSON.parse(cc.sys.localStorage.getItem("roomid")).roomid;
             var name =JSON.parse(cc.sys.localStorage.getItem("UserMessage")).name;
             var param={name:name,type:this.type,id:id,msg:Msg};
             socket.emit('Roomchat',param);
             this.editBoxText.string='';
             this.type=0;
        }
       
    },
    getNowFormatDate:function () {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getSeconds();
     var  getMinutes=date.getMinutes();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    if (getMinutes >= 0 && getMinutes <= 9) {
        getMinutes = "0" + getMinutes;
    }
    var currentdate =  date.getHours() + seperator2 + getMinutes+ seperator2 +strDate;
    
    return currentdate;
},
    
    sendOne:function(){
        var param={fromid:m.Userid,fromname:m.name,toname:name,msg:this.Onechat.string};
        socket.emit('chat',param);
        this.Onechat.string='';
    }
});
