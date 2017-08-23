var express = require('express');
var router = express.Router();
var mysql=require("mysql");
var sqlcmd=require("../model/sqlcmd");
var time=require('date-utils');
var Encryption=require("../model/addmima");
var send = require('../model/Send');
 
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
//不同VIP充值VIP的价钱不同
function returnVIPMoney(id,callback){
    try{
       var select=new sqlcmd.Select('power').query;
             sqlcmd.Doit(select,(a,b)=>{
                 if(a==null){
                    var VIP1=b[1].Money;
                    var VIP2=b[2].Money;
                    var VIP3=b[3].Money;
                    var VIP4=b[4].Money;
                    var VIP5=b[5].Money;
                    var VIP6=b[6].Money;
                    var VIP7=b[7].Money;
                    var VIP8=b[8].Money;
                    var VIP9=b[9].Money;
                   var select=new sqlcmd.Select('power').Where({id:id}).query;
                      sqlcmd.Doit(select,(a,b)=>{
                              var money=b[0].Money;
                              var data={
                                  VIP1:(VIP1-money<0)?0:VIP1-money,
                                   VIP2:(VIP2-money<0)?0:VIP2-money,
                                    VIP3:(VIP3-money<0)?0:VIP3-money,
                                     VIP4:(VIP4-money<0)?0:VIP4-money,
                                      VIP5:(VIP5-money<0)?0:VIP5-money,
                                       VIP6:(VIP6-money<0)?0:VIP6-money,
                                        VIP7:(VIP7-money<0)?0:VIP7-money,
                                         VIP8:(VIP8-money<0)?0:VIP8-money,
                                          VIP9:(VIP9-money<0)?0:VIP9-money,
                              }
                              callback({status:true,msg:data});
                      })
                 }else{
                     
                 }
             })
    }catch(e){
        callback({status:false,msg:'sql语句错误'});
    }
}
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
//添加饮料
function addDrink(param,callback){
    var insert = sqlcmd.Update({DrinkTime:send.coverDate(), Drink:param.drink,}, 'user',{ User_Id:param.userid});
    try{
    sqlcmd.Doit(insert,(a,b)=>{
           if(a===null){
               callback(setReturnJson(true,'保存成功'));
           }else{
               callback(setReturnJson(false,'保存失败'));
           }
     })
    }catch(e){
        callback(setReturnJson(false,'sql语句错误！'));
    }
}
function genxin(userid,callback){
    var returnmsg = { status: 0, msg: { Userid: 0, desc: "", name: "", Sex: "", portrait: "",lv:0,Exp:0,Scoin:0,Gcoin:0,yuanbao:0,Diamond:0,Power:0,Drink:"" } };
   try{
   var sqlstr = new sqlcmd.Select('user').Where({ User_Id:userid }).query;
      sqlcmd.Doit(sqlstr, function (qerr, vals, filed) {
        console.log(vals);
        returnmsg.msg.Userid = vals[0].User_Id;
        returnmsg.msg.name = vals[0].Name;
        returnmsg.msg.Image = vals[0].Image;
        returnmsg.msg.sex = vals[0].Sex;
        returnmsg.msg.lv = vals[0].lv;
        returnmsg.msg.Exp = vals[0].Exp;
        returnmsg.msg.Scoin = vals[0].Scoin;
        returnmsg.msg.Gcoin = vals[0].Gcoin;
        returnmsg.msg.yuanbao = vals[0].yuanbao;
        returnmsg.msg.Diamond = vals[0].Diamond;
        returnmsg.msg.Power = vals[0].Power;
        returnmsg.msg.Drink = vals[0].Drink;
        callback(JSON.stringify(returnmsg));
      });
   }catch(e){
       returnmsg.status=1;
       returnmsg.msg.desc='sql语句错误';
         callback(JSON.stringify(returnmsg))
   }
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


module.exports.recharge=recharge;
module.exports.VIP=VIP;
module.exports.returnVIPMoney=returnVIPMoney;
module.exports.addDrink=addDrink;
module.exports.genxin=genxin;