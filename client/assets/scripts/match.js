
var socket;

var PersonMsg;
cc.Class({
    extends: cc.Component,

    properties: {
        youxianzhu:cc.Node,
        wuxianzhu:cc.Node,
        yazhuxianzhi:cc.Node,
        youxianzhu1:cc.Node,
        wuxianzhu1:cc.Node,
        yazhuxianzhi1:cc.Node,
        baoxiang:cc.Node,
        fangfei:cc.Node,
        yazhuType:'',
        coinType:'',
        moneyType:0,
        roomid:'',
        audioMng:cc.Node,
        btn1:cc.Button,
        btn2:cc.Button,
        btn3:cc.Button,
        btn4:cc.Button,
        btn5:cc.Button,
        btn6:cc.Button,
        msg:cc.Node,
        msgLabel:cc.Label,
        shifou:cc.Node,
        wanfajieshao:cc.Node,
        jiazhu1:cc.Node,
        jiazhu2:cc.Node,
        jiazhu3:cc.Node,
        jiazhu4:cc.Node,
        jiazhu5:cc.Node,
        jiazhu6:cc.Node,
        num1:cc.Label,
        num2:cc.Label,
        num3:cc.Label,
        num4:cc.Label,
        num5:cc.Label,
        num6:cc.Label,
        
         
    },

   
    onLoad: function () {
         if(cc.ss.soket){
         socket=cc.ss.soket;
            }
        this.jiazhu1.active=true;
        this.jiazhu2.active=true;
        this.jiazhu3.active=true;
        this.jiazhu4.active=true;
        this.jiazhu5.active=true;
        this.jiazhu6.active=true;
        this.btn1.interactable=true;
        this.btn2.interactable=true;
        this.btn3.interactable=true;
        this.btn4.interactable=true;
        this.btn5.interactable=true;
        this.btn6.interactable=true;
        this.audioMng = this.audioMng.getComponent('Audio');
        this.audioMng.playHomeMusic();
        this.yazhuType='youxianzhu';
         //socket=window.io('http://192.168.0.100:7777');
         PersonMsg=JSON.parse(cc.sys.localStorage.getItem("UserMessage"));
         socket.on('joinroom'+PersonMsg.name,(param)=>{
               param=JSON.parse(param);
               console.log(param);
              if(param.status===true){
                 // cc.sys.localStorage.setItem("roomid",JSON.stringify(param.msg.roomid));
                 
                  this.roomid=param.msg.roomid;
                var r={roomid:param.msg.roomid,player1:param.msg.number1,player2:param.msg.number2,
                player3:param.msg.number3,player4:param.msg.number4,player5:param.msg.number5,
                player6:param.msg.number6,player7:param.msg.number7,player8:param.msg.number8,type:param.msg.xiazhu,money:param.msg.money,coin:param.msg.roomType};
            cc.sys.localStorage.setItem("roomid",JSON.stringify(r)); 
                  switch(param.msg.xiazhu){
                      case 'wuxianzhu':cc.director.loadScene('wuxianzhu');break;
                      case 'youxianzhu':cc.director.loadScene('youxianzhu');break;
                      case 'yazhuxianzhi':cc.director.loadScene('chizhu');break;
                      default:break;
                  }
              }else{
                  //提示错误
              }
           });
          
          //  展示人数 
        socket.on('selectnum'+PersonMsg.name,(param)=>{
            param=JSON.parse(param);
            console.log(param);
             this.num1.string=param.msg.num1+'人';
             this.num2.string=param.msg.num2+'人';
             this.num3.string=param.msg.num3+'人';
             this.num4.string=param.msg.num4+'人';
             this.num5.string=param.msg.num5+'人';
             this.num6.string=param.msg.num6+'人';
            
        })  
           
           
        this.youxianzhu.active=true;
        this.wuxianzhu.active=false;
        this.yazhuxianzhi.active=false;
        this.youxianzhu1.active=false;
        this.wuxianzhu1.active=true;
        this.yazhuxianzhi1.active=true;
        this.baoxiang.active=true;
        this.fangfei.active=false;
    }, update: function (dt) {
        if(!cc.ss.soket){
       cc.ss.soket=cc.ss.config.socket();
        }
    },
    youxian:function(){
        this.jiazhu1.active=true;
        this.jiazhu2.active=true;
        this.jiazhu3.active=true;
        this.jiazhu4.active=true;
        this.jiazhu5.active=true;
        this.jiazhu6.active=true;
        this.youxianzhu.active=true;
        this.wuxianzhu.active=false;
        this.yazhuxianzhi.active=false;
        this.youxianzhu1.active=false;
        this.wuxianzhu1.active=true;
        this.yazhuxianzhi1.active=true;
        this.baoxiang.active=true;
        this.fangfei.active=false;
        this.yazhuType='youxianzhu';
    },
    wuxian:function(){
        this.jiazhu1.active=false;
        this.jiazhu2.active=false;
        this.jiazhu3.active=false;
        this.jiazhu4.active=false;
        this.jiazhu5.active=false;
        this.jiazhu6.active=false;
        this.youxianzhu.active=false;
        this.wuxianzhu.active=true;
        this.yazhuxianzhi.active=false;
        this.youxianzhu1.active=true;
        this.wuxianzhu1.active=false;
        this.yazhuxianzhi1.active=true;
        this.baoxiang.active=true;
        this.fangfei.active=false;
        this.yazhuType='wuxianzhu';
    },
    yazhu:function(){
          this.jiazhu1.active=false;
        this.jiazhu2.active=false;
        this.jiazhu3.active=false;
        this.jiazhu4.active=false;
        this.jiazhu5.active=false;
        this.jiazhu6.active=false;
        this.youxianzhu.active=false;
        this.wuxianzhu.active=false;
        this.yazhuxianzhi.active=true;
        this.youxianzhu1.active=true;
        this.wuxianzhu1.active=true;
        this.yazhuxianzhi1.active=false;
        this.baoxiang.active=true;
        this.fangfei.active=false;
        this.yazhuType='yazhuxianzhi';
    },
    jinxiang:function(){
        this.baoxiang.active=false;
        this.fangfei.active=true;
        this.coinType='gold';
        // 查询人数 
        var data={name:PersonMsg.name,type:this.yazhuType,coin:this.coinType}
        socket.emit('selectnum',data)
    },
    yinxiang:function(){
        this.baoxiang.active=false;
        this.fangfei.active=true;     
        this.coinType='sliver';
        var data={name:PersonMsg.name,type:this.yazhuType,coin:this.coinType}
        socket.emit('selectnum',data)
    },
    zuanxiang:function(){
        this.baoxiang.active=false;
        this.fangfei.active=true;     
        this.coinType='diamond';   
        var data={name:PersonMsg.name,type:this.yazhuType,coin:this.coinType}
        socket.emit('selectnum',data)
    },
    buttonOnclick:function(){
        var self =this;
         switch(this.coinType){
           case 'sliver':if(PersonMsg.Scoin<this.moneyType){
               self.msg.active=true;
               self.msgLabel.string=' 银币不足！';   
                var timeCallback = function () {
                        self.msg.active=false;
                        self.shifou.active=true;
                        self.btn1.interactable=true;
                        self.btn2.interactable=true;
                        self.btn3.interactable=true;
                        self.btn4.interactable=true;
                        self.btn5.interactable=true;
                        self.btn6.interactable=true;
                    }
                    self.schedule(timeCallback, 1.5, 0, 0.5); return ;}break;
           case 'gold':if(PersonMsg.Gcoin<this.moneyType){
               self.msg.active=true;
               self.msgLabel.string='  金币不足！';   
                var timeCallback = function () {
                        self.msg.active=false;
                        self.shifou.active=true;
                        self.btn1.interactable=true;
                        self.btn2.interactable=true;
                        self.btn3.interactable=true;
                        self.btn4.interactable=true;
                        self.btn5.interactable=true;
                        self.btn6.interactable=true;
                    }
                    self.schedule(timeCallback, 1.5, 0, 0.5);  return ;}break;
           case 'diamond':if(PersonMsg.Diamond<this.moneyType){
               self.msg.active=true;
               self.msgLabel.string='  钻石不足！';   
                var timeCallback = function () {
                        self.msg.active=false;
                        self.shifou.active=true;
                        self.btn1.interactable=true;
                        self.btn2.interactable=true;
                        self.btn3.interactable=true;
                        self.btn4.interactable=true;
                        self.btn5.interactable=true;
                        self.btn6.interactable=true;
                    }
                    self.schedule(timeCallback, 1.5, 0, 0.5); return ;}break;
           default:  break;
       }
        var param={type:this.yazhuType,userid:PersonMsg.Userid,name:PersonMsg.name,coin:this.coinType,money:this.moneyType,};
        socket.emit('joinroom',param);
        socket.emit('Gsavenum',param);

    },
    match1:function(){
        this.moneyType=2000;
        this.btn1.interactable=false;
        this.buttonOnclick();
        
        // cc.director.loadScene('Table');
    },
    match2:function(){
        this.moneyType=5000;
        this.btn2.interactable=false;
         //cc.director.loadScene('Table');
          this.buttonOnclick();
        
    },
    match3:function(){
        this.moneyType=10000;
        this.btn3.interactable=false;
         //cc.director.loadScene('Table');
          this.buttonOnclick();
        
    },
    match4:function(){
        this.moneyType=20000;
        this.btn4.interactable=false;
        // cc.director.loadScene('Table');
         this.buttonOnclick();
         
    },
    match5:function(){
        this.btn5.interactable=false;
        this.moneyType=50000;
         //cc.director.loadScene('Table');
          this.buttonOnclick();
         
    },
    match6:function(){
        this.btn6.interactable=false;
        this.moneyType=100000;
        // cc.director.loadScene('Table');
         this.buttonOnclick();
        
    },
    back:function(){
        cc.director.loadScene('Home');
    },
      yes:function(){
         cc.director.loadScene('Mall');
    },
     no:function(){
        this.shifou.active=false;
    },
    openwanfa:function(){
        this.wanfajieshao.active=true;
    },
    closewanfa:function(){
        this.wanfajieshao.active=false;
    }
   /*  tuifang:function(){
       var  id=JSON.parse(cc.sys.localStorage.getItem("roomid"));
       console.log(id);
       var param={userid:PersonMsg.Userid,name:PersonMsg.name,roomid:id.roomid,xiazhu:this.yazhuType};
        socket.emit('tuifang',param);
    }
    
    */
    
    
});
