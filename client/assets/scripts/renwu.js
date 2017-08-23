

var socket;
cc.Class({
    extends: cc.Component,

    properties: {
        renwuLabel:{
            default:null,
            type:cc.Label
        },
        buttonlabel:{
            default:null,
            type:cc.Label
        },
        buttonhuoqu:cc.Node,
        rrr:cc.Node,
        time:1,
        t:0,
        userid:'',
        user_name:'',
        renwu_t:'',
        flag:true,
        renwu1:'',
        renwu2:'',
        renwu3:'',
        prizeBox:cc.Node,
        yinbi1:cc.Node,
        yinbi2:cc.Node,
        yinbi3:cc.Node,
        prize:{
            default:null,
            type:cc.Label
        }
    },

    // use this for initialization
    onLoad: function () {
        if(cc.ss.soket){
         socket=cc.ss.soket;
            }
        this.buttonhuoqu.active=false;
        this.rrr.active=true;
        //socket=window.io('http://192.168.0.100:7777');
       this.userid =JSON.parse(cc.sys.localStorage.getItem("UserMessage")).Userid;
       console.log(this.userid);
       this.user_name=JSON.parse(cc.sys.localStorage.getItem("UserMessage")).name;
       var param={userid:this.userid,name:this.user_name,type:1};
       socket.emit('renwu',param);
       socket.on(this.user_name+'renwu',(msg)=>{
           console.log(msg);
           msg=JSON.parse(msg);
           if(this.flag===true){
               if(msg.status===false){
                   //5分钟任务开始
                    this.five();
               }else{
                   switch(msg.msg.time){
                       case '': this.five();break;
                       case 0:
                           if(msg.msg.five===1){
                                  //领取5分钟的奖励
                                //   this.buttonhuoqu.active=true;
                                //   this.renwu.active=false;
                                  this.renwu_t=5;
                                  this.flag=false;
                                  this.buttonlabel.string='领取5分钟的奖励';
                                  
                                }else{
                                    this.buttonhuoqu.active=false;
                                    this.rrr.active=true;
                                    this.five();
                                  //5分钟任务开始  
                                }
                                break;
                       case 1:
                            if(msg.msg.ten===1){
                                  //领取10分钟的奖励
                                //   this.buttonhuoqu.active=true;
                                //   this.renwu.active=false;
                                  this.renwu_t=10;
                                  this.flag=false;
                                  this.buttonlabel.string='领取10分钟的奖励';
                                }else{
                                  //10分钟任务开始 
                                  this.buttonhuoqu.active=false;
                                  this.rrr.active=true;
                                  this.ten();
                                  console.log('zai2');
                                }
                               
                           break;
                       case 2:
                            if(msg.msg.tow===1){
                                  //领取20分钟的奖励
                                //   this.buttonhuoqu.active=true;
                                //   this.renwu.active=false;
                                  this.renwu_t=20;
                                  this.flag=false;
                                  //this.buttonlabel.string='领取20分钟的奖励';
                                }else{
                                  //20分钟任务开始 
                                  this.buttonhuoqu.active=false;
                                  this.rrr.active=true;
                                  this.tow();
                                  console.log('zai3');
                                }
                                
                           break;
                       case 3:
                           //今日任务全部做完了
                           this.buttonhuoqu.active=false;
                           this.rrr.active=true;
                            this.rrr.string='今日任务已完成';
                           break;
                        default: 
                             //任务系统异常
                            break;
                   }
               }
           }else{
               console.log('领奖失败重新领取');
           }
       });
       socket.on(this.user_name+'addCoin',(msg)=>{
            msg=JSON.parse(msg);
           if(msg==="200"){
               this.flag=true;
               console.log(msg);
              // this.buttonhuoqu.active=false;
              // this.renwu.active=true;
               var param={userid:this.userid,name:this.user_name,type:2,time:'',five:'',ten:'',tow:''};
              switch(this.renwu_t){
                   case 5:  
                       param.time=1;
                       param.five=1;
                       param.ten=0;
                       param.tow=0;
                      // socket.emit('renwu',param);
                       break;
                   case 10: param.time=2;param.five=1;param.ten=1;param.tow=0;break;
                   case 20: param.time=3;param.five=1;param.ten=1;param.tow=1; break;
                   default: console.log('errors');break;
              }
               socket.emit('renwu',param);
               console.log('zai');
           }else{
               this.flag=false;
               console.log('zai1');
           }
       });
    }, update: function (dt) {
        if(!cc.ss.soket){
       cc.ss.soket=cc.ss.config.socket();
        }
    },
    five:function(){
    this.time=5;
    this.t=0;
    
     this.renwu1=function() {
     if(this.time===0&&this.t===0){     
       //领取5分钟的奖励
     this.buttonhuoqu.active=true;
      this.rrr.active=false;
       this.renwu_t=5;
       this.flag=false;
       this.buttonlabel.string='领取5分钟的奖励';
      this.unschedule(this.renwu1);
     
     }else{
        this.daojishi(); 
     }
    };
    this.schedule(this.renwu1, 1);
 },
    daojishi:function(){
      var inn=this;
         if(this.t===0){
            this.time--;
            this.t=60;
            this.t--; 
        }else
        {
            this.t--;
        }
        if(this.t<10){
            inn.renwuLabel.string=this.time+':0'+this.t;
        }else{
            inn.renwuLabel.string=this.time+':'+this.t;
        } 
     },
    ten:function(){
       // console.log('zai5');
         this.time=10;
         this.t=0;
        this.renwu2= function() {
            if(this.time===0&&this.t===0){  
              //领取10分钟的奖励
              this.buttonhuoqu.active=true;
              this.rrr.active=false;
              this.renwu_t=10;
                this.flag=false;
              this.buttonlabel.string='领取10分钟的奖励';
              this.unschedule(this.renwu2);
            }else{
               this.daojishi();
            }
        };
        this.schedule(this.renwu2, 1);
       
         
     },
    tow:function(){
        //this.unschedule(this.renwu2);
        console.log('123');
         this.time=20;
         this.t=0;
        this.renwu3= function() {
            if(this.time===0&&this.t===0){      
               //领取20分钟的奖励
              this.buttonhuoqu.active=true;
              this.rrr.active=false;
               this.renwu_t=20;
                this.flag=false;
               this.buttonlabel.string='领取20分钟的奖励';
               this.unschedule(this.renwu3);
            }else{
              this.daojishi();
         }
         };
         this.schedule(this.renwu3, 1);
     },
     
    GetRJ:function(){
        var param={userid:this.userid,name:this.user_name,type:2};
        var mmm={userid:this.userid,name:this.user_name,num:0,type:'银币'};
         switch(this.renwu_t){
             case 5:  mmm.num=500;socket.emit('addCoin',mmm);this.prizeBox.active=true;this.prize.string='500银币';this.yinbi3.active=true;break;
             case 10: mmm.num=1000;socket.emit('addCoin',mmm);this.prizeBox.active=true;this.prize.string='1000银币';this.yinbi2.active=true;break;
             case 20: mmm.num=2000;socket.emit('addCoin',mmm);this.buttonhuoqu.active=false;this.prizeBox.active=true;this.prize.string='2000银币';this.yinbi1.active=true; break;
             default: console.log('errors');break;
         }
     },
    close:function(){
        this.prize.active=false;
        this.yinbi1.active=false;
        this.yinbi2.active=false;
        this.yinbi3.active=false;
    },
    closetubiao(){
        this.prizeBox.active=false;
    }
    
    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
