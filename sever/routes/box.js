var express = require('express');
var router = express.Router();
var mysql=require("mysql");
var sqlcmd=require("../model/sqlcmd");
var time=require('date-utils');
var Encryption=require("../model/addmima");
var schedule = require('node-schedule');
var send = require('../model/Send');

//box_ 代表百宝箱
//Out_代表用户界面的
//查找百宝箱里所有的银币，金币，钻石，元宝
// 
//     userid
// 
function box_selectAllCoin(userid,callback){
     var str=new sqlcmd.Select('box',['SCoin,GCoin,Diamond,yuanbao']).Where({User_Id:userid}).query;
     sqlcmd.Doit(str,(a,b)=>{
         if(a===null&&b.length!==0){
             var msg={
                 userid:userid,
                Scoin:b[0].SCoin,
                Gcoin:b[0].GCoin,
                Diamond:b[0].Diamond,
                yb:b[0].yuanbao
             };
             
            var backmsg =setReturnJson(true,msg);
            callback(backmsg);
         }
         else{
              var backmsg =setReturnJson(false,"查询错误");
              callback(backmsg);
         }
     })
}

// param{
//     from  兑换物    from兑换to
//     to   兑换目标
//     num  兑换数量
//     userid  用户ID
// }
//
//1银币=1分钱
//1元宝=10块钱
//1金币=1块钱
//1钻石=100块
// 百宝箱里银金钻互换
function box_exchange(param,callback){
 if(param.from=="银币"){
   switch(param.to){
       case "金币": 
           var fromCoin={userid:param.userid,num:-param.num};
           box_yinbi(fromCoin,(msg)=>{ 
           if(msg.status===true)
           {   
               var toCoin={userid:param.userid,num:param.num*0.01};
               box_jinbi(toCoin,(data)=>{
                   callback(data);
               })
           }
           else
           {
                 callback(msg);
           }
          });
          break;
       case "钻石":
        var fromCoin={userid:param.userid,num:-param.num};
           box_yinbi(fromCoin,(msg)=>{ 
           if(msg.status===true)
           {   
               var toCoin={userid:param.userid,num:param.num*0.0001};
               box_zs(toCoin,(data)=>{
                   callback(data);
               })
           }
           else
           {
                 callback(msg);
           }
          });
          break;
       case "元宝": 
        var fromCoin={userid:param.userid,num:-param.num};
           box_yinbi(fromCoin,(msg)=>{ 
           if(msg.status===true)
           {   
               var toCoin={userid:param.userid,num:param.num*0.001};
               box_jinbi(toCoin,(data)=>{
                   callback(data);
               })
           }
           else
           {
                 callback(msg);
           }
          });
       break;
    }
 }else if(param.from=="金币"){
       switch(param.to){
       case "银币": 
        var fromCoin={userid:param.userid,num:-param.num};
           box_jinbi(fromCoin,(msg)=>{ 
           if(msg.status===true)
           {   
               var toCoin={userid:param.userid,num:param.num*100};
               box_yinbi(toCoin,(data)=>{
                   callback(data);
               })
           }
           else
           {
                 callback(msg);
           }
          });
        break;
       case "钻石": 
        var fromCoin={userid:param.userid,num:-param.num};
           box_jinbi(fromCoin,(msg)=>{ 
           if(msg.status===true)
           {   
               var toCoin={userid:param.userid,num:param.num*0.01};
               box_zs(toCoin,(data)=>{
                   callback(data);
               })
           }
           else
           {
                 callback(msg);
           }
          });
        break;
       case "元宝":
        var fromCoin={userid:param.userid,num:-param.num};
           box_jinbi(fromCoin,(msg)=>{ 
           if(msg.status===true)
           {   
               var toCoin={userid:param.userid,num:param.num*0.1};
               box_yb(toCoin,(data)=>{
                   callback(data);
               })
           }
           else
           {
                 callback(msg);
           }
          });
       break;
   } 
 }else if(param.from=="钻石"){
       switch(param.to){
       case "银币": 
        var fromCoin={userid:param.userid,num:-param.num};
           box_zs(fromCoin,(msg)=>{ 
           if(msg.status===true)
           {   
               var toCoin={userid:param.userid,num:param.num*10000};
               box_yinbi(toCoin,(data)=>{
                   callback(data);
               })
           }
           else
           {
                 callback(msg);
           }
          });
        break;
       case "金币": 
        var fromCoin={userid:param.userid,num:-param.num};
           box_zs(fromCoin,(msg)=>{ 
           if(msg.status===true)
           {   
               var toCoin={userid:param.userid,num:param.num*100};
              box_jinbi(toCoin,(data)=>{
                   callback(data);
               })
           }
           else
           {
                 callback(msg);
           }
          });
        break;
       case "元宝": 
        var fromCoin={userid:param.userid,num:-param.num};
           box_zs(fromCoin,(msg)=>{ 
           if(msg.status===true)
           {   
               var toCoin={userid:param.userid,num:param.num*10};
                box_yb(toCoin,(data)=>{
                   callback(data);
               })
           }
           else
           {
                 callback(msg);
           }
          });
        break;
   } 
 }else if(param.from=="元宝"){
       switch(param.to){
        case "银币": 
         var fromCoin={userid:param.userid,num:-param.num};
             box_yb(fromCoin,(msg)=>{ 
           if(msg.status===true)
           {   
               var toCoin={userid:param.userid,num:param.num*1000};
               box_yinbi(toCoin,(data)=>{
                   callback(data);
               })
           }
           else
           {
                 callback(msg);
           }
          });
         break;
       case "钻石": 
         var fromCoin={userid:param.userid,num:-param.num};
           box_yb(fromCoin,(msg)=>{ 
           if(msg.status===true)
           {   
               var toCoin={userid:param.userid,num:param.num*0.1};
               box_zs(toCoin,(data)=>{
                   callback(data);
               })
           }
           else
           {
                 callback(msg);
           }
          });
         break;
       case "金币": 
        var fromCoin={userid:param.userid,num:-param.num};
           box_yb(fromCoin,(msg)=>{ 
           if(msg.status===true)
           {   
               var toCoin={userid:param.userid,num:param.num*10};
               box_jinbi(toCoin,(data)=>{
                   callback(data);
               })
           }
           else
           {
                 callback(msg);
           }
          });
         break;
   } 
 }
}
// param{
//    userid
//    num
// }
function box_yinbi(param,callback){
    console.log(param);
  var str=new sqlcmd.Select('box',["SCoin"]).Where({User_Id:param.userid}).query;
  sqlcmd.Doit(str,(a,b)=>{
                 if(a==null&&b.length!==0){
                 param.num+=b[0].SCoin;
                 if(param.num<0){
                        var msg={
                     status:false,
                     data:'余额不足'
                    };
                     callback(msg);
                 }
                 var insert = sqlcmd.Update({ SCoin: param.num,}, 'box',{ User_Id: param.userid});
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
function box_jinbi(param,callback){
     var str=new sqlcmd.Select('box',["GCoin"]).Where({User_Id:param.userid}).query;
     sqlcmd.Doit(str,(a,b)=>{
                 if(a==null&&b.length!==0){
                 param.num+=b[0].GCoin;
                  if(param.num<0){
                       var msg={
                     status:false,
                     data:'余额不足'
                    };
                     callback(msg);
                 }
                 var insert = sqlcmd.Update({ GCoin: param.num,}, 'box',{User_Id:param.userid});
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

function box_zs(param,callback){
     var str=new sqlcmd.Select('box',["Diamond"]).Where({User_Id:param.userid}).query;
       sqlcmd.Doit(str,(a,b)=>{
                 if(a==null&&b.length!==0){
                 param.num+=b[0].Diamond;
                  if(param.num<0){
                        var msg={
                     status:false,
                     data:'余额不足'
                    };
                     callback(msg);
                 }
                 var insert = sqlcmd.Update({ Diamond: param.num,}, 'box',{ User_Id:param.userid});
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

function box_yb(param,callback){
     var str=new sqlcmd.Select('box',["yuanbao"]).Where({User_Id:param.userid}).query;
     sqlcmd.Doit(str,(a,b)=>{
                 if(a==null&&b.length!==0){
                 param.num+=b[0].yuanbao;
                  if(param.num<0){
                        var msg={
                     status:false,
                     data:'余额不足'
                    };
                     callback(msg);
                 }
                 var insert = sqlcmd.Update({ yuanbao: param.num,}, 'box',{ User_Id:param.userid});
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

function Out_yinbi(param,callback){
 var select=new sqlcmd.Select('user',['Scoin']).Where({User_Id:param.userid}).query;
             sqlcmd.Doit(select,(a,b)=>{
                 if(a==null&&b.length!==0){
                 param.num+=b[0].Scoin;
                  if(param.num<0){
                      var msg={
                     status:false,
                     data:'余额不足'
                    };
                     callback(msg);
                 }
                 var insert = sqlcmd.Update({ Scoin: param.num,}, 'user',{ User_Id:param.userid});
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

function Out_jinbi(param,callback){
 var select=new sqlcmd.Select('user',['Gcoin']).Where({User_Id:param.userid}).query;
             sqlcmd.Doit(select,(a,b)=>{
                 if(a==null&&b.length!==0){
                 param.num+=b[0].Gcoin;
                  if(param.num<0){
                       var msg={
                     status:false,
                     data:'余额不足'
                    };
                     callback(msg);
                 }
                 var insert = sqlcmd.Update({ Gcoin: param.num,}, 'user',{ User_Id:param.userid});
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

function Out_zs(param,callback){
  var select=new sqlcmd.Select('user',['Diamond']).Where({User_Id:param.userid}).query;
             sqlcmd.Doit(select,(a,b)=>{
                 if(a==null&&b.length!==0){
                 param.num+=b[0].Diamond;
                  if(param.num<0){
                        var msg={
                     status:false,
                     data:'余额不足'
                    };
                     callback(msg);
                 }
                 var insert = sqlcmd.Update({ Diamond: param.num,}, 'user',{ User_Id:param.userid});
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

function Out_yb(param,callback){
 var select=new sqlcmd.Select('user',['yuanbao']).Where({User_Id:param.userid}).query;
             sqlcmd.Doit(select,(a,b)=>{
                 if(a==null&&b.length!==0){
                 param.num+=b[0].yuanbao;
                  if(param.num<0){
                        var msg={
                     status:false,
                     data:'余额不足'
                    };
                     callback(msg);
                 }
                 var insert = sqlcmd.Update({ yuanbao: param.num,}, 'user',{ User_Id: param.userid});
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

//百宝箱和用户界面互相提现筹码
// param={
//     userid 用户ID
//     type   提现筹码类型
//     num    金额
//     to     1或-1  -1代表百宝箱提现用户界面 1代表用户界面提现百宝箱
// }
//
function boxexchangeOut(param,callback){
    console.log(param);
    switch(param.type){
      case '银币':
        var fromCoin={userid:param.userid,num:param.num*param.to};
           box_yinbi(fromCoin,(msg)=>{ 
           if(msg.status===true)
           {   
               var toCoin={userid:param.userid,num:param.num*(-param.to)};
               Out_yinbi(toCoin,(data)=>{
                   if(data.status==true){
                       var xxx={fromid:param.userid,type:param.to,num:param.num,coin:param.type}
                   savejilu(xxx,(yyy)=>{
                     callback(yyy);
                   })
                   }else{
                       callback(data);
                   }
               })
           }
           else
           {
                 callback(msg);
           }
          });
       break;
      case '金币':
        var fromCoin={userid:param.userid,num:param.num*param.to};
           box_jinbi(fromCoin,(msg)=>{ 
           if(msg.status===true)
           {   
               var toCoin={userid:param.userid,num:param.num*(-param.to)};
               Out_jinbi(toCoin,(data)=>{
                   if(data.status==true){
                    var xxx={fromid:param.userid,type:param.to,num:param.num,coin:param.type}
                   savejilu(xxx,(yyy)=>{
                     callback(yyy);
                   })
                   }else{
                       callback(data);
                   }
               })
           }
           else
           {
                 callback(msg);
           }
          });
       break;
      case '钻石':
        var fromCoin={userid:param.userid,num:param.num*param.to};
           box_zs(fromCoin,(msg)=>{ 
           if(msg.status===true)
           {   
               var toCoin={userid:param.userid,num:param.num*(-param.to)};
               Out_zs(toCoin,(data)=>{
                    if(data.status==true){
                    var xxx={fromid:param.userid,type:param.to,num:param.num,coin:param.type}
                   savejilu(xxx,(yyy)=>{
                     callback(yyy);
                   })
                   }else{
                       callback(data);
                   }
               })
           }
           else
           {
                 callback(msg);
           }
          });
       break;
      case '元宝':
        var fromCoin={userid:param.userid,num:param.num*param.to};
           box_yb(fromCoin,(msg)=>{ 
           if(msg.status===true)
           {   
               var toCoin={userid:param.userid,num:param.num*(-param.to)};
               Out_yb(toCoin,(data)=>{
                   if(data.status==true){
                   var xxx={fromid:param.userid,type:param.to,num:param.num,coin:param.type}
                   savejilu(xxx,(yyy)=>{
                     callback(yyy);
                   })
                   }else{
                       callback(data);
                   }
               })
           }
           else
           {
                 callback(msg);
           }
          });
       break;
    }
  
}

//向他人转账  只能在百宝箱里操作 
// param={
//     from  转账人
//     type  类型  银金钻元宝
//     num   金额
//     to    转账目标
// }调用此接口前先判断该用户是否为VIP
function toOther(param,callback){
   switch(param.type){
       case '银币':
          var fromCoin={userid:param.from,num:-param.num}; 
          box_yinbi(fromCoin,(msg)=>{
              var toCoin={userid:param.to,num:parseInt(param.num)};
              console.log(toCoin);
              if(msg.status===true){
               box_yinbi(toCoin,(data)=>{
                   if(data.status==true){
                   var xxx={fromid:param.from,type:2,num:param.num,coin:param.type,toid:param.to}
                   savejilu(xxx,(yyy)=>{
                     callback(yyy);
                   })
                   }else{
                       callback(data);
                   }
               });
               }else{
                  callback(msg);
               }
            })
          
          
         break;
       case '金币':
          var fromCoin={userid:param.from,num:-param.num}; 
          box_jinbi(fromCoin,(msg)=>{
              var toCoin={userid:param.to,num:parseInt(param.num)};
              if(msg.status===true){
               box_jinbi(toCoin,(data)=>{
                 if(data.status==true){
                   var xxx={fromid:param.from,type:2,num:param.num,coin:param.type,toid:param.to}
                   savejilu(xxx,(yyy)=>{
                     callback(yyy);
                   })
                   }else{
                       callback(data);
                   }
               });
               }else{
                  callback(msg);
               }
            })
        break;
       case '钻石':
          var fromCoin={userid:param.from,num:-param.num}; 
          box_zs(fromCoin,(msg)=>{
              var toCoin={userid:param.to,num:parseInt(param.num)};
              if(msg.status===true){
               box_zs(toCoin,(data)=>{
                 if(data.status==true){
                   var xxx={fromid:param.from,type:2,num:param.num,coin:param.type,toid:param.to}
                   savejilu(xxx,(yyy)=>{
                     callback(yyy);
                   })
                   }else{
                       callback(data);
                   }
               });
               }else{
                  callback(msg);
               }
            })
          
          
        break;
       case '元宝':
          var fromCoin={userid:param.from,num:-param.num}; 
          box_yb(fromCoin,(msg)=>{
              var toCoin={userid:param.to,num:parseInt(param.num)};
              if(msg.status===true){
               box_yb(toCoin,(data)=>{
                 if(data.status==true){
                   var xxx={fromid:param.from,type:2,num:param.num,coin:param.type,toid:param.to}
                   savejilu(xxx,(yyy)=>{
                     callback(yyy);
                   })
                   }else{
                       callback(data);
                   }
               });
               }else{
                  callback(msg);
               }
            })
          
          
        break;
   }
}

//检查是否为VIP
function isVIP(userid,callback){ 
     var select=new sqlcmd.Select('user',['Power']).Where({User_Id:userid}).query;
             sqlcmd.Doit(select,(a,b)=>{
                 if(a==null){
                     console.log(b);
                     console.log(b[0].Power);
                    if(b[0].Power==1){
                        callback(setReturnJson(false,'您不是会员'));
                    }
                    else{
                        callback(setReturnJson(true,b[0].Power));
                    }
                 }else{
                     callback(setReturnJson(false,'sql语句错误！'));
                 }
             })
}
//根据名字查ID
function selectid(name,callback){
     var select=new sqlcmd.Select('user',['User_Id']).Where({Name:name}).query;
             sqlcmd.Doit(select,(a,b)=>{
                 if(a==null&&b.length!==0){
                     var userid=b[0].User_Id;
                     if(userid==null||userid==''){
                         callback(setReturnJson(false,'未找到该用户'));   
                     }else{
                         callback(setReturnJson(true,userid));
                     }
                     
                 }
                 else{
                     callback(setReturnJson(false,'未找到该用户'));           
                 }

             })
}
//检查box表里的密码是否为空
//200 未设密码 300设置了密码 400查询错误 
function passIsNull(param,callback){
  try{  
  var select=new sqlcmd.Select('box',['Password']).Where({User_Id:param.userid}).query;
             sqlcmd.Doit(select,(a,b)=>{
                 console.log(a);
                 if(a===null&&b.length!==0){
                     console.log(b);
                     var c=b[0].Password;
                      if(c===null){
                          callback({status:200,msg:'未设置密码'});
                      }
                      else{
                          callback({status:300,msg:'已设置密码'});
                      }
                 }else{
                        callback({status:400,msg:'sql语句错误！'});
                 }
                 
             })
  }catch(e){
      callback({status:400,msg:'sql语句执行失败！'});
  }
}
//保存box里的密码 
function savePass(param,callback){
    var pass=Encryption.jiami(param.password);
   var insert = sqlcmd.Update({ Password:pass }, 'box',{ User_Id:param.userid});
             sqlcmd.Doit(insert,(a,b)=>{
            if(a==null&&b.length!==0){
                callback(setReturnJson(true,'保存成功'));
            }else{
                callback(setReturnJson(false,'保存失败'));
            }
    })
}

//检查密码与输入密码相匹配param={userid,password}
function PassIsRight(param,callback){
  var select=new sqlcmd.Select('box',['Password']).Where({User_Id:param.userid}).query;
             sqlcmd.Doit(select,(a,b)=>{
                 if(a==null){
                     if(b[0].Password==Encryption.jiami(param.password))
                     {
                         callback(setReturnJson(true,'验证成功'));
                     }
                     else
                     {
                         callback(setReturnJson(false,'密码错误'));
                     }
                 }else{
                     callback(setReturnJson(false,'sql语句错误！'));
                 }
             })
}
//查找昨天百宝箱里的筹码
function selectlastCoin(userid,callback){
  var total=0;
  var select=new sqlcmd.Select('coin',['SCoin,GCoin,Diamond,yuanbao']).Where({User_Id:userid}).query;
             sqlcmd.Doit(select,(a,b)=>{
                 if(a==null&&b.length!==0){  
                     console.log(b);
                 var msg={
                   Scoin:b[0].SCoin,
                   Gcoin:b[0].GCoin,
                   Diamond:b[0].Diamond,
                   yb:b[0].yuanbao
                 }
                 callback(setReturnJson(true,msg));
                }
                else{
                     callback(setReturnJson(true,'查询错误'));
                }
             })
}
//返回生成利息的本金 userid
function totalRate(userid,callback){
       box_selectAllCoin(userid,(msg)=>{
           if(msg.status==true){
                selectlastCoin(userid,(data)=>{
                    console.log(msg.msg.Gcoin);
                     console.log(data.msg.Gcoin);
                     if(data.status==true){
                      var Scoin=(msg.msg.Scoin<data.msg.Scoin)?msg.msg.Scoin:data.msg.Scoin;
                      var Gcoin=(msg.msg.Gcoin<data.msg.Gcoin)?msg.msg.Gcoin:data.msg.Gcoin;
                      var Diamond=(msg.msg.Diamond<data.msg.Diamond)?msg.msg.Diamond:data.msg.Diamond;
                      var yb=(msg.msg.yb<data.msg.yb)?msg.msg.yb:data.msg.yb;
                      var w=Gcoin+Diamond*100+yb*10;
                      console.log(w);
                      callback({status:true,msg:w});
                     }else{
                         callback(data)
                     }
                })
           }else{
               callback(msg);
           }
       })
}
//计算不同VIP利率的钱（金币数）userid
function Rate(userid,callback){
    var total=0;
    totalRate(userid,(msg)=>{
        if(msg.status==true){
            var select=new sqlcmd.Select('user',['Power']).Where({User_Id:userid}).query;
             sqlcmd.Doit(select,(a,b)=>{
                 if(a==null&&b.length!==0){
                     console.log(msg);
                      console.log('xx'+msg.msg);
                     switch(b[0].Power){
                        
                         case 1:total=msg.msg*0.03;break;
                         case 2:total=msg.msg*0.05;break;
                         case 3:total=msg.msg*0.07;break;
                         case 4:total=msg.msg*0.09;break;
                         case 5:total=msg.msg*0.11;break;
                         case 6:total=msg.msg*0.13;break;  
                         case 7:total=msg.msg*0.15;break;
                         case 8:total=msg.msg*0.17;break;
                         case 9:total=msg.msg*0.19;break;
                         default:total=0;break;
                     }
                     //保存利息
                     console.log(total);
                     var x={userid:userid,num:parseInt(total)};
                     console.log(x.num);
                     box_jinbi(x,(data)=>{
                          if(data==true){
                             callback({status:true,msg:parseInt(total)});
                          }else{
                               callback(data);
                          }
                     })
                    
                 }
                 else{
                     callback({status:false,msg:'查询错误！'});
                 }
             })
        }
        else{
            callback(msg);
        }
    })
     
}
function OneDayRate(userid,callback){
    var rule = new schedule.RecurrenceRule();  
    rule.hour = [0,24];
    var j = schedule.scheduleJob(rule, function(){  
         var x= { fg:true};
         redis.hset('Rate',userid,JSON.stringify(x));
    });
    redis.hget("Rate", userid, function (err, reply) {
    if(reply==null){
       var x= { fg:false};
         redis.hset('Rate',userid,JSON.stringify(x));
        Rate(userid,(msg)=>{
            callback(msg);
        })
    }else if(JSON.parse(reply).fg==true){
          var x= { fg:false};
          redis.hset('Rate',userid,JSON.stringify(x));
          Rate(userid,(msg)=>{
            callback(msg);
          })
         
    }else{
      callback(setReturnJson(false,'一天执行一次'));
    }
    })
}
//转账记录
function savejilu(data,callback){
    if(data.type==2){
    var insertuser=sqlcmd.Insert({fromid:data.fromid,type:data.type,num:data.num,coin:data.coin,Time:send.coverDate(),toid:data.toid},'transfer');
             sqlcmd.Doit(insertuser, (a, b) => {
             if(a==null){
                 callback(setReturnJson(true,'交易成功'));
             }else{
                 callback(setReturnJson(false,'交易失败'));
             }
             })
    }else{
     var insertuser=sqlcmd.Insert({fromid:data.fromid,type:data.type,num:data.num,coin:data.coin,Time:send.coverDate()},'transfer');
             sqlcmd.Doit(insertuser, (a, b) => {
             if(a==null){
                 callback(setReturnJson(true,'交易成功'));
             }else{
                 callback(setReturnJson(false,'交易失败'));
             }
             })
    }
    
}
function save_order(data,callback){

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

module.exports.box_yinbi=box_yinbi;
module.exports.box_jinbi=box_jinbi;
module.exports.box_zs=box_zs;
module.exports.box_yb=box_yb;
module.exports.Out_yinbi=Out_yinbi;
module.exports.Out_jinbi=Out_jinbi;
module.exports.Out_zs=Out_zs;
module.exports.Out_yb=Out_yb;
module.exports.PassIsRight=PassIsRight; 
module.exports.passIsNull=passIsNull;
module.exports.savePass=savePass;
module.exports.OneDayRate=OneDayRate;
module.exports.box_selectAllCoin=box_selectAllCoin;
module.exports.boxexchangeOut=boxexchangeOut;
module.exports.toOther=toOther;
module.exports.isVIP=isVIP;
module.exports.selectid=selectid;
module.exports.box_exchange=box_exchange;