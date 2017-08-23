var m;
var socket;
cc.Class({
    extends: cc.Component,

    properties: {
        scrollView: cc.ScrollView,
        friendItem: cc.Prefab,
        friendWindow:cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        if(cc.ss.soket){
         socket=cc.ss.soket;
            }
        cc.log(socket);
        this.content = this.scrollView.content;
        // this.friendList();
         m=JSON.parse(cc.sys.localStorage.getItem("UserMessage"));
            var param={userid:m.Userid,name:m.name,power:m.Power};
        socket.emit('System',param);
        socket.emit('selectfriend',param); 
        socket.on('Allfriend'+m.name,(msg)=>{
              msg=JSON.parse(msg);
               console.log("1111111111111111111111111111111111111111");
                 console.log(msg);
               
                  //msg.msg数组 为好友信息 
                 // this.displayfriend(msg.msg);
                 console.log("22222222");
                 console.log(msg);
                  for (var i = 0; i <msg.length ; ++i) {
                    var playerInfo = players[i];
                    var item = cc.instantiate(this.friendItem);
                    item.getComponent('friendItem').init(name);
                     this.content.addChild(item);
                 }
              
          });
    },

    friendList: function() {
        // for (var i = 0; i < ; ++i) {
        //     var playerInfo = players[i];
        //     var item = cc.instantiate(this.friendItem);
        //     item.getComponent('friendItem').init(name);
        //     this.content.addChild(item);
        // }
         
    },
    open:function(){
        this.friendWindow.active=true;
        
    },
    close:function(){
        this.friendWindow.active=false;
    },
    // called every frame
    update: function (dt) {

    },
});