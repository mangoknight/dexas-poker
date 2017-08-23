
var express = require('express');
var router = express.Router();
var mysql=require("mysql");
var sqlcmd=require("../model/sqlcmd");
var time=require('date-utils');
var Checkphone=require("../model/Mobile");
var Encryption=require("../model/addmima");

// function register(data, callback) {
//   function addZero(v) {
//     if (v < 10) return '0' + v; return v.toString()
//   }
//   var d = new Date();
//   var time = d.getFullYear().toString() + addZero(d.getMonth() + 1) + addZero(d.getDate()) + addZero(d.getHours()) + addZero(d.getMinutes()) + addZero(d.getSeconds());

//   var jiancha = Checkphone.checkMobile(data.username);
//   if (time - data.gratetime < 120) {//判断登录是否超时
//     if (jiancha.status) {//判断手机号格式

//       var password = Encryption.jiami(data.userpwd);//加密
      
//     }
//     else {
//       callback(false, { name: '手机号格式不正确' });//返回到客户端手机号格式不正确
//     }
//     var yzm=Encryption.jiami(data.yanzheng);
//       if(yzm==data.md5yzm)
//       {
//        var redom = Math.round(Math.random() * 100);
//        var id = data.gratetime + addZero(redom);

//        //插入数据
//        console.log(data.gratetime + addZero(redom));
//        var insert = sqlcmd.Insert({ User_Id: id, Phone: data.username, Password: password, CreateDate: data.gratetime }, 'register');
//        sqlcmd.Doit(insert, (a, b) => {
//        if (a == null) {//插入成功
//         //socket.emit('update', { gengxin: 'ture' });
//          var insertuser=sqlcmd.Insert({User_Id:id,Scoin:0,Gcoin:0,yuanbao:0,Diamond:0},'user');
//          sqlcmd.Doit(insertuser, (a, b) => {
//           if(a===null){
//               var insertuser=sqlcmd.Insert({User_Id:id,SCoin:0,GCoin:0,yuanbao:0,Diamond:0},'box');
//               sqlcmd.Doit(insertuser, (a, b) => {
//               if(a==null){
//                   var insertuser=sqlcmd.Insert({User_Id:id,SCoin:0,GCoin:0,yuanbao:0,Diamond:0},'coin');
//                   sqlcmd.Doit(insertuser, (a, b) => {
//                   callback(true,id:id);
//                   });
//               }
//              else{
//               callback(false, { name: "cuowu" });
//                }
//             });
//           }
//           else{
//            callback(false, { name: "cuowu" });
//           }
//          });
        
//        }
//       });
//       }
//       else{
//         callback(false,{name:"验证码输入不正确"});
//       }
//  }
//   else {
//     callback(false, { name: "连接超时" });
//   }
//  console.log(data);
// }


function addmessage(data,callback){
            var select=new sqlcmd.Select('user',['Name']).Where({Name:data.name}).query;
             sqlcmd.Doit(select,(a,b)=>{
             console.log(a);
             console.log(b);
             if(a!=null){
                  callback(false,{name:"用户名重复"});
             }
       });
            var insert = sqlcmd.Update({ Name: data.name, Image: data.image, Power: 1 }, 'user',{ User_Id: data.id});
             sqlcmd.Doit(insert,(a,b)=>{
                console.log(a);
                console.log(b);

                if(a==null){//插入成功
             //   socket.emit('update', { gengxin: 'ture' });
                callback(true,{name:"信息创建成功"});
                }
                else{
                    callback(false,{name:"信息创建失败"});
                }
              });
}

// module.exports.register=register;
module.exports.addmessage=addmessage;