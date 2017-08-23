var socket;
var PersonMsg;
cc.Class({
    extends: cc.Component,

    properties: {
        fangfei:cc.Node,
        moneyType:cc.Node,
        coinType:'',
        money:0,
        roomtype:'yule',
        btn1:cc.Button,
        btn2:cc.Button,
        btn3:cc.Button,
        btn4:cc.Button,
        btn5:cc.Button,
        btn6:cc.Button,
        msg:cc.Node,
        msgLabel:cc.Label,
        shifou:cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        var self=this;
         if(cc.ss.soket){
        socket=cc.ss.soket;
            }
        
        PersonMsg=JSON.parse(cc.sys.localStorage.getItem("UserMessage"));
        socket.on('joinroom'+PersonMsg.name,(param)=>{
               param=JSON.parse(param);
               
               console.log(param);
              if(param.status===true){
                 console.log("进房");
                  self.roomid=param.msg.roomid;
                var r={roomid:param.msg.roomid,player1:param.msg.number1,player2:param.msg.number2,
                player3:param.msg.number3,player4:param.msg.number4,player5:param.msg.number5,
                player6:param.msg.number6,player7:param.msg.number7,player8:param.msg.number8,type:param.msg.xiazhu,money:param.msg.money,coin:param.msg.roomType};
                cc.sys.localStorage.setItem("roomid",JSON.stringify(r)); 
                cc.director.loadScene('yulechang');
              }else{
                  //提示错误
              }
           });
        
    },
    jinbi:function(){
        this.coinType='gold';
        this.moneyType.active=false;
        this.fangfei.active=true;
    },
    yinbi:function(){
        this.coinType='sliver';
        this.moneyType.active=false;
        this.fangfei.active=true;
    },
    zuanshi:function(){
        this.coinType='diamond';
        this.moneyType.active=false;
        this.fangfei.active=true;
    },
    match1:function(){
        this.money=2000;
        this.btn1.interactable=false;
        this.buttonOnclick();
        
        // cc.director.loadScene('Table');
    },
    match2:function(){
        this.money=5000;
        this.btn2.interactable=false;
         //cc.director.loadScene('Table');
          this.buttonOnclick();
        
    },
    match3:function(){
        this.money=10000;
        this.btn3.interactable=false;
         //cc.director.loadScene('Table');
        this.buttonOnclick();
        
    },
    match4:function(){
        this.money=20000;
        this.btn4.interactable=false;
        // cc.director.loadScene('Table');
         this.buttonOnclick();
         
    },
    match5:function(){
        this.btn5.interactable=false;
        this.money=50000;
         //cc.director.loadScene('Table');
          this.buttonOnclick();
         
    },
    match6:function(){
        this.btn6.interactable=false;
        this.money=100000;
        // cc.director.loadScene('Table');
        this.buttonOnclick();
        
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
        var param={type:this.roomtype,userid:PersonMsg.Userid,name:PersonMsg.name,coin:this.coinType,money:this.money,};
        socket.emit('joinroom',param);
        socket.emit('Gsavenum',param);

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
    
});
