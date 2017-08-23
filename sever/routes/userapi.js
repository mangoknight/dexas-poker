var express = require('express');
var router = express.Router();
var sqlcmd = require('../model/sqlcmd');
var crypto = require('crypto');
var user = require('../model/Send');
var checkPhone = require('../model/Mobile');
var redis = require('redis');
var config = require('../model/config');

var reclient = redis.createClient(config.redis.port, config.redis.host, config.redis.opts);
router.get('/', function (req, res, next) {
  res.send('{"status":"success"}');
});

router.get('/test', function (req, res, next) {
  var id = req.query.id;
  var name = req.query.name;
  var password = req.query.password;
  var str = sqlcmd.Insert({ id: id, name: name, password: password }, "user");
  sqlcmd.Doit(str, () => {

  });
  console.log(id);
  console.log(name);
  console.log(password);
  res.send('{"status":"success"}');
});
///绑定qq
router.get('/qqBlind', function (req, res) {
  console.log(new user.returnmsg(0).msg("登录失效，请重新登陆").query);
  var auserid = req.query.myuserid;
  var userid = user.resUserid(auserid);
  var openid = req.query.openid;
  reclient.hget("user", userid[0], function (err, reply) {
    if (reply != auserid) {
      res.send(new user.returnmsg(0).msg("登录失效，请重新登陆").query);
      return;
    };
    var sqlstr = sqlcmd.Update({ Qq: openid }, 'regist', { Userid: userid[0] });
    sqlcmd.Doit(sqlstr, function (qerr, vals, field) {
      res.send(new user.returnmsg(0).msg("操作成功").query);
    });
  });
});
///qq登录
router.get('/qqLogin', function (req, res) {
  var openid = req.query.openid;
  var name = req.query.name;
  var sex = req.query.sex;
  var portrait = req.query.portrait;
  console.log(openid);
  console.log(name);
  var sqlstr = new sqlcmd.Select('register', ['count(*) as count', 'Userid']).Where({ Qq: openid }).query;
  sqlcmd.Doit(sqlstr, function (qerr, vals, field) {
    if (vals[0].count == 0) {
      sqlstr = sqlcmd.Insert({ Qq: openid, Registtime: user.coverDate() }, 'regist');
      console.log(sqlstr);
      sqlcmd.Doit(sqlstr, function (qerr, vals, field) {
        console.log(vals);
        sqlstr = sqlcmd.Update({ Name: name, Portrait: portrait, Sex: sex }, 'user', { Userid: vals.insertId });
        var userid = vals.insertId;
        var auserid = user.getUserid(vals.insertId);
        sqlcmd.Doit(sqlstr, function (qerr, vals, field) {
          reclient.hset('user', userid, auserid, redis.print);
          res.send(new user.returnmsg(0).msg(null, auserid, portrait, name, sex).query);
        });
      });
    } else {
      var sqlstr = new sqlcmd.Select('user').Where({ Userid: vals[0].Userid }).query;
      sqlcmd.Doit(sqlstr, (qerr, vals, field) => {
        var userid = vals[0].Userid;
        var auserid = user.getUserid(userid);
        reclient.hset('user', userid, auserid, redis.print);
        res.send(new user.returnmsg(0).msg(null, auserid, vals[0].Portrait, vals[0].Name, vals[0].Sex).query);
      })
    };
  });
});
///微信登录
router.get('/weLogin', function (req, res) {
  var openid = req.query.openid;
  var name = req.query.name;
  var sex = req.query.sex;
  console.log(sex);
  if (sex == 0) {
    sex = "女";
  } else {
    sex = "男";
  }
  console.log(sex);
  var portrait = req.query.portrait;
  console.log(openid);
  console.log(name);
  var sqlstr = new sqlcmd.Select('register', ['count(*) as count', 'User_Id']).Where({ Wexin: openid }).query;
  sqlcmd.Doit(sqlstr, function (qerr, vals, field) {
    if (vals[0].count == 0) {
      sqlstr = sqlcmd.Insert({ Wexin: openid, Registtime: user.coverDate() }, 'regist');
      console.log(sqlstr);
      sqlcmd.Doit(sqlstr, function (qerr, vals, field) {
        console.log(vals);
        sqlstr = sqlcmd.Update({ Name: name, Portrait: portrait, Sex: sex }, 'user', { Userid: vals.insertId });
        var userid = vals.insertId;
        var auserid = user.getUserid(vals.insertId);
        sqlcmd.Doit(sqlstr, function (qerr, vals, field) {
          reclient.hset('user', userid, auserid, redis.print);
          res.send(new user.returnmsg(0).msg(null, auserid, portrait, name, sex).query);
        });
      });
    } else {
      var sqlstr = new sqlcmd.Select('user').Where({ Userid: vals[0].Userid }).query;
      sqlcmd.Doit(sqlstr, (qerr, vals, field) => {
        var userid = vals[0].Userid;
        var auserid = user.getUserid(userid);
        reclient.hset('user', userid, auserid, redis.print);
        res.send(new user.returnmsg(0).msg(null, auserid, vals[0].Portrait, vals[0].Name, vals[0].Sex).query);
      })
    };
  });
});
///注册接口
router.get('/regist', function (req, res) {
  // reclient.hdel("userphone",redis.print);
  // reclient.hdel("user",redis.print);
  var phone = req.query.phone;
  var yzm = req.query.yzm;
  var passwd = req.query.passwd;
  var tuijian=req.query.tuijian;
  var returnmsg = { status: 0, msg: { id: 0, desc: "" } };
  //先判断验证码
  var cp=checkPhone.checkMobile(phone);
  if (phone == null || yzm == null || passwd == null || phone == "" || yzm == "" || passwd == "" || cp.status != true) {
    returnmsg.status = 1;
    returnmsg.msg.desc = "上传参数错误";
    res.send(JSON.stringify(returnmsg));
    return;
  };
  reclient.hget("phone", phone, function (err, reply) {
    //先判断该手机号是不是获取过验证码
    if (reply == null || reply == "null") {
      returnmsg.status = 1;
      returnmsg.msg.desc = "请先获取验证码";
      res.send(JSON.stringify(returnmsg));
    } else {//查看验证码是否过期
      reply = reply.split("/");
      var everdate = (new Date().getTime() - Number(reply[1])) / 1000;
      if (everdate < 600) {
        if (reply[0] == yzm) {
          console.log(phone);
          reclient.hget("userphone", phone, function (err, reply) {
            console.log(reply);
            if (reply != null) {
              returnmsg.status = 1;
              returnmsg.msg.desc = "该手机号用户已经注册，请勿重新注册";
              res.send(JSON.stringify(returnmsg));
              return;
            };
            var sha1 = crypto.createHash('sha1');
            sha1.update(passwd);
            passwd = sha1.digest('hex');
            //userid
            function addZero(v) {if (v < 10) return '0' + v; return v.toString()}
            var d = new Date();
            var time = d.getFullYear().toString() + addZero(d.getMonth() + 1) + addZero(d.getDate()) + addZero(d.getHours()) + addZero(d.getMinutes()) + addZero(d.getSeconds());
            var redom = Math.round(Math.random() * 100);
            var uid = time + addZero(redom);
            var sqlstr = sqlcmd.Insert({User_Id:uid, Password: passwd, Phone: phone,CreateDate:user.coverDate() }, "register");
            console.log(sqlstr);
            sqlcmd.Doit(sqlstr, function (qerr, vals, fields) {
              console.log(vals);
              console.log(uid);
             
           
              // var userid=vals.insertId;
              var userid=uid
              var auserid = user.getUserid(uid);
              reclient.hset("userphone", phone, uid, redis.print);
              reclient.hset("user", uid, auserid, redis.print);
              returnmsg.msg.id = auserid;
              var sqlstr=sqlcmd.Insert({User_Id:uid,Tuijianid:tuijian,Tdate:user.coverDate()},'tuijian');
              sqlcmd.Doit(sqlstr,function(qerr,vals,field){
              res.send(JSON.stringify(returnmsg));
              });
            });
          });
        }
        else {
          returnmsg.status = 1;
          returnmsg.msg.desc = "验证码错误，请重新输入";
          res.send(JSON.stringify(returnmsg));
        }
      }
      else {
        returnmsg.status = 1;
        returnmsg.msg.desc = "验证码过期，请重新获取";
        reclient.hset("phone", phone, null, redis.print);
        res.send(JSON.stringify(returnmsg));
      }
    }
  });
});
//忘记密码
router.get('/forgetpas',function (req,res){
  var phone = req.query.phone;
  var yzm = req.query.yzm;
  var passwd = req.query.passwd;
 // var tuijian=req.query.tuijian;
  var returnmsg = { status: 0, msg: { id: 0, desc: "" } };
  //先判断验证码
  var cp=checkPhone.checkMobile(phone);
  if (phone == null || yzm == null || passwd == null || phone == "" || yzm == "" || passwd == "" || cp.status != true) {
    returnmsg.status = 1;
    returnmsg.msg.desc = "上传参数错误";
    res.send(JSON.stringify(returnmsg));
    return;
  };
  reclient.hget("phone", phone, function (err, reply) {
    //先判断该手机号是不是获取过验证码
    if (reply == null || reply == "null") {
      returnmsg.status = 1;
      returnmsg.msg.desc = "请先获取验证码";
      res.send(JSON.stringify(returnmsg));
    } else {//查看验证码是否过期
      reply = reply.split("/");
      var everdate = (new Date().getTime() - Number(reply[1])) / 1000;
      if (everdate < 600) {
        if (reply[0] == yzm) {
            var sha1 = crypto.createHash('sha1');
            sha1.update(passwd);
            passwd = sha1.digest('hex');
            var sqlstr=sqlcmd.Update({Password:passwd,PasswordChangeDate:user.coverDate()},'register',{ Phone: phone });
            console.log(sqlstr);
            sqlcmd.Doit(sqlstr,function(qerr,vals,field){
                   if(qerr==null){
                     returnmsg.status=0;
                     returnmsg.msg.desc='修改成功';
                      res.send(JSON.stringify(returnmsg));
                   }else{
                     returnmsg.status=1;
                     returnmsg.msg.desc='修改失败';
                      res.send(JSON.stringify(returnmsg));
                   }
            })
        }
        else{
          returnmsg.status = 1;
          returnmsg.msg.desc = "验证码错误，请重新输入";
          res.send(JSON.stringify(returnmsg));
        }
      }
      else{
         returnmsg.status = 1;
        returnmsg.msg.desc = "验证码过期，请重新获取";
        //reclient.hset("phone", phone, null, redis.print);
        res.send(JSON.stringify(returnmsg));
      }
    }
  })
})
//添加信息
router.get('/addMessage',function(req,res){
    var Name=req.query.name;
    console.log(Name);
    var Sex=req.query.sex;
     var UserId=user.resUserid(req.query.id);
   
    var returnmsg = { status: 0, msg: '' };
     var sqlstr = new sqlcmd.Select('user').Where({ Name:Name }).query;
     console.log(sqlstr);
     sqlcmd.Doit(sqlstr, function (qerr, vals, filed) {
      if (vals.length !== 0) {
      returnmsg.status = 1;
      returnmsg.msg.desc = "该昵称已被用";
      res.send(JSON.stringify(returnmsg));
    }else{
     try{
     
    var sqlstr=sqlcmd.Update({Name:Name,Sex:Sex},'user',{ User_Id: UserId[0] });
    console.log(sqlstr);
              sqlcmd.Doit(sqlstr,function(qerr,vals,field){
                 console.log(vals);
                 if(vals==undefined){
                   returnmsg.status=1;
                   returnmsg.msg='插入信息错误！';   
                  res.send(JSON.stringify(returnmsg));
                  return ;
                 }
                         returnmsg.status=0;
                         returnmsg.msg='插入信息成功！';   
                         res.send(JSON.stringify(returnmsg)); 
              
              });
    }catch(e){
        returnmsg.status=1;
        returnmsg.msg='插入信息失败！';   
        res.send(JSON.stringify(returnmsg));
    }
    }
     })
  
    
  
});
//发送手机验证码
router.get('/phone', function (req, res) {
  console.log(req);
  console.log(req.query);
  var phone = req.query.phone;
  console.log(phone);
  reclient.hget("phone", phone, function (err, reply) {
    var value = user.GetRandomNum();
    console.log(value);
    var returnmsg = { status: 200, msg: "发送成功，2分钟内有效" };
    //判断是否发送过
    if (reply == null || reply == "null") {
      user.phone(phone, value);
      reclient.hset("phone", phone, value + "/" + new Date().getTime(), redis.print);
      res.send(JSON.stringify(returnmsg));
    }
    else {
      var str = reply;
      str = str.split("/");
      var everdate = (new Date().getTime() - Number(str[1])) / 1000;
      //如果大于60s之前发送的
      if (everdate > 60) {
        user.phone(phone, value);
        reclient.hset("phone", phone, value + "/" + new Date().getTime(), redis.print);
        // returnmsg = { status: 200, msg: "发送成功，2分钟内有效" };
        res.send(JSON.stringify(returnmsg));
      }
      else {
        //如果小于60s发送的
        returnmsg = { status: 1, msg: "刚刚已经发送过了，请60s之后再发送" };
        res.send(JSON.stringify(returnmsg));
      };
    };
  });
});
///登录接口
router.get('/login', function (req, res) {
  var phone = req.query.phone;
  var passwd = req.query.passwd;
 var returnmsg = { status: 0, msg: { Userid: 0, desc: "", name: "", sex: "", portrait: "",lv:0,exp:0,scoin:0,gcoin:0,yb:0,zs:0,power:0,drink:"" } };
  //先判断验证码
  var cp=checkPhone.checkMobile(phone);
  if (phone == null || passwd == null || phone == "" || passwd == "" || /*(/^0?1[0-9][0-9]\d{8}$/.test(phone))*/ cp.status!= true) {
    returnmsg.status = 2;
    returnmsg.msg.desc = "上传参数错误";
    res.send(JSON.stringify(returnmsg));
    return;
  };
  var sha1 = crypto.createHash('sha1');
  sha1.update(passwd);
  passwd = sha1.digest('hex');
  var sqlstr = new sqlcmd.Select('register').Where({ Phone: phone, Password: passwd }).query;
  console.log(sqlstr);
  sqlcmd.Doit(sqlstr, function (qerr, vals, filed) {
    console.log(vals);
    if (vals.length == 0) {
      returnmsg.status = 1;
      returnmsg.msg.desc = "用户名和密码不匹配";
      res.send(JSON.stringify(returnmsg));
    }
    else {
      console.log(vals[0].User_Id);
      var sqlstr = new sqlcmd.Select('user').Where({ User_Id:vals[0].User_Id }).query;
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
        res.send(JSON.stringify(returnmsg));
      });
    }
  });
});
///测试
router.get('/isPhone', function (req, res) {
  var phone = req.query.phone;
  if ((/^0?1[0-9][0-9]\d{8}$/.test(phone)) != true) {
    res.send('{"status":"2"}');
    return;
  };
  reclient.hget('userphone', phone, function (err, reply) {
    if (reply != null) {
      res.send('{"status":"1"}');
    } else {
      res.send('{"status":"0"}');
    }
  });
});

module.exports = router;