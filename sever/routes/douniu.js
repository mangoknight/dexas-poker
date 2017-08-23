var jieguo = require('../model/returnResult');
var config = require('../model/config');
var clisent = require("redis")
var Card = require('../model/card');
redis = clisent.createClient(config.redis.port, config.redis.host, config.redis.opts);
var sqlcmd = require("../model/sqlcmd");
function change() {
  var a = {};
  a.zuosheng = 0;
  a.pingsheng = 0;
  a.yousheng = 0;
  a.dantong = 0;
  a.danlian = 0;
  a.danduizi = 0;
  a.dantonglian = 0;
  a.danduiyi = 0;
  a.shengyidui = 0;
  a.shengerdui = 0;
  a.shengshun = 0;
  a.shenghulu = 0;
  a.shenghuang = 0;
  return JSON.stringify(a);
}


function chulidouniu(zuo, you, roomid, callback) {
  //数组排序 
  var jiaohuan;
  for (let c = 0; c < zuo.length; c++) {//从小到大
    for (let d = c; d < zuo.length; d++) {
      if (zuo[c] > zuo[d]) {
        jiaohuan = zuo[c];
        zuo[c] = zuo[d];
        zuo[d] = jiaohuan;
      }
    }

  }
  var jiaohuan1;
  for (let c = 0; c < you.length; c++) {//排序，从小到大
    for (let d = c; d < you.length; d++) {
      if (you[c] > you[d]) {
        jiaohuan1 = you[c];
        you[c] = you[d];
        you[d] = jiaohuan1;
      }
    }

  }
  redis.hmget('Message', roomid + 'zuo', (e, r) => {
    console.log(zuo+"左的牌为");
    jieguo.onload(zuo, (aa, shuzu) => {
      console.log(aa + 'aa' + shuzu + 'shuzu');
      var ddd = JSON.parse(r);
      ddd.dengji = aa;
      ddd.zuizhongpai = shuzu;
      console.log(ddd.dengji + 'denggji' + ddd.zuizhongpai + 'pai');
      redis.hmset('Message', roomid + 'zuo', JSON.stringify(ddd));
    });
  });
  redis.hmget('Message', roomid + 'you', (e, r) => {
    console.log(you+"you的牌为");
    jieguo.onload(you, (aa, shuzu) => {
      console.log(aa + 'aa' + shuzu + 'shuzu');
      var ddd = JSON.parse(r);
      ddd.dengji = aa;
      ddd.zuizhongpai = shuzu;
      console.log(ddd.dengji + 'denggji' + ddd.zuizhongpai + 'pai');
      redis.hmset('Message', roomid + 'you', JSON.stringify(ddd));
    });
  });
  setTimeout(function jieguo111() {
    jieguo11(roomid, callback);
  }, 25000);
}
function jieguo11(roomid, callback) {//结果比较和手牌判定

  redis.hmget('Message', roomid + 'zuo', (e, r) => {
    redis.hmget('Message', roomid + 'you', (e1, r1) => {
      var zuo = JSON.parse(r);
      var you = JSON.parse(r1);
      console.log('25miao');
      if (zuo.dengji > you.dengji) {
        sheng(roomid, 'zuo', callback);
      }
      else if (zuo.dengji < you.dengji) {
        sheng(roomid, 'you', callback);
      }
      else if (zuo.dengji == you.dengji) {
        if (zuo.zuizhongpai < you.zuizhongpai) {
          sheng(roomid, 'you', callback);
        }
        else if (zuo.zuizhongpai > you.zuizhongpai) {
          sheng(roomid, 'zuo', callback);
        }
        else if (zuo.zuizhongpai == you.zuizhongpai) {
          sheng(roomid, 'ping', callback);
        }
      }


    });
  });
}
function sheng(roomid, jieguo, callback) {
  if (jieguo != 'ping') {
    redis.hmget('Message', roomid + jieguo, (e, r) => {//找到胜利牌型 ，判断
      var d = JSON.parse(r);
      callback(d.dengji, jieguo);
    });
  } else {
    redis.hmget('Message', roomid + 'zuo', (e, r) => {//任意找一个牌型判断就可以
      var d = JSON.parse(r);
      callback(d.dengji, jieguo);
    });
  }
}

function xiazhu(msg) {
  var flag = 0;
  //判断传过来的下注是什么 类型，然后记录 

  redis.hmget('douniumsg', msg.uid, (e, r) => {
    var d = JSON.parse(r);
    if (msg.type == 'zuo') { d.zuosheng = msg.num; flag = 1; }
    else if (msg.type == 'ping') { d.pingsheng = msg.num; flag = 1; }
    else if (msg.type == 'you') { d.yousheng = msg.num; flag = 1; }
    else if (msg.type == 'zuo1') { d.dantong = msg.num; flag = 1; }
    else if (msg.type == 'zuo2') { d.danlian = msg.num; flag = 1; }
    else if (msg.type == 'zuo3') { d.danduizi = msg.num; flag = 1; }
    else if (msg.type == 'zuo4') { d.dantonglian = msg.num; flag = 1; }
    else if (msg.type == 'zuo5') { d.danduiyi = msg.num; flag = 1; }
    else if (msg.type == 'you1') { d.shengyidui = msg.num; flag = 1; }
    else if (msg.type == 'you2') { d.shengerdui = msg.num; flag = 1; }
    else if (msg.type == 'you3') { d.shengshun = msg.num; flag = 1; }
    else if (msg.type == 'you4') { d.shenghulu = msg.num; flag = 1; }
    else if (msg.type == 'you5') { d.shenghuang = msg.num; flag = 1; }
    if (flag == 1) {
      console.log(d);
      redis.hmset('douniumsg', msg.uid, JSON.stringify(d));
    }
  });
}

function GetUser(roomid, callback) {


  var aPairOfCard = [];
  for (let i = 1; i <= 52; i++) {
    aPairOfCard[i] = i;

  }

  redis.hset('card', roomid, JSON.stringify(aPairOfCard));

  redis.hget("roommessage", roomid, function (err, reply) {
    if (reply == null) {

    } else {
      console.log(JSON.parse(reply) + 'roommessage');

      var c = shuzua(reply);
      redis.hmget('money', c, (e, r) => {
        var gg = aaa(c, r, JSON.parse(reply).money);



        console.log('          ddddddddddd数组是是是是是是是' + gg);
        redis.hmget('Z-user', gg, (e, t) => {
          redis.hmget('Message',t,(e10,r10)=>{
            for(let a=0;a<t.length;a++){
              console.log(r10[a]+'xinxixinxixinxixinxixinxi'+t);
            }
          });
          if (t.length > 1) {
            console.log('bbbbbbbb数组是是是是是是是' + t);
            callback('true');//人数够，可以开始游戏
            redis.hset('room', roomid, JSON.stringify(t));
          }
          else {
            redis.hset('room', roomid, JSON.stringify(t));
            callback('false');//人数不够，不能开始游戏
            redis.hset('roomstaus', roomid, 'false');//游戏状态为未开始，等到进来人的时候可以执行那个开始
          }
        });

      });

    }

  });
}

function aaa(c, r, money) {
  var d = [];
  for (let f = 0; f < c.length; f++) {
    console.log(JSON.parse(r[f]).Scoin + 'money' + money);
    if (JSON.parse(r[f]).Scoin >= money) {
      d.push(c[f]);
    }
  }
  return d;

}
function GetUserNiu(roomid, callback) {
  
  var aPairOfCard = [];
  for (let i = 1; i <= 52; i++) {
    aPairOfCard[i] = i;

  }

  redis.hset('card', roomid, JSON.stringify(aPairOfCard));


  redis.hget("roommessage", roomid, function (err, reply) {
    if (reply == null) {

    } else {

      var gg = shuzua(reply);
      if(gg!='null'){
      console.log(JSON.parse(reply) + 'roommessage' + gg);
      redis.hmget('Z-user', gg, (e, t) => {
        
          console.log('bbbbbbbb数组是是是是是是是' + t);
          callback('true');//人数够，可以开始游戏
          redis.hset('room', roomid, JSON.stringify(t));
          });
        }
        else {
          callback('false');//人数不够，不能开始游戏
          redis.hset('roomstaus', roomid, 'false');//游戏状态为未开始，等到进来人的时候可以执行那个开始
         
        }
      
    }
  });
}


function shuzua(reply) {


  var c = JSON.parse(reply);
  var n = 0;
  console.log(c.number1 + "     " + c.number2 + "    " + c.num);
  var a = [];
  if (c.number1 != "") { a[1] = c.number1 }
  if (c.number2 != "") { a[2] = c.number2 }
  if (c.number3 != "") { a[3] = c.number3 }
  if (c.number4 != "") { a[4] = c.number4 }
  if (c.number5 != "") { a[5] = c.number5 }
  if (c.number6 != "") { a[6] = c.number6 }
  if (c.number7 != "") { a[7] = c.number7 }
  if (c.number8 != "") { a[8] = c.number8 }
  var b = [];


  for (let d = 1; d < 9; d++) {
    if (a[d] != null) {
      b.push(a[d]);
    }
  }

  //控制进房用户的钱数，不够的话就不进行下一局的发牌

if(b.length>0){
  return b;}
  else{
    return 'null';
  }
}

function baocunmoney(data, callback) {
  var insert = sqlcmd.Update({ Scoin: data.scoin }, 'user', { Name: data.name });
  sqlcmd.Doit(insert, (a, b) => {
    console.log(a);
    console.log(b);

    if (a == null) {//插入成功
      //   socket.emit('update', { gengxin: 'ture' });
      callback("true");
    }
    else {
      callback("false");
    }
  });
}
module.exports.change = change;
module.exports.chulidouniu = chulidouniu;
module.exports.xiazhu = xiazhu;
module.exports.GetUser = GetUser;
module.exports.GetUserNiu = GetUserNiu;
module.exports.baocunmoney = baocunmoney;