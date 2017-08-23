
cc.Class({
    extends: cc.Component,

    properties: {
        pLogin:cc.Node,
        pReg:cc.Node,
        phoneLogin:cc.Node,
        weixinLogin:cc.Node,
        // qqLogin:cc.Node,
        userText: {
            default: null,
            type: cc.EditBox
        },
        pwText: {
            default: null,
            type: cc.EditBox
        },
        message:cc.Node,
        messageLabel:{
            default:null,
            type:cc.Label
        },
        pForget:cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        var isFirst=cc.sys.localStorage.getItem("DZFirst"); 
        var isLogin= JSON.parse(cc.sys.localStorage.getItem("Login")); 
        if(isFirst===""||isFirst===undefined||isFirst===null){
            this.goRegister();
        }else{
          if(isLogin===""||isLogin===undefined||isLogin===null){
              
          }else{
              this.buttonClicked1(isLogin.phone,isLogin.passwd);
          }
        }      

    },
    phone: function(){
        this.pReg.active=false;
        this.pLogin.active=true;
        this.phoneLogin.active=false;
        this.weixinLogin.active=false;
        // this.qqLogin.active=false;
        this.pForget.active=false;
    },
    backLogin:function(){
         cc.director.loadScene('Login');
        // this.pLogin.active=false;
        // this.phoneLogin.active=true;
        // this.weixinLogin.active=true;
        // this.qqLogin.active=true;
    },
    back:function(){
        this.pReg.active=false;
        this.pLogin.active=true;
        this.phoneLogin.active=false;
        this.weixinLogin.active=false;
        // this.qqLogin.active=false;
        this.pForget.active=false;
    },
    
    goRegister:function(){
        this.pReg.active=true;
        this.pLogin.active=false;
        this.phoneLogin.active=false;
        this.weixinLogin.active=false;
        // this.qqLogin.active=false;
        this.pForget.active=false;
    },
    goForget:function(){
        this.pForget.active=true;
        this.pReg.active=false;
        this.pLogin.active=false;
        this.phoneLogin.active=false;
        this.weixinLogin.active=false;
        // this.qqLogin.active=false;
    },
    okForget:function(){
        this.pForget.active=false;
        this.pReg.active=false;
        this.pLogin.active=false;
        this.phoneLogin.active=true;
        this.weixinLogin.active=true;
        // this.qqLogin.active=true;
    },
    buttonClicked: function() {
          var self=this;
         if(this.userText.string===null||this.userText.string===undefined||this.userText.string===""){
             self.messageLabel.string='账号为空！';
         }
         if(this.pwText.string===null||this.pwText.string===undefined||this.pwText.string===""){
             self.messageLabel.string=' 密码为空！';
         }
        try{
        var xhr = new XMLHttpRequest();
        var abc = "phone="+this.userText.string+"&passwd="+this.pwText.string;
    //   xhr.open("GET", "http://192.168.2.155:7777/userapi/login?"+abc, true);
        xhr.open("GET", "http://106.14.40.93:7777/userapi/login?"+abc, true);
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded"); 
       
        xhr.send();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 0 && xhr.status < 400)) {
                var response = xhr.responseText;
                console.log(response);
                var result = JSON.parse(response);
                // console.log(result.msg.desc);   
                 if(result.status === 0){
                    var x={phone:self.userText.string,passwd:self.pwText.string};
                    cc.sys.localStorage.setItem("Login",JSON.stringify(x)); 
                    cc.sys.localStorage.setItem("UserMessage",JSON.stringify(result.msg)); 
                    self.message.active=true;
                    self.messageLabel.string='登陆成功！';
                      cc.ss = {};
                    var configs = require('config');
                    cc.ss.config =new configs();
                   cc.ss.soket= cc.ss.config.socket();
                   var firsttime=cc.sys.localStorage.getItem("DZFirst"); 
                   if(firsttime===""||firsttime===undefined||firsttime===null){
                      var timeCallback = function () {
                      var y={isFirst:1};
                      cc.sys.localStorage.setItem("DZFirst",JSON.stringify(y)); 
                        self.message.active=false;
                        cc.director.loadScene('jianjie');
                        
                     }
                    self.schedule(timeCallback, 1.5, 0, 1.5);
                   }else{
                    var timeCallback = function () {
                        self.message.active=false;
                        cc.director.loadScene('Home');
                    }
                    self.schedule(timeCallback, 1.5, 0, 1.5);
                   
                   }
                  
            }else{
                    self.message.active=true;
                    
                    self.messageLabel.string=result.msg.desc;
                      
                    var timeCallback = function () {
                        self.message.active=false;
                        
                    }
                    self.schedule(timeCallback, 1.5, 0, 1.5);//（function ,间隔时间,重复repeat+1次,开始时间.）
           
            }
        }

        }
        }catch(e){
            self.message.active=true;
            self.messageLabel.string='检查您的网络！';
             var timeCallback = function () {
                        self.message.active=false;
                        
                    }
                    self.schedule(timeCallback, 1.5, 0, 1.5);
        }
    }, 
   
    buttonClicked1: function(phone,passwd) {
        var self=this;
        try{
        var xhr = new XMLHttpRequest();
        var abc = "phone="+phone+"&passwd="+passwd;
        // xhr.open("GET", "http://192.168.0.112:7777/userapi/login?"+abc, true);
        xhr.open("GET", "http://106.14.40.93:7777/userapi/login?"+abc, true);
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded"); 
       
        xhr.send();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 0 && xhr.status < 400)) {
                var response = xhr.responseText;
                console.log(response);
                var result = JSON.parse(response);
                // console.log(result.msg.desc);   
                 if(result.status === 0){
                   
                    cc.sys.localStorage.setItem("UserMessage",JSON.stringify(result.msg)); 
                    cc.ss = {};
                var configs = require('config');
                cc.ss.config =new configs();
              cc.ss.soket= cc.ss.config.socket();
                        cc.director.loadScene('Home');
            }else{
                    self.message.active=true;
                    
                    self.messageLabel.string=result.msg.desc;
                      
                    var timeCallback = function () {
                        self.message.active=false;
                        
                    }
                    self.schedule(timeCallback, 1.5, 0, 1.5);//（function ,间隔时间,重复repeat+1次,开始时间.）
           
            }
        }

        }
        }catch(e){
            self.message.active=true;
            self.messageLabel.string='检查您的网络！';
             var timeCallback = function () {
                        self.message.active=false;
                        
                    }
                    self.schedule(timeCallback, 1.5, 0, 1.5);
        }
    }, 
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
