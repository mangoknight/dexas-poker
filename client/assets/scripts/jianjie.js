var socket;
cc.Class({
    extends: cc.Component,

    properties: {
         zhidao1:cc.Node,
         zhidao2:cc.Node,
         zhidao3:cc.Node,
         zhidao4:cc.Node,
         zhidao5:cc.Node,
         zhidao6:cc.Node,
         black:cc.Node,
    },

    // use this for initialization
    onLoad: function () {
            if(cc.ss.soket){
         socket=cc.ss.soket;
            }
        cc.log(socket);
    },
    gozhidao1:function(){
        this.zhidao1.active=true;  
    },
    gozhidao2:function(){
        this.zhidao2.active=true;  
    },
    gozhidao3:function(){
        this.zhidao3.active=true;  
    },
    gozhidao4:function(){
        this.zhidao4.active=true;  
    },
    gozhidao5:function(){
        this.black.active=true;
        this.zhidao5.active=true;  
        
    },
    gozhidao6:function(){
        this.black.active=true;
        this.zhidao5.active=false;  
        this.zhidao6.active=true;  
    },
     gohome:function(){
         cc.director.loadScene('Home');

    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
