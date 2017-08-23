var express = require('express');
var router = express.Router();
var mysql=require("mysql");
var sqlcmd=require("../model/sqlcmd");
var time=require('date-utils');
var Checkphone=require("../model/Mobile");
var Encryption=require("../model/addmima");
var box=require('../routes/box');
var send = require('../model/Send');
var schedule = require('node-schedule');
var flag=false;
//登录
// function Check(msg,callback){
//      var Account=msg.Account;
//      var Password=msg.Pwd;
//      var Time=msg.time;
//     //获取当前时间14位字符串
//     function addZero(v){if(v<10)return '0'+v;return v.toString()};
//     var d = new Date();
//     var time = d.getFullYear().toString() + addZero(d.getMonth() + 1) + addZero(d.getDate()) + addZero(d.getHours()) + addZero(d.getMinutes()) + addZero(d.getSeconds());
//     console.log(time);
//      //验证手机号格式
//      var data1= Checkphone.checkMobile(Account);
//      console.log(data1.status);
     
//      if(data1.status!=true){
//        callback(false,data1.msg);
//      }
//      if(Password===null||Password===null){
//       callback(false,'密码为空！');
//      }
//      Password=Encryption.jiami(Password);
//      if(Time-time>120||Time-time<0) {
//       callback(false,'时间错误');
//      }
//        var str=new sqlcmd.Select('register',["Password","User_Id"]).Where({Phone:Account}).query;
//  try{
//     sqlcmd.Doit(str,(a,b)=>{
//         console.log(a);
//         console.log(b);
//         if(a===null&&b.length!==0){
//             var pass=b[0].Password;
//             var id=b[0].User_Id;
//             console.log(id);
//             if(pass===Password)
//             {
//               var str1=new sqlcmd.Select('user').Where({User_Id:id}).query;
//               sqlcmd.Doit(str1,(a,b)=>{
//               callback(true,b);
//               });
//             }
//             else
//             {
//              callback(false,'密码错误');
//             }
//         }
//         else{
//             callback(false,'请注册');
//         }
      
       
//      })
//     }
//     catch(e){
//           callback(false,'连接数据库失败'); 
//     }
    
// }
function selectAll(name,callback){
 var select=new sqlcmd.Select('user').Where({Name:name}).query;
             sqlcmd.Doit(select,(a,b)=>{
                 if(a==null&&b.length!==0){
                     var userid=b[0].User_Id;
                     var data={
                         userid:b[0].User_Id,
                         name:b[0].Name,
                         Scoin:b[0].Scoin,
                         Gcoin:b[0].Gcoin,
                         Power:b[0].Power,
                         yuanbao:b[0].yuanbao,
                         Diamond:b[0].Diamond,
                         Drink:b[0].Drink,
                         lv:b[0].lv,
                         Exp:b[0].Exp,
                         QImage:b[0].QImage,
                         Image:b[0].Image
                         };
                     if(userid==null||userid==''){
                         callback(setReturnJson(false,'未找到该用户'));   
                     }else{
                         callback(setReturnJson(true,data));
                     }
                     
                 }
                 else{
                     callback(setReturnJson(false,'未找到该用户'));           
                 }

             })

}


//查找所有好友
//msg={
//     myuserid 玩家ID
//    
// }
// 获取query里值得方法query[0].b.[0].Name
function SelectFriend(msg,callback){
    var query=new Array();
    var str=new sqlcmd.Select('friend',["YourUserId"]).Where({MyUserId:msg.myuserid}).query;
    sqlcmd.Doit(str,(a,b)=>{
        console.log(a);
        console.log(b);
        for(var i=0;i<b.length;i++){
            var str=new sqlcmd.Select('user').Where({User_Id:b[i].YourUserId}).query;
             sqlcmd.Doit(str,(a,b)=>{
             console.log(a);
             console.log(b);
             query.push(b);
             })
        }
     })
     callback(true,query);
}

function SelectOneFriend(msg,callback){
   var str=new sqlcmd.Select('friend',["id"]).Where({MyUserId:msg.myuserid,YourUserId:msg.youruserid}).query;
     sqlcmd.Doit(str,(a,b)=>{
         if(b.length>0){
            var backmsg =setReturnJson(false,"你俩已经是好友了");
            callback(backmsg);
         }
         else{
              var str=new sqlcmd.Select('friend',["id"]).Where({MyUserId:msg.youruserid,YourUserId:msg.myuserid}).query;
              sqlcmd.Doit(str,(a,b)=>{
                  if(b.length>0){
                    var backmsg =setReturnJson(false,"你俩已经是好友了");
                    callback(backmsg);
                   }else{
                          var backmsg =setReturnJson(true,{m:msg.myuserid,y:msg.youruserid});
                          callback(backmsg);
                   }
              })
              
         }
     })
}

   
//加好友
// msg={
//     myuserid,玩家ID
//     youruserid，请求好友的ID
//     
// }
//回调
function AddFriend(msg,callback){
      var insert = sqlcmd.Insert({ MyUserId: msg.myuserid, YourUserId : msg.youruserid ,Time:send.coverDate()}, 'friend');
      sqlcmd.Doit(insert, (a, b) => {
          if(a==null){
          var backmsg =setReturnJson(true,"添加成功");
          callback(backmsg);
          }else{   
         callback( setReturnJson(false,"添加失败"));
          }
      })
}
//  var param={
//          userid:msg.userid,
//          type:msg.type,
//          num:msg.price
//        }
//保存抽奖结果
//回调{status:布尔值,data:''}
function savemoney(param,callback){
   switch(param.type){
        case "银币":box.Out_yinbi(param,(msg)=>{callback(msg)});break;
        case "金币":box.Out_jinbi(param,(msg)=>{callback(msg)}); break;
        case "钻石":box.Out_zs(param,(msg)=>{callback(msg)});break;
        case "元宝":box.Out_yb(param,(msg)=>{callback(msg)});break;
        case "VIP" :VIP(param,(msg)=>{callback(msg)});break;
        default:callback({status:false,data:'类型参数错误'});break;
    }
   } 
//转盘修改VIP 
function VIP(param,callback){
  var select=new sqlcmd.Select('user',['Power']).Where({User_Id:param.userid}).query;
             sqlcmd.Doit(select,(a,b)=>{
                 if(a==null&&b.length!==0){
                 if(b[0].Power===9){callback(setReturnJson(false,'已经是最高VIP了'))}
                   param.num+=b[0].Power;
                 var insert = sqlcmd.Update({ Power:param.num,}, 'user',{ User_Id: param.userid});
                  sqlcmd.Doit(insert,(a,b)=>{
                  if(a==null){
                  var msg={
                     status:true,
                     data:'存入数据库成功'
                    }
                    callback(msg);
                }
                else{
                     var msg={
                     status:false,
                     data:'存入数据库失败'
                    }
                    callback(msg);
                }
                   })
                }else{
                     callback({status:false,data:'查询失败'})
                 }
             })
           
}
//一天一次抽奖
function timetoday(userid){
    var rule = new schedule.RecurrenceRule();  
    rule.hour = [0,24];
    var j = schedule.scheduleJob(rule, function(){  
    var x= { flag:true};
         redis.hset('zhuanpan',userid,JSON.stringify(x));
    });
     redis.hget("Rate", userid, function (err, reply) {
    if(reply==null){
          var x= { flag:false};
          redis.hset('zhuanpan',userid,JSON.stringify(x));
          callback(setReturnJson(true,'免费抽奖'));
    }else if(JSON.parse(reply).flag==true){
         var x= { flag:false};
         redis.hset('zhuanpan',userid,JSON.stringify(x));
         callback(setReturnJson(true,'免费抽奖'));
    }else{
        callback(setReturnJson(false,'免费机会用完了'));
    }
});
}
 function  setReturnJson(status, msg){ 
        if(typeof status !== 'boolean' && typeof status !== 'number'){
            status = false;
        }
        if(typeof msg !== 'string'){
            msg = '';
        }
        return {
            'status': status,
              'msg': msg
        };
    }
//module.exports.Check=Check;
module.exports.SelectFriend=SelectFriend;
module.exports.SelectOneFriend=SelectOneFriend;
module.exports.AddFriend=AddFriend;
module.exports.savemoney=savemoney;
module.exports.timetoday=timetoday;
module.exports.VIP=VIP;
module.exports.setReturnJson=setReturnJson;