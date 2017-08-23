var PersonMsg;
cc.Class({
    extends: cc.Component,

    properties: {
 
        chouma:cc.Node,
        tequan:cc.Node,
        daoju:cc.Node,
      //  baibaoxiang:cc.Node,
        choumaS:cc.Node,
        tequanS:cc.Node,
        daojuS:cc.Node,
       // baibaoxiangS:cc.Node,
        choumaButton:cc.Node,
        tequanButton:cc.Node,
        daojuButton:cc.Node,
        //baibaoxiangButton:cc.Node,
        s:{
            type:cc.Label,
            default:null
        },
        g:{
            type:cc.Label,
            default:null
        },
        d:{
            type:cc.Label,
            default:null
        },
        yuan:{
            type:cc.Label,
            default:null
        },
         vipLabel1:{
            default:null,
            type:cc.Label
        },
        vipLabel2:{
            default:null,
            type:cc.Label
        },
        vipLabel3:{
            default:null,
            type:cc.Label
        },
        vipLabel4:{
            default:null,
            type:cc.Label
        },
        vipLabel5:{
            default:null,
            type:cc.Label
        },
        vipLabel6:{
            default:null,
            type:cc.Label
        },
       vipLabel7:{
            default:null,
            type:cc.Label
        },
        vipLabel8:{
            default:null,
            type:cc.Label
        },
        vipLabel9:{
            default:null,
            type:cc.Label
        },
        audioMng:cc.Node,
    },

    onLoad: function () {
         this.audioMng = this.audioMng.getComponent('Audio');
        this.audioMng.playHomeMusic();
        this.choumaS.active=true;
        this.tequanS.active=false;
        this.daojuS.active=false;
        //this.baibaoxiangS.active=false;
        this.choumaButton.active=false;
        this.tequanButton.active=true;
        this.daojuButton.active=true;
       // this.baibaoxiangButton.active=true;
        this.chouma.active=true;
        this.tequan.active=false;
        this.daoju.active=false;
       // this.baibaoxiang.active=false;
        // PersonMsg=JSON.parse(cc.sys.localStorage.getItem("UserMessage"));
        // this.s.string=PersonMsg.Scoin;
        // this.g.string=PersonMsg.Gcoin;
        // this.d.string=PersonMsg.Diamond;
        // this.yuan.string=PersonMsg.yuanbao;
    },

    showchouma:function(){
        this.choumaS.active=true;
        this.tequanS.active=false;
        this.daojuS.active=false;
     //   this.baibaoxiangS.active=false;
        this.choumaButton.active=false;
        this.tequanButton.active=true;
        this.daojuButton.active=true;
      //  this.baibaoxiangButton.active=true;
        this.chouma.active=true;
        this.tequan.active=false;
        this.daoju.active=false;
       // this.baibaoxiang.active=false;
    },
    showtequan:function(){
        this.choumaS.active=false;
        this.tequanS.active=true;
        this.daojuS.active=false;
     //   this.baibaoxiangS.active=false;
        this.choumaButton.active=true;
        this.tequanButton.active=false;
        this.daojuButton.active=true;
     //   this.baibaoxiangButton.active=true;
        this.chouma.active=false;
        this.tequan.active=true;
        this.daoju.active=false;
      //  this.baibaoxiang.active=false;
        var v=JSON.parse(cc.sys.localStorage.getItem("VIPMoney"));
         console.log(v.VIP1);
         console.log('11111111111111111111111111111111111111111111111111');
         console.log(v.VIP9);
            this.vipLabel1.string=v.VIP1;
            this.vipLabel2.string=v.VIP2;
            this.vipLabel3.string=v.VIP3;
            this.vipLabel4.string=v.VIP4;
            this.vipLabel5.string=v.VIP5;
            this.vipLabel6.string=v.VIP6;
            this.vipLabel7.string=v.VIP7;
            this.vipLabel8.string=v.VIP8;                               
            this.vipLabel9.string=v.VIP9;
        
    },
    showdaoju:function(){
        this.choumaS.active=false;
        this.tequanS.active=false;
        this.daojuS.active=true;
       // this.baibaoxiangS.active=false;
        this.choumaButton.active=true;
        this.tequanButton.active=true;
        this.daojuButton.active=false;
      //  this.baibaoxiangButton.active=true;
        this.chouma.active=false;
        this.tequan.active=false;
        this.daoju.active=true;
       // this.baibaoxiang.active=false;
    },
    // showbaibaoxiang:function(){
    //     this.choumaS.active=false;
    //     this.tequanS.active=false;
    //     this.daojuS.active=false;
    //   //  this.baibaoxiangS.active=true;
    //     this.choumaButton.active=true;
    //     this.tequanButton.active=true;
    //     this.daojuButton.active=true;
    //   //  this.baibaoxiangButton.active=false;
    //     this.chouma.active=false;
    //     this.tequan.active=false;
    //     this.daoju.active=false;
    //   // this.baibaoxiang.active=true;
    // },
    backHome:function(){
          cc.director.loadScene('Home');
    }
});
