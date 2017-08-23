// var redis = require('redis');
var config=require('../model/config');
var clisent = require("redis")
  , redis = clisent.createClient(config.redis.port,config.redis.host,config.redis.opts);
var schedule = require('node-schedule');
var OnePeople=new Array();
var TowPeople=new Array();
var ThreePeople=new Array();
var FourPeople=new Array();
var FivePeople=new Array();
var SixPeople=new Array();
var SevenPeople=new Array();
var EightPeople=new Array();
//存放所有房间的数组
//var BigRoom=new Array();
var FullRoom=new Array();
var Nfullroom=new Array();
var Room={xiazhu:"",roomType:"",money:"",num:0,roomid:"",number1:"", number2:"", number3:"", number4:"",number5:"",number6:"",number7:"",number8:""}
var selectroommes={roomid:"",type:'',money:'',num:0};
//下注分类的数组
 var xiazhuArray=new Array();
 //银金钻分类的数组
 var CoinArray=new Array();
 //房费分类的数组
 var moneyArray=new Array();
//xiazhu下注模式——有限注，无限注，押注限制
function selectxiazhu(xiazhu,callback){
    // redis.del('GNfullRoom');
    // redis.del('roommessage');
    xiazhuArray.splice(0,xiazhuArray.length);
     redis.hget("GNfullRoom",xiazhu, function (err, reply) {
         console.log(reply);
         console.log(xiazhu);
         reply=JSON.parse(reply);
         console.log(reply);
         if(reply == null||reply==undefined){
            Room.xiazhu=xiazhu;
         }else{
            
             xiazhuArray=reply;
          }
          console.log(xiazhuArray);
          callback(xiazhuArray);
        
     })
     
}
//roomType,房间类型 银 金 钻
function selectCoin(msg,arr,callback){
    console.log(arr);
    CoinArray.splice(0,CoinArray.length);
    // if(arr==null||arr==undefined){
    //     Room.roomType=roomType; 
    // }else{
    if(arr.length<1){
          Room.xiazhu=msg.type;
       Room.roomType=msg.coin;       
    }else{
       for(var i=0;i<arr.length;i++){
          if(arr[i].type==msg.coin){
            CoinArray.push(arr[i]);
          }
        }
        if(CoinArray.length<1){
             Room.xiazhu=msg.type;
       Room.roomType=msg.coin;
         }
    }
    //}
   console.log(CoinArray);
  callback(CoinArray); 
}
//money房费
function selectmoney(msg, arr,callback){
    //清空数组
   moneyArray.splice(0,moneyArray.length);

   if(arr.length<1){
       Room.xiazhu=msg.type;
       Room.roomType=msg.coin;
        Room.money=msg.money;
   }else{
         for(var i=0;i<arr.length;i++){
            if(msg.money==arr[i].money){
            moneyArray.push(arr[i]);
            }
    }
    if(moneyArray.length<1){
         Room.xiazhu=msg.type;
       Room.roomType=msg.coin;
        Room.money=msg.money;
    }
   }
    //}
    console.log(moneyArray);
     callback(moneyArray);
}
//name 玩家昵称 
//回调callback(布尔值，room)
// Room=
// {   xiazhu:"",玩家选择游戏场——游戏场，比赛场
//     roomType:"",房间类型——银金钻
//     money:"",房费
//     num:0,房间人数
//     roomid:"",房间号
//     number1:"",房间成员
//      number2:"", 
//      number3:"", 
//      number4:"", 
//      number5:"",
//      number6:"",
//      number7:"",
//      number8:""}
function selectRoomid(msg,arr, callback){ 
    //清空数组
   SevenPeople.splice(0,SevenPeople.length);
   SixPeople.splice(0,SixPeople.length);
   FivePeople.splice(0,FivePeople.length);
  FourPeople.splice(0,FourPeople.length);
   ThreePeople.splice(0,ThreePeople.length);
  TowPeople.splice(0,TowPeople.length);
   OnePeople.splice(0,OnePeople.length);
   //将符合房费的房间按人数分类

     for(var i=0;i<arr.length;i++){
       switch(arr[i].num){
           case 7: SevenPeople.push(arr[i]);break;
           case 6: SixPeople.push(arr[i]);break;
           case 5: FivePeople.push(arr[i]);break;
           case 4: FourPeople.push(arr[i]);break;
           case 3: ThreePeople.push(arr[i]);break;
           case 2: TowPeople.push(arr[i]);break;
           case 1: OnePeople.push(arr[i]);break;
            default:break;
       }
     }
  // }
     //分房
     var name=msg.name;
     if(SevenPeople.length<1){
           if(SixPeople.length<1){
               if(FivePeople.length<1){
                   if(FourPeople.length<1){
                       if(ThreePeople.length<1){
                           if(TowPeople.length<1){
                               if(OnePeople.length<1){
                                  
                                   Room.num=0;
                                   Room.roomid=roomid();
                                   Room.xiazhu=msg.type;
                                   Room.roomType=msg.coin;
                                   Room.money=msg.money;
                                   Room.number1=msg.name;
                                   Room.num+=1;
                                  
                                   selectroommes.roomid=Room.roomid;
                                   selectroommes.type=Room.roomType;
                                   selectroommes.money=Room.money;
                                   selectroommes.num=Room.num;
                                   
                                   redis.hset("roommessage",Room.roomid,JSON.stringify(Room));
                                   console.log(Room);
                                   redis.hget('GNfullRoom',Room.xiazhu,function (err, reply){
                                           if(reply==undefined||reply==null){
                                               //console.log(selectroommes+"1?");
                                               Nfullroom.push(selectroommes);
                                              // console.log(Nfullroom+"2??");
                                               redis.hset("GNfullRoom",Room.xiazhu,JSON.stringify(Nfullroom));
                                         }else{
                                                reply=JSON.parse(reply);
                                                reply.push(selectroommes);
                                                 console.log(selectroommes);
                                                  console.log(reply);
                                                redis.hset("GNfullRoom",Room.xiazhu,JSON.stringify(reply));
                                         }
                                         callback(setReturnJson(true,Room));
                                   })
                                   
                                    
                               }
                               else{
                                   //查找房间所有信息
                                 redis.hget("roommessage",OnePeople[0].roomid, function (err, reply) {
                                         if(reply==undefined||reply==null){
                                               callback(setReturnJson(false,'出错了'));
                                         }else{
                                             console.log(OnePeople[0].roomid);
                                             console.log(reply);
                                             reply=JSON.parse(reply);
                                         switch(""){
                                             
                                           case reply.number1:reply.number1=name;reply.num+=1;break;
                                           case reply.number2:reply.number2=name;reply.num+=1;break;
                                           case reply.number3:reply.number3=name;reply.num+=1;break;
                                           case reply.number4:reply.number4=name;reply.num+=1;break;
                                           case reply.number5:reply.number5=name;reply.num+=1;break;
                                           case reply.number6:reply.number6=name;reply.num+=1;break;
                                           case reply.number7:reply.number7=name;reply.num+=1;break;
                                           case reply.number8:reply.number8=name;reply.num+=1;break;
                                           default:callback(setReturnJson(false,"进入房间失败，从新进入"));break;
                                          }
                                         redis.hset("roommessage",reply.roomid,JSON.stringify(reply)); 
                                         OnePeople[0].num+=1;
                                         redis.hget("GNfullRoom",reply.xiazhu, function (err, data) {
                                           if(data==undefined||data==null){
                                               callback(setReturnJson(false,'出错了'));
                                            }else{
                                                data=JSON.parse(data);
                                                for(var i=0;i<data.length;i++){
                                                    if(data[i].roomid==OnePeople[0].roomid){
                                                       data.splice(i,1, OnePeople[0]);
                                                    }
                                                    
                                                }
                                                redis.hset("GNfullRoom",reply.xiazhu,JSON.stringify(data));
                                                callback(setReturnJson(true,reply));
                                            }
                                          })
                                                                                      
                                         }
                                          
                                 })

                               } 
                            
                           }
                           else{
                             redis.hget("roommessage",TowPeople[0].roomid, function (err, reply) {
                                         if(reply==undefined||reply==null){
                                               callback(setReturnJson(false,'出错了'));
                                         }else{
                                             reply=JSON.parse(reply);
                                         switch(""){
                                           case reply.number1:reply.number1=name;reply.num+=1;break;
                                           case reply.number2:reply.number2=name;reply.num+=1;break;
                                           case reply.number3:reply.number3=name;reply.num+=1;break;
                                           case reply.number4:reply.number4=name;reply.num+=1;break;
                                           case reply.number5:reply.number5=name;reply.num+=1;break;
                                           case reply.number6:reply.number6=name;reply.num+=1;break;
                                           case reply.number7:reply.number7=name;reply.num+=1;break;
                                           case reply.number8:reply.number8=name;reply.num+=1;break;
                                           default:callback(setReturnJson(false,"进入房间失败，从新进入"));break;
                                          }
                                         redis.hset("roommessage",reply.roomid,JSON.stringify(reply)); 
                                         TowPeople[0].num+=1;
                                         redis.hget("GNfullRoom",reply.xiazhu, function (err, data) {
                                           if(data==undefined||data==null){
                                               callback(setReturnJson(false,'出错了'));
                                            }else{
                                                data=JSON.parse(data);
                                                for(var i=0;i<data.length;i++){
                                                    if(data[i].roomid==TowPeople[0].roomid){
                                                       data.splice(i,1, TowPeople[0]);
                                                    }
                                                    
                                                }
                                                redis.hset("GNfullRoom",reply.xiazhu,JSON.stringify(data));
                                                callback(setReturnJson(true,reply));
                                            }
                                          })
                                                                                      
                                         }
                                          
                            })
                          }
                       }
                       else{
                         redis.hget("roommessage",ThreePeople[0].roomid, function (err, reply) {
                                         if(reply==undefined||reply==null){
                                               callback(setReturnJson(false,'出错了'));
                                         }else{
                                             reply=JSON.parse(reply);
                                         switch(""){
                                           case reply.number1:reply.number1=name;reply.num+=1;break;
                                           case reply.number2:reply.number2=name;reply.num+=1;break;
                                           case reply.number3:reply.number3=name;reply.num+=1;break;
                                           case reply.number4:reply.number4=name;reply.num+=1;break;
                                           case reply.number5:reply.number5=name;reply.num+=1;break;
                                           case reply.number6:reply.number6=name;reply.num+=1;break;
                                           case reply.number7:reply.number7=name;reply.num+=1;break;
                                           case reply.number8:reply.number8=name;reply.num+=1;break;
                                           default:callback(setReturnJson(false,"进入房间失败，从新进入"));break;
                                          }
                                         redis.hset("roommessage",reply.roomid,JSON.stringify(reply)); 
                                         ThreePeople[0].num+=1;
                                         redis.hget("GNfullRoom",reply.xiazhu, function (err, data) {
                                           if(data==undefined||data==null){
                                               callback(setReturnJson(false,'出错了'));
                                            }else{
                                                 data=JSON.parse(data);
                                                for(var i=0;i<data.length;i++){
                                                    if(data[i].roomid==ThreePeople[0].roomid){
                                                       data.splice(i,1, ThreePeople[0]);
                                                    }
                                                    
                                                }
                                                redis.hset("GNfullRoom",reply.xiazhu,JSON.stringify(data));
                                                callback(setReturnJson(true,reply));
                                            }
                                          })
                                                                                      
                                         }
                                          
                            })
                       }
                   }
                  else{
                     redis.hget("roommessage",FourPeople[0].roomid, function (err, reply) {
                                         if(reply==undefined||reply==null){
                                               callback(setReturnJson(false,'出错了'));
                                         }else{
                                             reply=JSON.parse(reply);
                                         switch(""){
                                           case reply.number1:reply.number1=name;reply.num+=1;break;
                                           case reply.number2:reply.number2=name;reply.num+=1;break;
                                           case reply.number3:reply.number3=name;reply.num+=1;break;
                                           case reply.number4:reply.number4=name;reply.num+=1;break;
                                           case reply.number5:reply.number5=name;reply.num+=1;break;
                                           case reply.number6:reply.number6=name;reply.num+=1;break;
                                           case reply.number7:reply.number7=name;reply.num+=1;break;
                                           case reply.number8:reply.number8=name;reply.num+=1;break;
                                           default:callback(setReturnJson(false,"进入房间失败，从新进入"));break;
                                          }
                                         redis.hset("roommessage",reply.roomid,JSON.stringify(reply)); 
                                         FourPeople[0].num+=1;
                                         redis.hget("GNfullRoom",reply.xiazhu, function (err, data) {
                                           if(data==undefined||data==null){
                                               callback(setReturnJson(false,'出错了'));
                                            }else{
                                                 data=JSON.parse(data);
                                                for(var i=0;i<data.length;i++){
                                                    if(data[i].roomid==FourPeople[0].roomid){
                                                       data.splice(i,1, FourPeople[0]);
                                                    }
                                                    
                                                }
                                                redis.hset("GNfullRoom",reply.xiazhu,JSON.stringify(data));
                                                callback(setReturnJson(true,reply));
                                            }
                                          })
                                                                                      
                                         }
                                          
                            })
                  }
               }
               else{
               redis.hget("roommessage",FivePeople[0].roomid, function (err, reply) {
                                         if(reply==undefined||reply==null){
                                               callback(setReturnJson(false,'出错了'));
                                         }else{
                                             reply=JSON.parse(reply);
                                         switch(""){
                                           case reply.number1:reply.number1=name;reply.num+=1;break;
                                           case reply.number2:reply.number2=name;reply.num+=1;break;
                                           case reply.number3:reply.number3=name;reply.num+=1;break;
                                           case reply.number4:reply.number4=name;reply.num+=1;break;
                                           case reply.number5:reply.number5=name;reply.num+=1;break;
                                           case reply.number6:reply.number6=name;reply.num+=1;break;
                                           case reply.number7:reply.number7=name;reply.num+=1;break;
                                           case reply.number8:reply.number8=name;reply.num+=1;break;
                                           default:callback(setReturnJson(false,"进入房间失败，从新进入"));break;
                                          }
                                         redis.hset("roommessage",reply.roomid,JSON.stringify(reply)); 
                                         FivePeople[0].num+=1;
                                         redis.hget("GNfullRoom",reply.xiazhu, function (err, data) {
                                           if(data==undefined||data==null){
                                               callback(setReturnJson(false,'出错了'));
                                            }else{
                                                 data=JSON.parse(data);
                                                for(var i=0;i<data.length;i++){
                                                    if(data[i].roomid==FivePeople[0].roomid){
                                                       data.splice(i,1, FivePeople[0]);
                                                    }
                                                    
                                                }
                                                redis.hset("GNfullRoom",reply.xiazhu,JSON.stringify(data));
                                                callback(setReturnJson(true,reply));
                                            }
                                          })
                                                                                      
                                         }
                                          
                            })
              }
            
           }
           else{
            redis.hget("roommessage",SixPeople[0].roomid, function (err, reply) {
                                         if(reply==undefined||reply==null){
                                               callback(setReturnJson(false,'出错了'));
                                         }else{
                                             reply=JSON.parse(reply);
                                         switch(""){
                                           case reply.number1:reply.number1=name;reply.num+=1;break;
                                           case reply.number2:reply.number2=name;reply.num+=1;break;
                                           case reply.number3:reply.number3=name;reply.num+=1;break;
                                           case reply.number4:reply.number4=name;reply.num+=1;break;
                                           case reply.number5:reply.number5=name;reply.num+=1;break;
                                           case reply.number6:reply.number6=name;reply.num+=1;break;
                                           case reply.number7:reply.number7=name;reply.num+=1;break;
                                           case reply.number8:reply.number8=name;reply.num+=1;break;
                                           default:callback(setReturnJson(false,"进入房间失败，从新进入"));break;
                                          }
                                         redis.hset("roommessage",reply.roomid,JSON.stringify(reply)); 
                                         SixPeople[0].num+=1;
                                         redis.hget("GNfullRoom",reply.xiazhu, function (err, data) {
                                           if(data==undefined||data==null){
                                               callback(setReturnJson(false,'出错了'));
                                            }else{
                                                 data=JSON.parse(data);
                                                for(var i=0;i<data.length;i++){
                                                    if(data[i].roomid==SixPeople[0].roomid){
                                                       data.splice(i,1, SixPeople[0]);
                                                    }          
                                                }
                                                redis.hset("GNfullRoom",reply.xiazhu,JSON.stringify(data));
                                                callback(setReturnJson(true,reply));
                                            }
                                          })
                                                                                      
                                         }
                                          
                            })
          }
              
      }else{
           redis.hget("roommessage",SevenPeople[0].roomid, function (err, reply) {
                                         if(reply==undefined||reply==null){
                                               callback(setReturnJson(false,'出错了'));
                                         }else{
                                             reply=JSON.parse(reply);
                                         switch(""){
                                           case reply.number1:reply.number1=name;reply.num+=1;break;
                                           case reply.number2:reply.number2=name;reply.num+=1;break;
                                           case reply.number3:reply.number3=name;reply.num+=1;break;
                                           case reply.number4:reply.number4=name;reply.num+=1;break;
                                           case reply.number5:reply.number5=name;reply.num+=1;break;
                                           case reply.number6:reply.number6=name;reply.num+=1;break;
                                           case reply.number7:reply.number7=name;reply.num+=1;break;
                                           case reply.number8:reply.number8=name;reply.num+=1;break;
                                           default:callback(setReturnJson(false,"进入房间失败，从新进入"));break;
                                          }
                                         redis.hset("roommessage",reply.roomid,JSON.stringify(reply)); 
                                         SevenPeople[0].num+=1;
                                         redis.hget("GNfullRoom",reply.xiazhu, function (err, data) {
                                           if(data==undefined||data==null){
                                               callback(setReturnJson(false,'出错了'));
                                            }else{
                                                 data=JSON.parse(data);
                                                for(var i=0;i<data.length;i++){
                                                    if(data[i].roomid==SevenPeople[0].roomid){
                                                       data.splice(i, 1);
                                                    }
                                                    
                                                }
                                                redis.hset("GNfullRoom",reply.xiazhu,JSON.stringify(data));
                                                redis.hget("FullRoom",reply.xiazhu, function (err, param) {
                                                  if(param==undefined||param==null){
                                                      FullRoom.push(SevenPeople[0]);
                                                      redis.hset("FullRoom",reply.xiazhu,JSON.stringify(FullRoom));
                                                  }else{
                                                      param= JSON.parse(param);
                                                      param.push(SevenPeople[0]);
                                                      redis.hset("FullRoom",reply.xiazhu,JSON.stringify(param));
                                                  }
                                                  
                                                  callback(setReturnJson(true,reply));
                                                })
                                                
                                            }
                                          })
                                                                                      
                                         }
                                          
                            })
      } 
}
//msg={
//     roomid,房间号
//     name玩家昵称
// // }
//
//传入ID返回房间信息
function roommessage(roomid,callback){
      redis.hget("roommessage", roomid, function (err, reply) {
         if(reply == null){
             callback(setReturnJson(false,'房间号为错误'));
         }else{
             callback(setReturnJson(true,reply));
         }
      }) 
}
//离开房间
function leaveRoom(msg,callback){
    console.log(msg.roomid);  
    var roomid=msg.roomid
  redis.hget("roommessage", roomid, function (err, reply) {
      console.log(reply);
         if(reply == null){
             callback(setReturnJson(false,'房间号为错误'));
             return ;
         }
         reply=JSON.parse(reply);
          switch(msg.name){
               case reply.number1:reply.number1="";reply.num-=1;break;
               case reply.number2:reply.number2="";reply.num-=1;break;
               case reply.number3:reply.number3="";reply.num-=1;break;
               case reply.number4:reply.number4="";reply.num-=1;break;
               case reply.number5:reply.number5="";reply.num-=1;break;
               case reply.number6:reply.number6="";reply.num-=1;break;
               case reply.number7:reply.number7="";reply.num-=1;break;
               case reply.number8:reply.number8="";reply.num-=1;break;
               default : callback(setReturnJson(false,"房间里未找到该玩家")); break;
          }
          if(reply.num==0){
                
                redis.hget('GNfullRoom',msg.xiazhu,function(err,reply1){
                    console.log(msg.xiazhu);
                    console.log(reply1);
                         if(reply1==null||reply1==undefined){
                                callback(setReturnJson(false,'房间查询出错'));
                                return ;
                         }else{
                              reply1=JSON.parse(reply1);
                              for(var i=0;i<reply1.length;i++){
                                  if(reply1[i].roomid==msg.roomid){
                                      reply1.splice(i,1);
                                      redis.hdel("GNfullRoom",msg.xiazhu);
                                      redis.hdel("roommessage",msg.roomid);
                                    callback(setReturnJson(true,msg.name));
                                     return ;
                                  }
                              }
                              callback(setReturnJson(false,'房间查询出错'));
                         }
                     })
               
          }else if(reply.num==7){
               redis.hset("roommessage",msg.roomid,JSON.stringify(reply));
               redis.hget('FullRoom',reply.xiazhu,function(err,reply2){
                   if(reply2==null||reply2==undefined){
                                callback(setReturnJson(false,'房间查询出错'));
                                return ;
                   }else{
                        reply2=JSON.parse(reply2);
                              for(var i=0;i<reply2.length;i++){
                                  if(reply2[i].roomid==msg.roomid){
                                      reply2[i].num-=1;
                                      reply2.splice(i,1,reply2[i]);
                                  
                                     
                                    redis.hset("GNfullRoom",msg.xiazhu,JSON.stringify(reply2));
                                    callback(setReturnJson(true,msg.name));
                                     return ;
                                  }
                              }
                               callback(setReturnJson(false,'房间查询出错'));
                       
                   }
               })

          }else{
              redis.hset("roommessage",msg.roomid,JSON.stringify(reply));
              redis.hget('GNfullRoom',reply.xiazhu,function(err,reply3){
                  console.log(reply3+'qqqqqqqqqqqqqqqqq');
                      if(reply3==null||reply3==undefined){
                                callback(setReturnJson(false,'房间查询出错'));
                                return ;
                   }else{
                        reply3=JSON.parse(reply3);
                        console.log(reply3);
                         console.log(msg.roomid);
                                      console.log(reply3[reply3.length-1].roomid);
                              for(var i=0;i<reply3.length;i++){
                                  if(reply3[i].roomid==msg.roomid){
                                      reply3[i].num-=1;
                                      reply3.splice(i,1,reply3[i]);
                                      redis.hset("GNfullRoom",msg.xiazhu,JSON.stringify(reply3));
                                    callback(setReturnJson(true,msg.name));
                                    return ;
                                  }
                                  
                                   
                              }
                              callback(setReturnJson(false,'房间查询出错'));
                       
                   }
              })
          }
         
          //redis.hincrby(num,msg.roomid,-1);
         
        })  
  
}
//生成房间号
function roomid(){
    function addZero(v) {if (v < 10) return '0' + v; return v.toString()}
    var d = new Date();
    var time = d.getFullYear().toString() + addZero(d.getMonth() + 1) + addZero(d.getDate()) + addZero(d.getHours()) + addZero(d.getMinutes()) + addZero(d.getSeconds());
    return time+Math.floor(Math.random()*10);
}


//每日任务
function charenwu(userid,callback){
     var rule = new schedule.RecurrenceRule();  
    rule.hour = 24;
    var j = schedule.scheduleJob(rule, function(){  
    redis.del("renwu");
    }); 
     redis.hget("renwu", userid, function (err, reply) {
         if(reply==null){
             var renwu={time:0,five:0,ten:0,tow:0}   
             redis.hset('renwu',userid,JSON.stringify(renwu));
             callback({status:false,msg:'没有执行任务'});
         }
         else{
            callback({status:true,msg:JSON.parse(reply)});
         }
     })
}
function renwu(msg,callback){
   var renwu={time:msg.time,five:msg.five,ten:msg.ten,tow:msg.tow} 
   
    // var timeout_ms=24*60*60*1000;
    // var timeout = setTimeout(function() {
    //          redis.del("renwu");
    // }, timeout_ms);
   redis.hset('renwu',msg.userid,JSON.stringify(renwu));
   redis.hget("renwu", msg.userid, function (err, reply) {
         if(reply==null){
             callback({status:false,msg:'没有执行任务'});
         }
         else{
            callback({status:true,msg:JSON.parse(reply)});
         }
     })
}




function  setReturnJson(status, msg){ 
        if(typeof status !== 'boolean' && typeof status !== 'number'){
            status = false;
        }
        // if(typeof msg !== 'string'){
        //     msg = '';
        // }
        return {
            'status': status,
              'msg': msg
        };
    }

module.exports.selectxiazhu=selectxiazhu;
module.exports.selectCoin=selectCoin;
module.exports.selectmoney=selectmoney;
module.exports.selectRoomid=selectRoomid;
module.exports.leaveRoom=leaveRoom;
module.exports.roommessage=roommessage;
module.exports.charenwu=charenwu;
module.exports.renwu=renwu;