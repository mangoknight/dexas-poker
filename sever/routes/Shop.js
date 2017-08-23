var express = require('express');
var router = express.Router();
var mysql=require("mysql");
var sqlcmd=require("../model/sqlcmd");
var time=require('date-utils');
var Encryption=require("../model/addmima");
var LoginCheck=require('./routes/login');
var Box=require('./routes/box');
//充值 银金钻元宝
// param={
//     userid 用户ID
//     type   类型，金钻元宝
//     num    人民币（存时要转换为虚拟钱币）
// }
function  recharge(param,callback){
    switch(param.type){
        case '银币': 
          var data={userid:param.userid,num:param.num*100};
          Box.box_yinbi(data,(msg)=>{
          callback(msg);
          });
         break;
        case '金币':
         var data={userid:param.userid,num:param.num};
          Box.box_jinbi(data,(msg)=>{
          callback(msg);
          });
         break;
        case '钻石':
         var data={userid:param.userid,num:param.num*0.01};
          Box.box_zs(data,(msg)=>{
          callback(msg);
          });
         break;
        case '元宝':
          var data={userid:param.userid,num:param.num*0.1};
          Box.box_yb(data,(msg)=>{
          callback(msg);
          });
          break;
        default:msg={status:false,msg:"类型错误"};callback();break;
    }

}
// param={
//     userid  用户ID
//     power     VIP等级
//     type     VIP
// }
//充值VIP
function VIP(param,callback){
     var insert = sqlcmd.Update({ Power:param.power,}, 'user',{ User_Id:param.userid});
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
     
}