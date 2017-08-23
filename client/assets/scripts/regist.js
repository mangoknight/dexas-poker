cc.Class({
    extends: cc.Component,

    properties: {
        userName: {
            default: null,
            type: cc.EditBox
        },
        userPw: {
            default: null,
            type: cc.EditBox
        },
        userPw1:{
            default: null,
            type: cc.EditBox
        },
       
        yanzheng: {
            default: null,
            type: cc.EditBox
        },
        yanzheng1: {
            default: null,
            type: cc.EditBox
        },
          GVCLabel: {
            default: null,
            type: cc.Label
        },
        GVCLabel1: {
            default: null,
            type: cc.Label
        },
         buttonhuoqu:{
            default:null,
            type:cc.Button
        },
         buttonhuoqu1:{
            default:null,
            type:cc.Button
        },
        showLabel:{
            default: null,
            type: cc.Label
        },
        nameText: {
            default: null,
            type: cc.EditBox
        },
        sexText: {
            default: null,
            type: cc.EditBox
        },
        imageText: {
            default: null,
            type: cc.EditBox
        },
        message:cc.Node,
        messageLabel:{
            default:null,
            type:cc.Label
        },
        pLast:cc.Node,
        pLogin:cc.Node,
        pReg:cc.Node,
        pForget:cc.Node,
        DTime:60,
         X_Account: {
            default: null,
            type: cc.EditBox
        },
         X_pas: {
            default: null,
            type: cc.EditBox
        },
         X_pas1: {
            default: null,
            type: cc.EditBox
        },
    },
    
    // use this for initialization
    onLoad: function () {
      this.GVCLabel.string="获取验证码";
       this.GVCLabel1.string="获取验证码";
    },
     buttonClicked: function() {
         var self=this;
        if(this.userPw.string!==this.userPw1.string){
            this.showLabel.string='二次输入密码不一致';
        }else{
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "http://106.14.40.93:7777/userapi/regist?phone="+this.userName.string+"&passwd="+this.userPw.string+"&yzm="+this.yanzheng.string+"&tuijian=123", true);
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded"); 
        xhr.send();
        xhr.onreadystatechange =function() 
        {
           if (xhr.readyState == 4 && (xhr.status >= 0 && xhr.status < 400)) 
            {
             var response = xhr.responseText;
             console.log(response);
             var a=JSON.parse(response);
                   if(a.status===0)  
                   {
                    cc.sys.localStorage.setItem("id",JSON.stringify(a.msg.id));
                    self.message.active=true;
                    self.messageLabel.string='注册成功！';
                    var timeCallback = function () {
                        self.message.active=false;
                        self.pLast.active=true;
                        self.pReg.active=false;
                    }
                    self.schedule(timeCallback, 1.5, 0, 1.5);
                    
               
                   }
                  else
                  {
                    self.message.active=true;
                    
                    self.messageLabel.string=a.msg.desc;
                    var timeCallback = function () {
                        self.message.active=false;
                    }
                    self.schedule(timeCallback, 1.5, 0, 1.5);
           
                  }
         }
        }
    }
    },
     buttonClicked2: function() {
         var self=this;
        if(this.X_pas.string!==this.X_pas1.string){
            this.showLabel.string='二次输入密码不一致';
        }else{
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "http://106.14.40.93:7777/userapi/forgetpas?phone="+this.X_Account.string+"&passwd="+this.X_pas1.string+"&yzm="+this.yanzheng1.string+"&tuijian=123", true);
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded"); 
        xhr.send();
        xhr.onreadystatechange =function() 
        {
           if (xhr.readyState == 4 && (xhr.status >= 0 && xhr.status < 400)) 
            {
             var response = xhr.responseText;
             console.log(response);
             var a=JSON.parse(response);
                   if(a.status===0)  
                   {
                    cc.sys.localStorage.setItem("id",JSON.stringify(a.msg.id));
                    self.message.active=true;
                    self.messageLabel.string='修改成功！';
                    var timeCallback = function () {
                        self.message.active=false;
                       self.pLogin.active=true;
                       self.pForget.active=false;
                       
                    }
                    self.schedule(timeCallback, 1.5, 0, 1.5);
                    
               
                   }
                  else
                  {
                    self.message.active=true;
                    
                    self.messageLabel.string=a.msg.desc;
                    var timeCallback = function () {
                        self.message.active=false;
                    }
                    self.schedule(timeCallback, 1.5, 0, 1.5);
           
                  }
         }
        }
    }
    },
     ReduceTime:function(){
        var ccc=this;
        if(ccc.DTime>0)
        {
            ccc.DTime--;
            ccc.GVCLabel.string=ccc.DTime+"s";
            this.buttonhuoqu.interactable=false;
        }
        else
        {
            ccc.GVCLabel.string="获取验证码";
            this.buttonhuoqu.interactable=true;
            //this.DTime=60;
        }
      
    },
         ReduceTime1:function(){
        var ccc=this;
        if(ccc.DTime>0)
        {
            ccc.DTime--;
            ccc.GVCLabel1.string=ccc.DTime+"s";
            this.buttonhuoqu1.interactable=false;
        }
        else
        {
            ccc.GVCLabel1.string="获取验证码";
            this.buttonhuoqu1.interactable=true;
            //this.DTime=60;
        }
      
    },
    
 //发送短信接口
    SendMessage:function(){
        
        var self=this;
        var phone=this.userName.string;
        var xhr = new XMLHttpRequest();
        xhr.open("GET","http://106.14.40.93:7777/userapi/phone?phone="+phone , true);
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded"); 
        xhr.send();
        xhr.onreadystatechange = function () 
        {
           if (xhr.readyState == 4 && (xhr.status >= 0 && xhr.status < 400))
             {
             var response = xhr.responseText;
             console.log(response);
             var a=JSON.parse(response);
             if(a.status===200){
                 console.log(a);
                  if(self.DTime===60){
                    self.schedule(function() {
                    self.ReduceTime();
                    }, 1);}
                    self.DTime=60;
                self.messageLabel.string='发送成功！';
                self.message.active=true;
                
                var timeCallback = function () {
                        self.message.active=false;
                    }
                self.schedule(timeCallback, 1.5, 0, 1.5);    
             }
             else{
                
                 console.log("error--->"+a.msg.error);
             }
            
         
             }
  
        };
        
    },
    SendMessage1:function(){
        
        var self=this;
        var phone=this.X_Account.string;
        var xhr = new XMLHttpRequest();
        xhr.open("GET","http://106.14.40.93:7777/userapi/phone?phone="+phone , true);
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded"); 
        xhr.send();
        xhr.onreadystatechange = function () 
        {
           if (xhr.readyState == 4 && (xhr.status >= 0 && xhr.status < 400))
             {
             var response = xhr.responseText;
             console.log(response);
             var a=JSON.parse(response);
             if(a.status===200){
                 console.log(a);
                  if(self.DTime===60){
                    self.schedule(function() {
                    self.ReduceTime1();
                    }, 1);}
                    self.DTime=60;
                self.messageLabel.string='发送成功！';
                self.message.active=true;
                
                var timeCallback = function () {
                        self.message.active=false;
                    }
                self.schedule(timeCallback, 1.5, 0, 1.5);    
             }
             else{
                
                 console.log("error--->"+a.msg.error);
             }
            
         
             }
  
        };
        
    },
    buttonClicked1: function() {
         var  self=this;
        var id=JSON.parse(cc.sys.localStorage.getItem("id"));
        var xhr = new XMLHttpRequest();
        var abc = "name="+encodeURI(this.nameText.string)+"&sex="+encodeURI(this.sexText.string)+"&id="+id;
        console.log(abc);
        xhr.open("GET", "http://106.14.40.93:7777/userapi/addMessage?"+abc, true);
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded"); 
      
        xhr.send();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 0 && xhr.status < 400)) {
                var response = xhr.responseText;
                console.log(response);
                var result = JSON.parse(response);
                 if(result.status===0){
                   console.log(result.msg);
                     self.pLast.active=false;
                     self.pLogin.active=true;
             }else{
                
              console.log(result.msg);
            }
            }

        }
       
    }, 
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
