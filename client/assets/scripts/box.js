
var socket;
var PersonMsg;
var type;

cc.Class({
    extends: cc.Component,

    properties: {
         Scoin:{
            default:null,
            type:cc.Label
        },
        Gcoin:{
            default:null,
            type:cc.Label
        },
         yb:{
            default:null,
            type:cc.Label
        },
         zs:{
            default:null,
            type:cc.Label
        },
        other:{
            default:null,
            type:cc.EditBox
        },
        numG:{
            default:null,
            type:cc.EditBox
        },
        numS:{
            default:null,
            type:cc.EditBox
        },
        numT:{
            default:null,
            type:cc.EditBox
        },
        numT1:{
            default:null,
            type:cc.EditBox
        },
        
        bbxpwd:{
            default:null,
            type:cc.EditBox
        },
        type:'',
        bbxPage:cc.Node,
        firstPage:cc.Node,
        savePage:cc.Node,
        getPage:cc.Node,
        toPage:cc.Node,
        tranPage:cc.Node,
        msg:cc.Node,
        msgLabel:{
            default:null,
            type:cc.Label
        },
        showS:{
            default:null,
            type:cc.Label
        },
        showG:{
            default:null,
            type:cc.Label
        },
        showT:{
            default:null,
            type:cc.Label
        },
        showT1:{
            default:null,
            type:cc.Label
        },
        showT2:{
            default:null,
            type:cc.Label
        },
        type1:'',
        type2:'',
        m:'',
          PasswordText:{
            default:null,
            type:cc.EditBox
        },
       title:{
           default:null,
           type:cc.Label
       },
        buttonlabel:{
           default:null,
           type:cc.Label
       },
    },
   
    // use this for initialization
    onLoad: function () {
         if(cc.ss.soket){
         socket=cc.ss.soket;
            }
             var self=this;
         //socket=window.io('http://192.168.0.100:7777');
           PersonMsg=JSON.parse(cc.sys.localStorage.getItem("UserMessage"));
        var data={userid:PersonMsg.Userid,name:PersonMsg.name};
           //this.firstPage.active=false; this.bbxPage.active=true;
           socket.emit('box_show',data);
        //转账的结果
           socket.on(PersonMsg.name+'box_tr',(msg)=>{
            msg=JSON.parse(msg);
            if(msg.status===true){
          console.log(msg);
           var data={userid:PersonMsg.Userid,name:PersonMsg.name};
           //this.firstPage.active=false; this.bbxPage.active=true;
           socket.emit('box_show',data);
          var xxx={name: PersonMsg.name};
          socket.emit('homeCoin',xxx);
            }else{
                console.log(msg.data);
                self.msg.active=true;
                self.msgLabel.string=msg.data;
                  var timeCallback = function () {
                        self.msg.active=false;
                        
                    }
                    self.schedule(timeCallback, 1, 0, 1.5);
            }
        });
        //  socket.on(PersonMsg.name+'box_rate',(msg)=>{
        //   console.log(msg);
        // })
        
       
        console.log(PersonMsg);
        var msg={userid:PersonMsg.Userid,name:PersonMsg.name};
       socket.emit('passIsNull',msg); 
       
       socket.on(PersonMsg.name+'passIsNull',(param)=>{
           param=JSON.parse(param);
           console.log(param);
           if(param.status==200){
               this.title.string='请设置密码：';
               this.buttonlabel.string='保存';
               cc.sys.localStorage.setItem("BoxPassword",1);
           }else if(param.status==300){
               this.title.string='请输入密码：';
               cc.sys.localStorage.setItem("BoxPassword",2);
               this.buttonlabel.string='确认';
           }else{
               console.log(param);
           }
       });
       socket.on(PersonMsg.name+'boxCheck',(param)=>{
            param=JSON.parse(param);
           if(param.status===true){
           var data={userid:PersonMsg.Userid,name:PersonMsg.name};
           this.firstPage.active=false; this.bbxPage.active=true;
           socket.emit('box_show',data);
           }
           else{
               console.log(param);
               self.msg.active=true;
                self.msgLabel.string=param.msg;
                  var timeCallback = function () {
                        self.msg.active=false;
                        
                    }
                    self.schedule(timeCallback, 1, 0, 1.5);
           }
           
       });
       //展示银金钻数量
       socket.on(PersonMsg.name+'box_showCoin',(msg)=>{
            msg=JSON.parse(msg);
            console.log(msg.msg.Scoin);
             if(msg.msg.Diamond>10000){
                     this.zs.string=(msg.msg.Diamond/10000).toFixed(2)+'万';
                 } else{
                     this.zs.string=msg.msg.Diamond;
                 }
                 if(msg.msg.Gcoin>10000){
                     this.Gcoin.string=(msg.msg.Gcoin/10000).toFixed(2)+'万';
                 } else{
                      this.Gcoin.string=msg.msg.Gcoin;
                 }
                 if(msg.msg.Scoin>10000){
                      this.Scoin.string=(msg.msg.Scoin/10000).toFixed(2)+'万';
                 }else{
                      this.Scoin.string=msg.msg.Scoin;
                 }
                 if(msg.msg.yb>10000){
                      this.yb.string=(msg.msg.yb/10000).toFixed(2)+'万';
                 }else{
                      this.yb.string=msg.msg.yb;
                 }
            
            console.log(msg);
        })
        
        
    },
   
    
    enterbbx:function(){
         var pass=this.PasswordText.string;
         var type= cc.sys.localStorage.getItem("BoxPassword");
         console.log(type);
         var param={userid:PersonMsg.Userid,name:PersonMsg.name,password:pass,type:type};
         socket.emit('boxpass',param);
       
        //!!加一个判断密码是否正确 跳转到第二个页面 this.firstPage.active=false; this.bbxPage.active=true;
       
       // PersonMsg=JSON.parse(cc.sys.localStorage.getItem("UserMessage"));
        
        
    },
    closeSavePage:function(){
        this.savePage.active=false;
    },
    closegetPage:function(){
        this.getPage.active=false;
    },
    closetoPage:function(){
       this.toPage.active=false;
    },
    closetranPage:function(){
        this.tranPage.active=false;
    },
    backhome:function(){
        cc.director.loadScene('Home');
    },
    showSavePage:function(){
        this.savePage.active=true;
        this.getPage.active=false;
        this.toPage.active=false;
        this.tranPage.active=false;
    },
    showgetPage:function(){
        this.savePage.active=false;
        this.getPage.active=true;
        this.toPage.active=false;
        this.tranPage.active=false;
    },
    showtoPage:function(){
        this.savePage.active=false;
        this.getPage.active=false;
        this.toPage.active=true;
        this.tranPage.active=false;
    },
    showtranPage:function(){
        this.savePage.active=false;
        this.getPage.active=false;
        this.toPage.active=false;
        this.tranPage.active=true;
    },
    showSavetypeS:function(){
        this.type='银币';
        this.showS.string='聚气石';
    },
    showSavetypeG:function(){
        this.type='金币';
        this.showS.string='灵石';
    },
    showSavetypeD:function(){
        this.type='钻石';
        this.showS.string='黑币';
    },
    showSavetypeY:function(){
        this.type='元宝';
        this.showS.string='灵脉';
    }, 
    showGettypeS:function(){
        this.type='银币';
        this.showG.string='聚气石';
    },
    showGettypeG:function(){
        this.type='金币';
        this.showG.string='灵石';
    },
    showGettypeD:function(){
        this.type='钻石';
        this.showG.string='黑币';
    },
    showGettypeY:function(){
        this.type='元宝';
        this.showG.string='灵脉';
    },
     showTotypeS:function(){
        this.type='银币';
        this.showT.string='聚气石';
    },
    showTotypeG:function(){
        this.type='金币';
        this.showT.string='灵石';
    },
    showTotypeD:function(){
        this.type='钻石';
        this.showT.string='黑币';
    },
    showTotypeY:function(){
        this.type='元宝';
        this.showT.string='灵脉';
    },
     showTran1typeS:function(){
        this.type1='银币';
        this.showT1.string='聚气石';
    },
    showTran1ypeG:function(){
        this.type1='金币';
        this.showT1.string='灵石';
    },
    showTran1typeD:function(){
        this.type1='钻石';
        this.showT1.string='黑币';
    },
    showTran1typeY:function(){
        this.type1='元宝';
        this.showT1.string='灵脉';
    },
     showTran2typeS:function(){
        this.type2='银币';
        this.showT2.string='聚气石';
    },
    showTran2ypeG:function(){
        this.type2='金币';
        this.showT2.string='灵石';
    },
    showTran2typeD:function(){
        this.type2='钻石';
        this.showT2.string='黑币';
    },
    showTran2typeY:function(){
        this.type2='元宝';
        this.showT2.string='灵脉';
    },
//百宝箱里
IntoBox:function(){
     var self=this;
    if(this.type===null||this.type===''){
         self.msg.active=true;
                self.msgLabel.string='请选择筹码类型';
                  var timeCallback = function () {
                        self.msg.active=false;
                        
                    }
                    self.schedule(timeCallback, 1, 0, 1.5);
                     return;
    }
      if(this.numS.string===null||this.numS.string===''){
         self.msg.active=true;
                self.msgLabel.string='请选择筹码数量';
                  var timeCallback = function () {
                        self.msg.active=false;
                        
                    }
                    self.schedule(timeCallback, 1, 0, 1.5);
                     return;
    }
    var param={userid:PersonMsg.Userid,name:PersonMsg.name,type:this.type,num:this.numS.string,to:1,target:0};
    socket.emit('box_transfer',param);
    this.savePage.active=false;
},
//提现百宝箱
outOfBox:function(){
    var self=this;
    if(this.type===null||this.type===''){
         self.msg.active=true;
                self.msgLabel.string='请选择筹码类型';
                  var timeCallback = function () {
                        self.msg.active=false;
                        
                    }
                    self.schedule(timeCallback, 1, 0, 1.5);
                     return;
    }
      if(this.numG.string===null||this.numG.string===''){
         self.msg.active=true;
                self.msgLabel.string='请选择筹码数量';
                  var timeCallback = function () {
                        self.msg.active=false;
                        
                    }
                    self.schedule(timeCallback, 1, 0, 1.5);
                     return;
    }
      var param={userid:PersonMsg.Userid,name:PersonMsg.name,type:this.type,num:this.numG.string,to:-1,target:0};
      socket.emit('box_transfer',param);
      this.getPage.active=false;
},
//向他人转账
toOther:function(){
    var self=this;
    if(this.type===null||this.type===''){
         self.msg.active=true;
                self.msgLabel.string='请选择筹码类型';
                  var timeCallback = function () {
                        self.msg.active=false;
                        
                    }
                    self.schedule(timeCallback, 1, 0, 1.5);
                     return;
    }
      if(this.numT.string===null||this.numT.string===''){
         self.msg.active=true;
                self.msgLabel.string='请选择筹码数量';
                  var timeCallback = function () {
                        self.msg.active=false;
                        
                    }
                    self.schedule(timeCallback, 1, 0, 1.5);
                     return;
    }
       if(this.other.string===null||this.other.string===''){
         self.msg.active=true;
                self.msgLabel.string='请选择接收人';
                  var timeCallback = function () {
                        self.msg.active=false;
                        
                    }
                    self.schedule(timeCallback, 1, 0, 1.5);
                     return;
    }
    var param={from:PersonMsg.Userid,name:PersonMsg.name,type:this.type,num:this.numT.string,to:this.other.string,target:1};
     socket.emit('box_transfer',param);
     this.toPage.active=false;
} ,

zhuanhuan:function(){
    var self=this;
    if(this.type1===null||this.type1===''){
         self.msg.active=true;
                self.msgLabel.string='请选择筹码类型';
                  var timeCallback = function () {
                        self.msg.active=false;
                        
                    }
                    self.schedule(timeCallback, 1, 0, 1.5);
                     return;
    }
      if(this.numT1.string===null||this.numT1.string===''){
         self.msg.active=true;
                self.msgLabel.string='请选择筹码数量';
                  var timeCallback = function () {
                        self.msg.active=false;
                        
                    }
                    self.schedule(timeCallback, 1, 0, 1.5);
                     return;
    }
       if(this.type2===null||this.type2===''){
         self.msg.active=true;
                self.msgLabel.string='请选择筹码类型';
                  var timeCallback = function () {
                        self.msg.active=false;
                        
                    }
                    self.schedule(timeCallback, 1, 0, 1.5);
                     return;
    }
    var param={from:this.type1,userid:PersonMsg.Userid,name:PersonMsg.name,to:this.type2,num:this.numT1.string};
    socket.emit('box_huan',param);
    this.tranPage.active=false;
    
}
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});