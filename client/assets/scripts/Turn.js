
var m;
var socket;
cc.Class({
    extends: cc.Component,

    properties: {
        zhizheng: cc.Node,
        flag:"", 
        result:cc.Node,
        resultLabel:{
            default:null,
            type:cc.Label
        },
        yinbi1:cc.Node,
        yinbi2:cc.Node,
        yinbi3:cc.Node,
        yinbi4:cc.Node,
        yuanbao1:cc.Node,
        zuanshi:cc.Node,
        guizhu:cc.Node,
        gold1:cc.Node,
        gold2:cc.Node,
        audioMng:cc.Node,
         message1:cc.Node,
         message2:cc.Node,
          fivejinbi:cc.Button,
        shifou:cc.Node,

    },
    
    // use this for initialization
    onLoad: function () {
        if(cc.ss.soket){
         socket=cc.ss.soket;
            }
             var  self=this;
         this.audioMng = this.audioMng.getComponent('Audio');
        this.audioMng.playHomeMusic();
     //socket=window.io('http://192.168.0.100:7777');
      m=JSON.parse(cc.sys.localStorage.getItem("UserMessage"));
      console.log(m.name);
      socket.on(m.name,(msg)=>{
          console.log(msg);
      })
      socket.on(m.Userid+"choujiang",(msg)=>{
           msg=JSON.parse(msg);
          if(msg.status===false){
             this.message1.active=true;
              var timeCallback = function () {
                        this.message1.active=false;
                        
                    }
                    self.schedule(timeCallback, 1.5, 0, 1.5);
          }
          else
          {
              this.Drawstart();
          }
      })
      socket.on(m.name+"jinbi",(msg)=>{
          msg=JSON.parse(msg);
          if(msg.status===false){
              // msg=JSON.parse(msg);
               this.message2.active=true;
              var timeCallback = function () {
                        this.message2.active=false;
                        this.shifou.active=true;
                    };
                    self.schedule(timeCallback, 1.5, 0, 0.5);
                    this.fivejinbi.interactable=true;
          }
          else
          {
            
              this.Drawstart();
          }
      });
    },
    free:function(){
        socket.emit('day',m.Userid);
    },
    fivecoin:function(){
        this.fivejinbi.interactable=false;
        var   param={
                 userid:m.Userid,
                 name:m.name,
                price:-5,
                type:"金币",
                data:""
            };
           
         socket.emit('ReduceGcoin',param);
    },
    Drawstart:function(){
       var x=this.num();
        // 执行动作 
       var action = cc.rotateBy(10, x+360*10).easing(cc.easeCubicActionOut());
         this.zhizheng.runAction(action);
         this.scheduleOnce(function() {
                 this.sendjiang(x);
                 
                this.zhizheng.runAction(cc.rotateBy(0.01, -x));
             }, 10);
          
       
    },
    sendjiang:function(x){
        var self=this;
        var msg='';
        var param={};
        if(0<=x&&x<=30){
            msg="恭喜获得8个元宝";
             param={
                 userid:m.Userid,
                 name:m.name,
                price:8,
                type:"元宝",
                data:""
            }
            self.result.active=true;
            self.resultLabel.string='8元宝';
            self.yuanbao1.active=true;
            self.yinbi1.active=false;
            self.yinbi2.active=false;
            self.yinbi3.active=false;
            self.yinbi4.active=false;
            self.zuanshi.active=false;
            self.guizhu.active=false;
            self.gold2.active=false;
            self.gold1.active=false;
   
            // socket.emit('jiang',{price:"1000",type:"银币",data:""});
        }
        else if(30<x&&x<=60){
             msg='恭喜获得银币1000';
             param={
                userid:m.Userid,
                name:m.name,
                price:1000,
                type:"银币",
                data:""
            }
            self.result.active=true;
            self.resultLabel.string='1000银币';
            self.yuanbao1.active=false;
            self.yinbi1.active=false;
            self.yinbi2.active=true;
            self.yinbi3.active=false;
            self.yinbi4.active=false;
            self.zuanshi.active=false;
            self.guizhu.active=false;
            self.gold2.active=false;
            self.gold1.active=false;
         }
        else if(60<x&&x<=90){
            //  socket.emit('jiang',{price:"",type:"",data:"再来一次"});
             msg="恭喜获得银币2000";
              param={
                userid:m.Userid,
                name:m.name,
                price:2000,
                type:"银币",
                data:""
            } 
            self.result.active=true;
            self.resultLabel.string='2000银币';
               self.yuanbao1.active=false;
            self.yinbi1.active=true;
            self.yinbi2.active=false;
            self.yinbi3.active=false;
            self.yinbi4.active=false;
            self.zuanshi.active=false;
            self.guizhu.active=false;
            self.gold2.active=false;
            self.gold1.active=false;
        }else if(90<x&&x<120){ 
            
             msg="恭喜获得金币10";
              param={
                userid:m.Userid,
                name:m.name,
                price:10,
                type:"金币",
                data:""
            }
            self.result.active=true;
            self.resultLabel.string='10金币';
         
               self.yuanbao1.active=false;
            self.yinbi1.active=false;
            self.yinbi2.active=false;
            self.yinbi3.active=false;
            self.yinbi4.active=false;
            self.zuanshi.active=false;
            self.guizhu.active=false;
            self.gold2.active=true;
            self.gold1.active=false;
        }else if(120<=x&&x<=150){
            msg="很遗憾您未中奖";
              param={
                userid:m.Userid,
               name:m.name,
                price:"",
                type:"",
                data:"很遗憾您未中奖"
            }
            self.result.active=true;
            self.resultLabel.string='未中奖';
            
               self.yuanbao1.active=false;
            self.yinbi1.active=false;
            self.yinbi2.active=false;
            self.yinbi3.active=false;
            self.yinbi4.active=false;
            self.zuanshi.active=false;
            self.guizhu.active=true;
            self.gold2.active=false;
            self.gold1.active=false;
        }else if(150<x&&x<=180){
             msg="恭喜获得银币500";
               param={
                userid:m.Userid,
                name:m.name,
                price:500,
                type:"银币",
                data:""
            }
            self.result.active=true;
            self.resultLabel.string='500银币';
            self.yinbi3.active=true;
               self.yuanbao1.active=false;
            self.yinbi1.active=false;
            self.yinbi2.active=false;
            
            self.yinbi4.active=false;
            self.zuanshi.active=false;
            self.guizhu.active=false;
            self.gold2.active=false;
            self.gold1.active=false;
        }else if(180<x&&x<210){
             msg="恭喜获得钻石1";
               param={
                userid:m.Userid,
               name:m.name,
                price:1,
                type:"钻石",
                data:""
            } 
            self.result.active=true;
            self.resultLabel.string='1钻石';
            self.zuanshi.active=true;
               self.yuanbao1.active=false;
            self.yinbi1.active=false;
            self.yinbi2.active=false;
            self.yinbi3.active=false;
            self.yinbi4.active=false;
           
            self.guizhu.active=false;
            self.gold2.active=false;
            self.gold1.active=false;
        }else if(210<=x&&x<=240){
              msg="恭喜获得银币200";
               param={
                userid:m.Userid,
               name:m.name,
                price:200,
                type:"银币",
                data:""
            }
            self.result.active=true;
            self.resultLabel.string='200银币';
            self.yinbi4.active=true;
               self.yuanbao1.active=false;
            self.yinbi1.active=false;
            self.yinbi2.active=false;
            self.yinbi3.active=false;
           
            self.zuanshi.active=false;
            self.guizhu.active=false;
            self.gold2.active=false;
            self.gold1.active=false;
        }else if(240<x&&x<=270){
             msg="恭喜获得50金币";
              param={
                userid:m.Userid,
               name:m.name,
                price:50,
                type:"金币",
                data:""
            }
            self.result.active=true;
            self.resultLabel.string='50金币';
            self.gold2.active=true;
               self.yuanbao1.active=false;
            self.yinbi1.active=false;
            self.yinbi2.active=false;
            self.yinbi3.active=false;
            self.yinbi4.active=false;
            self.zuanshi.active=false;
            self.guizhu.active=false;
          
            self.gold1.active=false;
        }else if(270<x&&x<=300){
             msg="恭喜获得金币5";
              param={
               name:m.name,
               userid:m.Userid,
                price:5,
                type:"金币",
                data:""
            }
            self.result.active=true;
            self.resultLabel.string='5金币';
            self.gold1.active=true;
               self.yuanbao1.active=false;
            self.yinbi1.active=false;
            self.yinbi2.active=false;
            self.yinbi3.active=false;
            self.yinbi4.active=false;
            self.zuanshi.active=false;
            self.guizhu.active=false;
            self.gold2.active=false;
          
        }else if(300<x&&x<=330){
             msg="恭喜获得银币500";
               param={
                userid:m.Userid,
                name:m.name,
                price:500,
                type:"银币",
                data:""
            }
            self.result.active=true;
            self.resultLabel.string='500银币';
            self.yinbi3.active=true;
               self.yuanbao1.active=false;
            self.yinbi1.active=false;
            self.yinbi2.active=false;
     
            self.yinbi4.active=false;
            self.zuanshi.active=false;
            self.guizhu.active=false;
            self.gold2.active=false;
            self.gold1.active=false;
        }else if(330<x&&x<360){
             msg="恭喜获得金币5";
              param={
               name:m.name,
               userid:m.Userid,
                price:5,
                type:"金币",
                data:""
            }
            self.result.active=true;
            self.resultLabel.string='5金币';
            self.gold1.active=true;
               self.yuanbao1.active=false;
            self.yinbi1.active=false;
            self.yinbi2.active=false;
            self.yinbi3.active=false;
            self.yinbi4.active=false;
            self.zuanshi.active=false;
            self.guizhu.active=false;
            self.gold2.active=false;
           
        }else{
            
        }
        console.log(msg);
        socket.emit('AddWithReduce',param);
    },  
    closeResult:function(){
        this.result.active=false;
        this.fivejinbi.interactable=true;
    },
    //转盘转的度数
    num:function(){
         var num1 = Math.random()*360 ;
         num1 = parseInt(num1, 10);
         return  num1;
    },
    backhome:function(){
        cc.director.loadScene('Home');
    },
    yes:function(){
         cc.director.loadScene('Mall');
    },
     no:function(){
        this.shifou.active=false;
    },
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
    
    },
});
