var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Checkphone = require("./model/Mobile");
var time = require('date-utils');
var LoginCheck = require('./routes/login');
var caozuo = require('./routes/regist');
var index = require('./routes/index');
var users = require('./routes/users');
var test = require('./routes/test');
var userapi = require('./routes/userapi');
var room = require('./routes/SLFF');
var ss = require('./routes/chongzhi');
var box = require('./routes/box');

var savemsg = require('./routes/savemsg');
var queue = require('./routes/queue');
var mysql = require('mysql');
var send = require('./model/send');
var sqlcmd = require('./model/sqlcmd');


//张宁
var config = require('./model/config');
var Card = require('./model/card');
var cards = require('./model/card');
var jieguo = require('./model/returnResult');
var exp = require('./routes/exp');
var user = require('./routes/jsonChange');
var douniu = require('./routes/douniu');


var clisent = require("redis")
  , redis = clisent.createClient(config.redis.port, config.redis.host, config.redis.opts);

var app = express();
var http = require('http').Server(app).listen(7777);
var io = require("socket.io")(http);

io.on('connection', function (socket) {
  console.log('a user connected');
  //这是socket.io 即时通讯
  socket.on('qingkong', (data) => {
    redis.del('GNfullRoom');
  });
  //任务
  socket.on('renwu', function (msg) {
    if (msg.type == 1) {
      room.charenwu(msg.userid, (param) => {
        console.log(param);
        io.emit(msg.name + 'renwu', param);
      })
    } else {
      room.renwu(msg, (param) => {
        io.emit(msg.name + 'renwu', param);
      })
    }
  })

  //聊天
  //msg={fromid,toname,msg,fromname}
  socket.on('chat', function (msg) {
    box.selectid(msg.toname, (param) => {
      if (param.status == true) {
        var canshu = {
          fromid: msg.fromid,
          toid: param.msg,
          msg: msg.msg
        };
        savemsg.save_msg(canshu, (data1) => {
          if (data1.status == true) {
            savemsg.select_Status(param.msg, (data2) => {
              if (data2.status == true) {
                if (data2.msg == 0) {
                  io.emit(toname + 'chat', msg.msg);
                  io.emit(fromname + 'chat', msg.msg);
                  savemsg.Update_isread(data1.id, () => {
                  })
                }
              }
            })

          }
        })
      }
    })
  })
  //公共世界
  socket.on('AllChat', function (msg) {
    //  redis.rpush('123','nihao');
    //  console.log('123');
    if (msg.type == 1) {
      var mes = msg.name + ':' + msg.msg;
      // var x=queue.chatQueue(mes);
      redis.llen('Roomchat', (err, reply) => {
        console.log(reply);
        if (reply == null) {
          redis.rpush('Roomchat', mes);
          //console.log(x);
        } else {
          console.log(JSON.parse(reply));
          if (JSON.parse(reply) < 5) {
            redis.rpush('Roomchat', mes);
            console.log(mes);
          } else {
            redis.lpop('Roomchat');
            redis.rpush('Roomchat', mes)
          }
        }
      })

    } else {
      redis.lrange('Roomchat', 0, -1, (err, reply) => {
        var title1 = reply[0];
        var title2 = reply[1];
        var title3 = reply[3];
        var title4 = reply[4];
        var title5 = reply[5];
        var data = { data1: title1, data2: title2, data3: title3, data4: title4, data5: title5 };
        io.emit('AllChat', data);
        console.log(title1);
        console.log(title5);
        console.log(data);
        // console.log('fanhui:'+JSON.parse(reply));
      })
    }
  })
  //房间聊天
  //msg={from,roomid,Msg}
  socket.on('Roomchat', function (msg) {
    console.log(msg);
    var roomid = msg.id;//房间号ID
    msg = { from: msg.from, msg: msg.Msg };
    console.log('message: ' + msg);
    //  var ReturnQueue=queue.chatQueue(msg);
    //  redis.hset("Room_chat",roomid,JSON.stringify(ReturnQueue));
    io.emit(roomid + 'chat', msg);

  })
  //加入房间param={name-用户名,money-房费,coin-筹码类型银金钻,type-下注类型}
  socket.on('joinroom', (param) => {
    console.log('xiazhu:' + param.type)
    room.selectxiazhu(param.type, (data) => {
      room.selectCoin(param, data, (data1) => {
        room.selectmoney(param, data1, (data2) => {
          room.selectRoomid(param, data2, (msg) => {
            console.log(msg);
            io.emit('joinroom' + param.name, msg);
          });

        });

      });
    });


  });

  socket.on('douniu', (msg) => {
    room.selectxiazhu(msg.type, (data) => {
      room.selectRoomid(msg, data, (param) => {
        io.emit('douniu' + msg.name, param);
      });
    })
  })

  //一天一抽userid
  socket.on('day', (msg) => {
    LoginCheck.timetoday(msg, (param) => {
      console.log(param);
      io.emit(msg + "choujiang", param);
    });

  })
  socket.on('ReduceGcoin', (msg) => {
    var param = {
      name: msg.name,
      userid: msg.userid,
      type: msg.type,
      num: msg.price
    }
    box.Out_zs(param, (x) => {
      console.log(x);
      io.emit(msg.name + "jinbi", x);
    });

  })
  //抽奖充钱减钱
  socket.on('AddWithReduce', (msg) => {

    if (msg.type == "" || msg.type == null) {
      io.emit(msg.name, msg.data)
    } else {
      var param = {
        userid: msg.userid,
        name: msg.name,
        type: msg.type,
        num: msg.price
      }
      LoginCheck.savemoney(param, (msg) => {
        if (msg.status == true) {
          console.log(msg.data);
          io.emit(param.name, "200");
        } else {
          console.log(msg.data);
          io.emit(param.name, "300");
        }
      });
    }

  })

  //加好友
  socket.on('addfriend', (msg) => {
    //type==1代表请求加好友
    //type==2代表同意好友请求
    if (msg.type == 1) {
      box.selectid(msg.Y_name, (param) => {
        if (param.status == true) {
          var xxx = { myuserid: msg.myuserid, youruserid: param.msg };
          LoginCheck.SelectOneFriend(xxx, (data) => {
            if (data.status == false) {
              io.emit(msg.M_name + 'req', data);
              console.log(data.msg);
            }
            else {
              var canshu = {
                fromid: msg.myuserid,
                toid: param.msg,
                msg: msg.M_name + "请求加你为好友"
              };
              savemsg.save_msg(canshu, (data1) => {
                if (data1.status == true) {
                  savemsg.select_Status(param.msg, (data2) => {
                    if (data2.status == true) {
                      if (data2.msg == 0) {
                        var a = msg.M_name + "请求加你为好友";
                        io.emit(msg.Y_name + 'req', { status: true, reqname: msg.M_name, resname: msg.Y_name, msg: a, reqid: msg.myuserid, resid: param.msg, id: data1.msg })
                        console.log('qingqiu');
                      }
                    }
                  })

                } else {
                  io.emit(msg.M_name + 'req', data);
                }
              })

            }
          })
        }
        else {
          io.emit(msg.M_name + 'req', param);
        }
      })
    }
    else if (msg.type == 2) {
      savemsg.Update_isread(msg.id, (mess) => {
        if (mess.status == true) {
          var canshu = {
            fromid: msg.youruserid,
            toid: msg.myuserid,
            msg: msg.Y_name + "同意了您的请求"
          };
          LoginCheck.AddFriend(msg, (data) => {
            savemsg.save_msg(canshu, (data1) => {
              if (data1.status == true) {
                savemsg.Update_isread(data1.msg, (aaa) => {
                  io.emit(msg.M_name + 'res', data);
                  io.emit(msg.Y_name + 'res', data);
                })
              }
            })

          })
        }
      })

    } else {
      savemsg.Update_isread(msg.id, (mess) => {
        if (mess.status == true) {
          var canshu = {
            fromid: msg.youruserid,
            toid: msg.myuserid,
            msg: msg.Y_name + "拒绝了您的请求"
          };
          save.save_msg(canshu, (data1) => {
            if (data1.status == true) {
              io.emit(msg.M_name + 'res', { status: false, msg: msg.Y_name + '拒绝了您的请求！' });
              savemsg.Update_isread(data1.msg, (aaa) => {

              })
            }
          })
        }
      })
      //io.emit(msg.Y_name+'res',data);
    }




  })
  //查询好友
  socket.on('selectfriend', (msg) => {
    LoginCheck.SelectFriend(msg, (status, msg) => {

    });
  })
  //_____________________________________________________________________________________
  //百宝箱
  //检查百宝箱密码是否正确
  socket.on('boxpass', (msg) => {
    if (msg.type == 2) {
      box.PassIsRight(msg, (data) => {
        console.log(data);
        io.emit(msg.name + 'boxCheck', data)
      })
    } else {
      box.savePass(msg, (data) => {
        console.log(data);
        io.emit(msg.name + 'boxCheck', data)
      })
    }
  })
  //检查是否设置了百宝箱的密码
  socket.on('passIsNull', (msg) => {
    box.passIsNull(msg, (data) => {
      console.log(data);
      io.emit(msg.name + 'passIsNull', data);
    })
  })

  socket.on('box_show', (msg) => {
    box.box_selectAllCoin(msg.userid, (param) => {
      io.emit(msg.name + 'box_showCoin', param);
    })
  })
  socket.on('box_transfer', (msg) => {
    if (msg.target == 0) {
      box.boxexchangeOut(msg, (param) => {
        io.emit(msg.name + 'box_tr', param);
      })
    }
    else {
      console.log('123');
      box.selectid(msg.to, (xxx) => {
        if (xxx.status == true) {
          console.log(xxx.msg);
          box.isVIP(xxx.msg, (data) => {
            if (data.status == true) {
              msg.to = xxx.msg;
              box.toOther(msg, (param) => {
                io.emit(msg.name + 'box_tr', param);
              })
            }
            else {
              io.emit(msg.name + 'box_tr', data);
            }
          })
        }
        else {
          io.emit(msg.name + 'box_tr', xxx);
        }
      })


    }
  })
  //额外奖励
  socket.on('box_rate', (msg) => {
    box.OneDayRate(msg.userid, (param) => {
      io.emit(msg.name + 'box_rate', param);
    });
  })
  socket.on('box_huan', (msg) => {
    box.box_exchange(msg, (param) => {
      io.emit(msg.name + 'box_huan', param)
    })
  })
  //___________________________________________________________________________________________________
  //商城充钱
  socket.on('addCoin', (msg) => {
    LoginCheck.savemoney(msg, (data) => {
      if (data.status == true) {
        console.log(data.data);
        io.emit(msg.name + 'addCoin', "200");
      } else {
        console.log(data.data);
        io.emit(msg.name + 'addCoin', "300");
      }
    });
  })
  ///查看不同VIP的钱
  socket.on('VIPMoney', (msg) => {
    ss.returnVIPMoney(msg.power, (param) => {
      io.emit(msg.name + 'VIPMoney', param)
    })
  })
  //充值VIP
  socket.on('buyVIP', (msg) => {

    ss.VIP(msg, (data) => {
      io.emit(msg.name + 'buyVIP', data);
    })
  })
  //买饮品
  socket.on('BuyDrink', (msg) => {
    ss.addDrink(msg, (data) => {
      if (data.status == true) {
        box.Out_jinbi(msg, (param) => {
          console.log(param);
          io.emit(msg.name + 'buyDrink', param);
        })
      } else {
        io.emit(msg.name + 'buyDrink', data);
      }
    })
  })
  socket.on('genxin', (msg) => {
    ss.genxin(msg.userid, (data) => {
      console.log(data);
      io.emit(msg.name + 'genxin', data);
    })
  })
  //张宁----------------------------------------------------------------------------------------------------
  //fapai
  socket.on("pleaseDeal", function (data) {

    var card1 = cards.draw();
    if (card1.id == null) {
      console.log("很尴尬,牌发完了。");
    }
    console.log(card1.id);
    socket.emit('Deal', { id: card1.id });
  });



  //验证扑克
  socket.on('fapai', (data) => {
    result.onload(data.shuzu, (dengji, shuzu) => {

      rank(dengji, shuzu);
    });
    console.log(data);
  });
  /*游戏过程开始*/
  //准备监听
  //room 房间号 lunnum 游戏轮数 zhuang 庄家是几号
  socket.on('bisai', (data) => {
    var a = [];
    redis.hset('Z-user', data.name, data.userid);
    redis.hget('room', data.roomid, (e, r) => {
      if (r == null) {
        var b = [];
        b.push('jiangchi1');
        b.push('jiangchi2');
        b.push('jiangchi3');
        b.push('jiangchi4');
        b.push('jiangchi5');
        b.push('jiangchi6');
        redis.set('jiangchi', JSON.stringify(b));
        var c = [];
        c.push('jiangchi1user');
        c.push('jiangchi2user');
        c.push('jiangchi3user');
        c.push('jiangchi4user');
        c.push('jiangchi5user');
        c.push('jiangchi6user');
        redis.set('jiangchiuser', JSON.stringify(c));
        redis.hset('zhuang', data.roomid, -1);
        redis.hset('room', data.roomid, JSON.stringify(a));
        redis.hset('roomstaus', data.roomid, 'false');
        // var aPairOfCard = new Array(52);
        //     for (let s = 1; s <= 4; s++) {
        //       for (let p = 1; p <= 13; p++) {
        //           var card = new Card.Card(p, s);
        //           aPairOfCard[card.id] = card;

        //       }
        //   }
        var f = [];
        f.push(11);
        redis.hset('card', data.roomid, JSON.stringify(f));
      }
    });
    youxi(data, 3);//比赛场
  });

  socket.on('zhunbei', (data) => {//开房间的时候用一下

    redis.hset('Z-user', data.name, data.userid);
    var a = [];
    redis.hget('room', data.roomid, (e, r) => {
      if (r == null) {
        var b = [];
        b.push('jiangchi1');
        b.push('jiangchi2');
        b.push('jiangchi3');
        b.push('jiangchi4');
        b.push('jiangchi5');
        b.push('jiangchi6');
        redis.set('jiangchi', JSON.stringify(b));
        var c = [];
        c.push('jiangchi1user');
        c.push('jiangchi2user');
        c.push('jiangchi3user');
        c.push('jiangchi4user');
        c.push('jiangchi5user');
        c.push('jiangchi6user');
        redis.set('jiangchiuser', JSON.stringify(c));
        redis.hset('zhuang', data.roomid, -1);
        redis.hset('room', data.roomid, JSON.stringify(a));
        redis.hset('roomstaus', data.roomid, 'false');
        var aPairOfCard = [];
        for (let i = 1; i <= 52; i++) {
          aPairOfCard[i] = i;

        }

        redis.hset('card', data.roomid, JSON.stringify(aPairOfCard));
      }
      youxi(data, 1);
    });

    //用于记录该房间此时是否正在游戏

  });


  function youxi(data, n) {

    var a = [];
    redis.hset('lunnum', data.roomid, 1);
    redis.hset('qipai', data.roomid, JSON.stringify(a));//对该房间弃牌初始化
    redis.hset('allin', data.roomid, JSON.stringify(a));//对该房间allin初始化
    redis.hset('jiangchi1', data.roomid, 0);
    redis.hset('jiangchi2', data.roomid, 0);
    redis.hset('jiangchi3', data.roomid, 0);
    redis.hset('jiangchi4', data.roomid, 0);
    redis.hset('jiangchi5', data.roomid, 0);
    redis.hset('jiangchi6', data.roomid, 0);
    redis.hset('jiangchi1user', data.roomid, JSON.stringify(a));
    redis.hset('jiangchi2user', data.roomid, JSON.stringify(a));
    redis.hset('jiangchi3user', data.roomid, JSON.stringify(a));
    redis.hset('jiangchi4user', data.roomid, JSON.stringify(a));
    redis.hset('jiangchi5user', data.roomid, JSON.stringify(a));
    redis.hset('jiangchi6user', data.roomid, JSON.stringify(a));
    redis.hset('jiangchinum', data.roomid, 0);
    redis.hset('dipai', data.roomid, JSON.stringify(a));



    console.log(data.userid + 'userid');
    redis.hget('roomstaus', data.roomid, (e, r) => {
      redis.hget('room', data.roomid, (err, reply) => {
        if (n == 1 && r == 'false') {


          var b = JSON.parse(reply);
          b.push(data.userid);
          redis.hset('room', data.roomid, JSON.stringify(b));
          console.log(data.roomid + "存入了" + JSON.parse(reply) + '长度为' + JSON.parse(reply).length + 1);
          if (JSON.parse(reply).length + 1 == 2) {

            youxiji(data);//新开的房间要够三个人才能开始
            console.log('jinlai ' + n);


          }
        }
        else if (n == 2) {
          youxiji(data);//已经开始的房间，直接进行游戏
        }
        else if (n == 3) {
          var b = JSON.parse(reply);
          b.push(data.userid);
          redis.hset('room', data.roomid, JSON.stringify(b));
          console.log(data.roomid + "存入了" + JSON.parse(reply) + '长度为' + JSON.parse(reply).length + 1);
          if (JSON.parse(reply).length + 1 == 5) {
            youxiji(data);//新开的房间要够三个人才能开始
            console.log('jinlai ' + n);
          }
        }
      });
    });
    //     //过期
    // redis.expire(data.roomid,180);
    // redis.expire(data.roomid+1,180);
  }
  function youxiji(data) {//游戏开始
    console.log(data + 'jinlaila' + data.roomid);
    redis.hset('roomstaus', data.roomid, 'true');//游戏状态切换为开始
    //用来给用户一个编号
    redis.hget('room', data.roomid, (err, repl) => {

      //找出庄家
      redis.hget('zhuang', data.roomid, (er, r) => {
        //找出来的庄家为上一把的  所以这次的庄家应该是下一位。轮着当
        r++;//没判断第二圈
        if (r == JSON.parse(repl).length) {//如果上一局庄家是最后一个，下一局轮回第一个
          r = 0;
        }
        var xiaomang = r + 1;
        if (xiaomang >= JSON.parse(repl).length) {
          xiaomang -= JSON.parse(repl).length;;
        }
        var damang = r + 2;
        if (damang >= JSON.parse(repl).length) {
          damang -= JSON.parse(repl).length;
        }
        console.log('zhuang' + r + 'xiaomang' + xiaomang + 'damang' + damang);
        redis.hset('zhuang', data.roomid, r);//记录庄家
        for (let i = 0; i < JSON.parse(repl).length; i++) {

          console.log(repl + 'sssssssssssssssss');
          if (i == r) {
            io.emit(JSON.parse(repl)[i], { zhuangtai: 0, name: "zhuang", uid: JSON.parse(repl)[i] });

          }
          if (i == xiaomang) {

            io.emit(JSON.parse(repl)[i], { zhuangtai: 0, name: "xiaomang", uid: JSON.parse(repl)[i] });
          }
          if (i == damang) {
            io.emit(JSON.parse(repl)[i], { zhuangtai: 0, name: "damang", uid: JSON.parse(repl)[i] });
          }
          if (i != r && i != xiaomang && i != damang) {
            console.log("xunhuan3=" + repl);
            io.emit(JSON.parse(repl)[i], { zhuangtai: 0, name: "pinming", uid: JSON.parse(repl)[i] });
          }
          var ddd = user.change(i, 0, '');
          redis.hmset('Message', JSON.parse(repl)[i], ddd);
        }
      });


    });
  }
  //第一轮发牌结束后,进入第一轮游戏
  socket.on('xiazhu', (data) => {

    console.log(data);
    //先判断是不是弃牌 此处代码与下面的弃牌处一样
    //先判断是不是弃牌 此处代码与上面的下注处一样
    user.checkuser(data, (sta) => {
      user.qipai(data, (id) => {
        redis.hget('zuidazhu', data.roomid, (err, re) => {//看看是不是可以发牌，每次和最大注的人比较一下
          user.xiazhu(data, (status) => {
            if (id == re) {
              //告诉客户端可以发牌了
              redis.hget('lunnum', data.roomid, (err, ree) => {
                if (ree < 4) {//判断轮数
                  //然后告诉客户端第几轮
                  redis.hget('jiangchi1', data.roomid, (e, r) => {//第一轮完成后的奖池

                    console.log('当前注数' + r);
                  });
                  redis.hget('room', data.roomid, (eee, rr) => {
                    redis.hmget('Message', JSON.parse(rr), (e, r) => {
                      for (let i = 0; i < r.length; i++) {
                        console.log(JSON.parse(rr)[i] + r[i] + 'aaaaaaaaaaaaaaa');
                        console.log(JSON.parse(r[i]).money + 'bbbbbbbbbbb');
                      }

                    });


                  });
                  fapai(data.roomid, ree);
                  io.emit('lunci', { num: ree });
                  ree++;
                  redis.hset('lunnum', data.roomid, ree);
                  //发牌函数

                  //下一轮开始的时候 让小盲注开始,并且让最大注指向小盲注此人，接下来判断小盲注是否弃牌
                  redis.hget('xiaomang', data.roomid, (err, r) => {
                    redis.hmget('Message', r, (eeee, rrrr) => {
                      var dddd = JSON.parse(rrrr);
                      console.log("zhixingl小忙" + r);
                      redis.hget('jiangchi1', data.roomid, (e8, r8) => {


                        if (sta == 'false') {
                          io.emit(data.roomid, { id: r, money: dddd.money, dichi: r8 });
                          console.log('dichi++++++++++++++++=' + r8);
                          redis.hset('zuidazhu', data.roomid, r);
                        } else {
                          io.emit(data.roomid + 'only', { id: id });//给用户发送命令
                        }
                      });
                    });
                  });
                  //user.fenjiangchi(data);
                }
                else {
                  user.fenjiangchi(data, (a, b) => {//a为胜出的数组，b为总奖金
                    var jiang = b / a.length;
                    console.log(a.length + '         ' + a + 'jiangchi');
                    for (let c = 0; c < a.length; c++) {
                      io.emit(data.roomid + 'jieshu', { id: a[c], num: jiang, statusa: 66 });
                    }
                    console.log(a + '结束来结束来结束啦！！！');



                    //执行结束函数
                    io.emit('lunci', { num: 0 });
                    redis.hget('dipai', data.roomid, (a, b) => {
                      console.log(b + 'dipai');
                    });
                    redis.hget('jiangchi1', data.roomid, (e, r) => {

                      console.log('最终钱数' + r);
                    });
                    //游戏结束后在这里进行人员统计，重新统计人数然后调用游戏函数
                    setTimeout(function jieguo111() {
                      douniu.GetUser(data.roomid, (ss) => {
                        if (ss == 'true') {
                          youxi(data, 2);
                        }
                      });
                    }, 4000);
                  });
                }
              });
            }
            else {

              if (sta == 'false') {

                user.allin(data.roomid, id, (aa) => {//查看是否全下
                  if (aa == 'false') {

                    if (status == 1) {
                      redis.hget('zuidazhu', data.roomid, (ee, rr) => {
                        console.log('这里的rr是+' + rr);
                        redis.hmget('Message', rr, (e, r) => {
                          redis.hget('jiangchi1', data.roomid, (e8, r8) => {

                            console.log('dichi++++++++++++++++=' + r8);

                            var ddd = JSON.parse(r);
                            io.emit(data.roomid, { id: id, money: ddd.money, dichi: r8 });//给用户发送命令
                            console.log('该' + id + '用户操作了0');
                          });
                        });
                      });
                    }
                  }
                  else {
                    io.emit(id, { id: id });//给用户发送命令
                    console.log('该' + id + '用户操作了allin');
                  }
                });

              } else {
                io.emit(data.roomid + 'only', { id: id });//给用户发送命令
              }

            }
          });
        });
      });
    });


    // redis.hset("asd","1","张宁");
    // redis.hset("asd","2","龚亮");
    // redis.hset("asd","3","韩庄");

  });
  //弃牌  
  socket.on('qipai', (data) => {

    redis.hget('qipai', data.roomid, (err, reply) => {
      var b = JSON.parse(reply);
      b.push(data.id);
      redis.hset('qipai', data.roomid, JSON.stringify(b));
      console.log(data.id + "弃牌了" + reply);
    });
    //先判断是不是弃牌 此处代码与上面的下注处一样

    user.qipai(data, (id) => {
      user.checkuser(data, (sta) => {
        redis.hget('zuidazhu', data.roomid, (err, re) => {//看看是不是可以发牌，每次和最大注的人比较一下
          redis.hget('xiaomang', data.roomid, (e, r) => {
            if (r == data.id) {
              redis.hset('xiaomang', data.roomid, id);
              redis.hget('zuidazhu', data.roomid, (ee, rr) => {//小盲注弃牌的时候，看看是否是最大注，因为发牌的时候小盲注是最大注（才能控制轮询一圈）
                if (rr == r) {//找到是的话 就让下一个人当小盲注 并且最大注也是下一个人
                  redis.hset('zuidazhu', data.roomid, id);
                }
              });
            }
          });
          if (id == re) {
            //告诉客户端可以发牌了
            redis.hget('lunnum', data.roomid, (err, ree) => {
              if (ree < 4) {//判断轮数
                //然后告诉客户端第几轮
                redis.hget('jiangchi1', data.roomid, (e, r) => {

                  console.log('当前注数' + r);
                });
                fapai(data.roomid, ree);//发牌函数
                io.emit('lunci', { num: ree });
                ree++;

                redis.hset('lunnum', data.roomid, ree);
                //下一轮开始的时候 让小盲注开始,并且让最大注指向小盲注此人，接下来判断小盲注是否弃牌
                redis.hget('xiaomang', data.roomid, (err, r) => {
                  redis.hmget('Message', r, (eeee, rrrr) => {
                    var dddd = JSON.parse(rrrr);
                    console.log("zhixingl小忙" + r);

                    redis.hget('jiangchi1', data.roomid, (e8, r8) => {

                      if (sta == 'false') {
                        io.emit(data.roomid, { id: r, money: dddd.money, dichi: r8 });
                        redis.hset('zuidazhu', data.roomid, r);
                      } else {
                        io.emit(data.roomid + 'only', { id: id });//给用户发送命令
                      }
                    });
                  });
                });
                //user.fenjiangchi(data);
              }
              else {
                user.fenjiangchi(data, (a, b) => {//a为胜出的数组，b为总奖金
                  var jiang = b / a.length;
                  for (let c = 0; c < a.length; c++) {
                    io.emit(data.roomid + 'jieshu', { id: a[c], num: jiang, statusa: 66 });
                  }
                  console.log(a + '结束来结束来结束啦！！！');

                  //执行结束函数

                  io.emit('lunci', { num: 0 });
                  redis.hget('dipai', data.roomid, (a, b) => {
                    console.log(b + 'dipai');
                  });
                  redis.hget('jiangchi1', data.roomid, (e, r) => {

                    console.log('最终钱数' + r);

                    //游戏结束后在这里进行人员统计，重新统计人数然后调用游戏函数
                    setTimeout(function jieguo111() {
                      douniu.GetUser(data.roomid, (ss) => {
                        if (ss == 'true') {
                          youxi(data, 2);
                        }
                      });
                    }, 4000);
                  });
                });
              }
            });
          }
          else {

            // if(sta=='false'){
            user.allin(data.roomid, id, (aa) => {
              if (aa == 'false') {


                redis.hget('zuidazhu', data.roomid, (ee, rr) => {
                  console.log('这里的rr是+' + rr);
                  redis.hmget('Message', rr, (e, r) => {
                    redis.hget('jiangchi1', data.roomid, (e8, r8) => {

                      console.log('dichi++++++++++++++++=' + r8);

                      var ddd = JSON.parse(r);
                      io.emit(data.roomid, { id: id, money: ddd.money, dichi: r8 });//给用户发送命令
                      console.log('该' + id + '用户操作了1');
                    });
                  });
                });
              }
              else {
                io.emit(id, { id: id });//给用户发送命令
                console.log('该' + id + '用户操作了allin');
              }
            });

            //  }else
            //           {
            //                io.emit(data.roomid+'only',{id:id});//给用户发送命令
            //           }


          }

        });

      });
    });
    //  redis.hget(data.roomid,'qi'+data.id,(err,reply)=>{
    //    console.log('弃牌'+reply);
    //  });
  });


  //加注，记录加注人，之后与之对比
  socket.on('jiazhu', (data) => {
    user.jiazhu(data, (status) => {
      redis.hset('zuidazhu', data.roomid, data.id);//加完之后让下一个进行操作，

      user.qipai(data, (id) => {
        user.allin(data.roomid, id, (aa) => {
          if (aa == 'false') {//没有全押的人

            redis.hget('zuidazhu', data.roomid, (ee, rr) => {
              redis.hmget('Message', rr, (e, r) => {
                var ddd = JSON.parse(r);
                redis.hget('jiangchi1', data.roomid, (e8, r8) => {

                  console.log('dichi++++++++++++++++=' + r8);
                  io.emit(data.roomid, { id: id, money: ddd.money, dichi: r8 });//给用户发送命令
                  console.log('该' + id + '用户操作了0');
                });
              });
            });

          } else//有全押，进行奖池分离操作
          {
            io.emit(id, { id: id, money: data.money });//给用户发送命令
            console.log('该' + id + '用户操作了allin');
          }
        });
      });
    });
  });




  socket.on('allin', (data) => {//allin之后，在该轮结束后，开始判断allin用户的注数，分开奖池，并且在里面记录参与开奖的用户
    user.xiazhu(data, (stats) => {

    });

    redis.hget('zuidazhu', data.roomid, (er, rel) => {//必须比最大注大才能改最大注的表，防止allin的时候进来比最大注小的
      redis.hmget('Message', rel, (err, aa) => {
        var c = JSON.parse(aa);
        if (c.money < data.money) {
          redis.hset('zuidazhu', data.roomid, data.id);//加完之后让下一个进行操作，
        }
      });

    });
    redis.hget('allin', data.roomid, (e, r) => {
      var a = JSON.parse(r);
      a.push(data.id);
      redis.hset('allin', data.roomid, JSON.stringify(a));
    });
    user.checkuser(data, (sta) => {

      user.qipai(data, (id) => {
        if (sta == 'false') {
          user.allin(data.roomid, id, (aa) => {
            if (aa == 'false') {
              redis.hget('xiaomang', data.roomid, (errr, reppp) => {
                if (data.id == reppp) {
                  redis.hset('xiaomang', data.roomid, id);
                }
              });
              redis.hget('zuidazhu', data.roomid, (ee, rr) => {
                redis.hmget('Message', rr, (e, r) => {
                  var ddd = JSON.parse(r);

                  redis.hget('jiangchi1', data.roomid, (e8, r8) => {

                    console.log('dichi++++++++++++++++=' + r8);
                    if (id == rr) {//如果下一个是最大注

                      redis.hget('lunnum', data.roomid, (err, ree) => {

                        if (ree < 4) {//判断轮数
                          //然后告诉客户端第几轮

                          fapai(data.roomid, ree);
                          io.emit('lunci', { num: ree });
                          ree++;
                          redis.hset('lunnum', data.roomid, ree);
                          //发牌函数

                          //下一轮开始的时候 让小盲注开始,并且让最大注指向小盲注此人，接下来判断小盲注是否弃牌
                          redis.hget('xiaomang', data.roomid, (eee, r11) => {


                            console.log("zhixingl小忙" + r11);

                            io.emit(data.roomid, { id: r11, money: ddd.money, dichi: r8 });
                            console.log('dichi++++++++++++++++=' + r8);
                            redis.hset('zuidazhu', data.roomid, r11);
                          });
                          //user.fenjiangchi(data);
                        }
                        else {
                          user.fenjiangchi(data, (a, b) => {//a为胜出的数组，b为总奖金
                            var jiang = b / a.length;
                            console.log(a.length + '         ' + a + 'jiangchi');
                            for (let c = 0; c < a.length; c++) {
                              io.emit(data.roomid + 'jieshu', { id: a[c], num: jiang, statusa: 66 });
                            }
                            console.log(a + '结束来结束来结束啦！！！');

                            //执行结束函数
                            io.emit('lunci', { num: 0 });
                            redis.hget('dipai', data.roomid, (a, b) => {
                              console.log(b + 'dipai');
                            });
                            redis.hget('jiangchi1', data.roomid, (e, r) => {

                              console.log('最终钱数' + r);
                            });
                            //游戏结束后在这里进行人员统计，重新统计人数然后调用游戏函数
                            setTimeout(function jieguo111() {
                              douniu.GetUser(data.roomid, (ss) => {
                                if (ss == 'true') {
                                  youxi(data, 2);
                                }
                              });
                            }, 3000);
                          });

                        }
                      });

                    } else {
                      io.emit(data.roomid, { id: id, money: ddd.money, dichi: r8 });//给用户发送命令
                      console.log('该' + id + '用户操作了3');
                    }
                  });
                });
              });
            } else {
              io.emit(id, { id: id });//给用户发送命令
              console.log('该' + id + '用户操作了allin');
            }
          });
        } else {
          io.emit(data.roomid + 'only', { id: id });//给用户发送命令
        }
      });

    });
  });
  //设置小盲注和首轮的最大注
  socket.on('xiaomang', (data) => {
    io.emit('youxianzhu', { money: 2 * data.money });
    console.log('xiaomangxiazhu' + data.money);
    console.log("xiaomang" + data);
    redis.hset('xiaomang', data.roomid, data.id);//设置小盲注
    //找最大注也就是大盲注
    redis.hget('room', data.roomid, (ee, reply) => {
      redis.hmget('Message', data.id, (e, r) => {


        let i = JSON.parse(r);
        if (i.shunxu + 1 < JSON.parse(reply).length) {
          redis.hset('zuidazhu', data.roomid, JSON.parse(reply)[(i.shunxu + 1)]);//将大盲注设置好，就是第一轮的最大注
        } else {
          redis.hset('zuidazhu', data.roomid, JSON.parse(reply)[0]);
        }
        redis.hget('zuidazhu', data.roomid, (e, w) => {
          console.log('最大注shi ' + w);
        });

        redis.hmget('Message', JSON.parse(reply), (eeeee, rep) => {

          redis.hget('card', data.roomid, (e, r) => {
            var shuzu = JSON.parse(r);
            console.log(JSON.parse(r) + '                ffffffffffffffffffffffffffff');
            for (let a = 0; a < JSON.parse(reply).length; a++) {
              var ss = JSON.parse(rep[a]);
              var card1 = cards.draw(data.roomid, shuzu);
              shuzu[card1] = 0;
              var card2 = cards.draw(data.roomid, shuzu);
              shuzu[card2] = 0;

              if (card1 == null) {
                console.log("很尴尬,牌发完了。");
              }

              ss.pai.push(card1);
              ss.pai.push(card2);
              console.log(ss.pai + 'card1.ids             00000000asdasas' + JSON.parse(reply)[a]);


              io.emit(data.roomid + 'Deal', { id1: card1, id2: card2, uid: JSON.parse(reply)[a] });
              redis.hmset('Message', JSON.parse(reply)[a], JSON.stringify(ss));
            }
          });
        });
      });
      user.xiazhu(data, (status) => {
        if (status == 1) {
        }
      });


    });


  });

  socket.on('youxian', (data) => {

    io.emit('youxian', { lunnum1: data.lunnum });

  });
  function fapai(room, num) {
    redis.hget('dipai', room, (e, r) => {
      var shuzu = JSON.parse(r);
      redis.hget('card', room, (ee, rr) => {

        var pai = JSON.parse(rr);
        if (num == 1) {
          var card1 = cards.draw(room, pai);
          pai[card1] = 0;
          var card2 = cards.draw(room, pai);
          pai[card2] = 0;
          var card3 = cards.draw(room, pai);
          pai[card3] = 0;
          shuzu.push((card1));
          shuzu.push((card2));
          shuzu.push((card3));
          console.log(JSON.parse(rr));
          if (shuzu.length == 3) {
            redis.hmset('dipai', room, JSON.stringify(shuzu));
            io.emit(room + 'Deal', { id1: card1, id2: card2, id3: card3, uid: 'all1' });
          }
        } else if (num == 2) {
          var card1 = cards.draw(room, pai);
          pai[card1] = 0;
          shuzu.push((card1));
          redis.hmset('dipai', room, JSON.stringify(shuzu));
          io.emit(room + 'Deal', { id1: card1, uid: 'all2' });
        }
        else if (num == 3) {
          var card1 = cards.draw(room, pai);
          pai[card1] = 0;
          shuzu.push((card1));
          redis.hmset('dipai', room, JSON.stringify(shuzu));
          io.emit(room + 'Deal', { id1: card1, uid: 'all3' });
        }
      });
    });
  }

  socket.on('baocunmoney', (data) => {
    if (data.type == 'scoin') {
      douniu.baocunmoney(data, (status) => {
        socket.emit(data.name, { sta: status });
      });
    }
  });

  /*游戏过程结束*/
  /*斗牛玩法   开始 */
  socket.on('douniujiaru', (msg) => {//统计现在还在房间的玩家
    redis.hset('Z-user', msg.name, msg.uid);
    redis.hget('douniu', msg.roomid, (e, r) => {
      var a = JSON.parse(r);
      if (a == null) {
        redis.hset('roomstaus', msg.roomid, 'false');
        var c = [];
        c.push(msg.uid);
        redis.hset('douniu', msg.roomid, JSON.stringify(c));
        console.log('shuzu' + c);
        var aPairOfCard = [];
        for (let i = 1; i <= 52; i++) {
          aPairOfCard[i] = i;

        }

        redis.hset('card', msg.roomid, JSON.stringify(aPairOfCard));

      } else {
        a.push(msg.uid);
        console.log('shuzu' + a);
        redis.hset('douniu', msg.roomid, JSON.stringify(a));
      }
      var a = douniu.change();
      redis.hmset('douniumsg', msg.uid, a);
      redis.hget('roomstaus', msg.roomid, (e, r) => {
        if (r == 'true') {

        } else {
          fapaidouniu(msg.roomid);
        }
      });

    });

  });

  socket.on('test', (data) => {
    jieguo.onload();
  });

  function fapaidouniu(roomid) {//新一局游戏开始
    redis.hset('roomstaus', roomid, 'true');
    redis.hget('douniu', roomid, (e, r) => {

      for (let c = 0; c < JSON.parse(r).length; c++) {
        var a = douniu.change();
        redis.hmset('douniumsg', JSON.parse(r)[c], a);
      }

      console.log('fasongle');
      var ddd = user.change('you', 0, '牛仔');
      redis.hmset('Message', roomid + 'you', ddd);
      var ddd1 = user.change('zuo', 0, '公仔');
      redis.hmset('Message', roomid + 'zuo', ddd1);
      redis.hget('card', roomid, (ww, ee) => {
        var e = JSON.parse(ee);

        var card1 = cards.draw(roomid, e);
        e[card1] = 0;
        var card2 = cards.draw(roomid, e);
        e[card2] = 0;
        var card3 = cards.draw(roomid, e);
        e[card3] = 0;
        var card4 = cards.draw(roomid, e);
        e[card4] = 0;
        var card5 = cards.draw(roomid, e);
        e[card5] = 0;
        var card6 = cards.draw(roomid, e);
        e[card6] = 0;
        var card7 = cards.draw(roomid, e);
        e[card7] = 0;
        var card8 = cards.draw(roomid, e);
        e[card8] = 0;
        var card9 = cards.draw(roomid, e);
        e[card9] = 0;
        var zuo = [];
        var you = [];
        var dipai = [];
        zuo.push((card1));
        zuo.push((card2));
        you.push((card8));
        you.push((card9));
        dipai.push((card3));
        dipai.push((card4));
        dipai.push((card5));
        dipai.push((card6));
        dipai.push((card7));
        redis.hmget('Message', roomid + 'zuo', (e, r) => {
          var d = JSON.parse(r);
          d.pai = zuo;
          redis.hmset('Message', roomid + 'zuo', JSON.stringify(d));
          redis.hmget('Message', roomid + 'you', (e, r1) => {
            var d1 = JSON.parse(r1);
            d1.pai = you;
            redis.hmset('Message', roomid + 'you', JSON.stringify(d1));
            zuo.push.apply(zuo, dipai);
            you.push.apply(you, dipai);
            console.log(roomid + 'room');

            io.emit(roomid + 'douniu', { id1: card1, id2: card2, id3: card3, id4: card4, id5: card5, id6: card6, id7: card7, id8: card8, id9: card9 });
            douniu.chulidouniu(zuo, you, roomid, (dengji, jieguo1) => {
              jieguo.shoupai(roomid, (shoudengji1, shoudengji2) => {
                kaijiang(roomid, dengji, jieguo1, shoudengji1, shoudengji2);
              });
            });
          });
        });
      });
    });

    //时间计时  等到十几秒之后  进行结果判断函数
  }
  function kaijiang(roomid, dengji, jieguo, dengji1, dengji2) {
    //  同花顺＞四条(金刚)＞葫芦(豪斯)＞同花＞顺子＞三条＞两对＞一对＞高牌
    //9       8     7         6     5     4     3     2     1
    redis.hget('douniu', roomid, (e, r) => {
      redis.hmget('douniumsg', JSON.parse(r), (e1, r1) => {

        for (let a = 0; a < JSON.parse(r).length; a++) {
          //JSON.parse(r1[a]),获取每个人的下注信息
          var c = JSON.parse(r1[a]);

          if (dengji1 == 1) {
            io.emit(JSON.parse(r)[a] + 'douniuhuojiang', { jiangjin: (c.dantong * 2.3), type: '手牌同花' });
          }
          else if (dengji1 == 3) {
            io.emit(JSON.parse(r)[a] + 'douniuhuojiang', { jiangjin: (c.dantong * 2.3), type: '手牌同花' });
            io.emit(JSON.parse(r)[a] + 'douniuhuojiang', { jiangjin: (c.dantonglian * 12.5), type: '手牌同花连牌' });
            io.emit(JSON.parse(r)[a] + 'douniuhuojiang', { jiangjin: (c.danlian * 3.3), type: '手牌连牌' });
          }
          if (dengji2 == 1) {
            io.emit(JSON.parse(r)[a] + 'douniuhuojiang', { jiangjin: (c.danlian * 3.3), type: '手牌连牌' });
          }
          else if (dengji2 == 2) {
            io.emit(JSON.parse(r)[a] + 'douniuhuojiang', { jiangjin: (c.danduizi * 8.4), type: '手牌对子' });
          }
          else if (dengji2 == 3) {
            io.emit(JSON.parse(r)[a] + 'douniuhuojiang', { jiangjin: (c.danduiyi * 100), type: '对A' });
          }


          if (dengji == 1 || dengji == 2) {
            io.emit(JSON.parse(r)[a] + 'douniuhuojiang', { jiangjin: (c.shengyidui * 2.2), type: '一对/高牌' });
          }
          else if (dengji == 3) {
            io.emit(JSON.parse(r)[a] + 'douniuhuojiang', { jiangjin: (c.shengerdui * 3), type: '两对' });
          }
          else if (dengji == 4 || dengji == 5 || dengji == 6) {
            io.emit(JSON.parse(r)[a] + 'douniuhuojiang', { jiangjin: (c.shengshun * 4.5), type: '顺子，三条，同花' });
          }
          else if (dengji == 7) {
            io.emit(JSON.parse(r)[a] + 'douniuhuojiang', { jiangjin: (c.shenghulu * 20), type: '葫芦' });
          }
          else if (dengji == 8 || dengji == 9) {
            io.emit(JSON.parse(r)[a] + 'douniuhuojiang', { jiangjin: (c.shenghuang * 246), type: '金刚/皇家' });
          }


          if (jieguo == 'zuo') {
            io.emit(JSON.parse(r)[a] + 'douniuhuojiang', { jiangjin: (c.zuosheng * 2), type: '左' });
          }
          else if (jieguo == 'you') {
            io.emit(JSON.parse(r)[a] + 'douniuhuojiang', { jiangjin: (c.yousheng * 2), type: '右' });
          }
          else if (jieguo == 'ping') {
            io.emit(JSON.parse(r)[a] + 'douniuhuojiang', { jiangjin: (c.pingsheng * 19), type: '平' });
          }
        }

        io.emit(roomid + 'xin', { a: 'true' });//客户端重置上一局玩家下注信息
        io.emit(roomid + 'zhanshi', { aa: 1 });

        setTimeout(function jieguo111() {

          douniu.GetUserNiu(roomid, (ss) => {
            if (ss == 'true') {
              fapaidouniu(roomid);
            }
          }, 3000);
        });


      });
    });
  }
  socket.on('douniuxiazhu', (msg) => {
    douniu.xiazhu(msg);//在这个函数中  记录用户的下注数
  });

  /*斗牛玩法   结束 */
  //心跳
  socket.on('xintiao', (data) => {
    if (data.message == '我现在在线吗?') {
      io.emit('xintiaohuidiao' + data.userid, { message: '你还在线' });
    }
  });
  //升级
  socket.on('exp', (msg) => {
    exp.shengji(msg, (dengji, jingyan) => {
      io.emit('dengji', { lv: dengji, exp: jingyan });//向客户端发送当前用户等级和经验信息
    });
  });
  var dn = {};
  dn.zuosheng = 0;
  dn.pingsheng = 0;
  dn.yousheng = 0;
  dn.dantong = 0;
  dn.danlian = 0;
  dn.danduizi = 0;
  dn.dantonglian = 0;
  dn.danduiyi = 0;
  dn.shengyidui = 0;
  dn.shengerdui = 0;
  dn.shengshun = 0;
  dn.shenghulu = 0;
  dn.shenghuang = 0;
  socket.on('douniuAll', (msg) => {
    if (msg.type == 'zuo') { dn.zuosheng += msg.num; }
    else if (msg.type == 'ping') { dn.pingsheng += msg.num; }
    else if (msg.type == 'you') { dn.yousheng += msg.num; }
    else if (msg.type == 'zuo1') { dn.dantong += msg.num; }
    else if (msg.type == 'zuo2') { dn.danlian += msg.num; }
    else if (msg.type == 'zuo3') { dn.danduizi += msg.num; }
    else if (msg.type == 'zuo4') { dn.dantonglian += msg.num; }
    else if (msg.type == 'zuo5') { dn.danduiyi += msg.num; }
    else if (msg.type == 'you1') { dn.shengyidui += msg.num; }
    else if (msg.type == 'you2') { dn.shengerdui += msg.num; }
    else if (msg.type == 'you3') { dn.shengshun += msg.num; }
    else if (msg.type == 'you4') { dn.shenghulu += msg.num; }
    else if (msg.type == 'you5') { dn.shenghuang += msg.num; }
    else if (msg.type == 'new') {
      dn.zuosheng = 0;
      dn.pingsheng = 0;
      dn.yousheng = 0;
      dn.dantong = 0;
      dn.danlian = 0;
      dn.danduizi = 0;
      dn.dantonglian = 0;
      dn.danduiyi = 0;
      dn.shengyidui = 0;
      dn.shengerdui = 0;
      dn.shengshun = 0;
      dn.shenghulu = 0;
      dn.shenghuang = 0;
    }
    io.emit(msg.roomid + 'Alldouniu', { roomid: msg.roomid, num: dn });
  });
  //验证信息
  socket.on('pwdxiugaiyz', (msg) => {
    caozuo.yanzheng(msg, (status, data) => {
      io.emit(msg.Phone, { status, data });
    });
  });
  //密码修改
  socket.on('pwdxiugai', (msg) => {
    caozuo.yanzheng(msg, (status, data) => {
      io.emit(msg.Phone, { status, data });
    });
  });


  socket.on('coming1', (msg) => {
    redis.hset('money', msg.name, JSON.stringify(msg));
    console.log('message+++++++++++++++++++' + msg);
    io.emit(msg.roomid + 'come1', msg);
  })
  socket.on('coming2', (msg) => {
    redis.hset('money', msg.name, JSON.stringify(msg));
    console.log('message+++++++++++++++++++' + msg);
    io.emit(msg.roomid + 'come2', msg);
  })
  socket.on('coming3', (msg) => {
    redis.hset('money', msg.name, JSON.stringify(msg));
    io.emit(msg.roomid + 'come3', msg);
  })
  socket.on('coming4', (msg) => {
    redis.hset('money', msg.name, JSON.stringify(msg));
    io.emit(msg.roomid + 'come4', msg);
  })
  socket.on('coming5', (msg) => {
    redis.hset('money', msg.name, JSON.stringify(msg));
    io.emit(msg.roomid + 'come5', msg);
  })
  socket.on('coming6', (msg) => {
    redis.hset('money', msg.name, JSON.stringify(msg));
    io.emit(msg.roomid + 'come6', msg);
  })
  socket.on('coming7', (msg) => {
    redis.hset('money', msg.name, JSON.stringify(msg));
    io.emit(msg.roomid + 'come7', msg);
  })
  socket.on('coming8', (msg) => {
    redis.hset('money', msg.name, JSON.stringify(msg));
    io.emit(msg.roomid + 'come8', msg);
  })
  socket.on('UpdateRoom', (msg) => {
    room.roommessage(msg, (param) => {
      console.log('update');
      io.emit('UpdateRoomBack' + msg, param);
    })
  })
  //金钱
  socket.on('changeMoney', (msg) => {
    redis.hset('money', msg.name, JSON.stringify(msg));
    io.emit(msg.roomid + 'moneyChanged', msg);
  });

  socket.on('changexiazhu', (msg) => {

    io.emit(msg.roomid + 'xiazhuChanged', msg);
  });

  //下注

  socket.on('findDichi', (msg) => {
    redis.hget('jiangchi1', msg.roomid, (e8, r8) => {

      io.emit(msg.roomid + 'dichi', r8);
    })
  })

  //-----------------------------------------------------------------------------------
  //离开房间

  socket.on('tuifang', (msg) => {
    console.log('退房' + msg);
    room.leaveRoom(msg, (param) => {
      if (param.status) {
        socket.emit('tuifangS' + msg.name, param);
        io.emit('tuifang' + msg.roomid, param);
      }

    });
  });
  //断开连接socket.io
  socket.on('disconnect ', function () {
    // room.leaveRoom(msg, (param) => {
    //   io.emit('tuifang' + msg.roomid, param);
    // });
    socket.disconnect();
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.disable('etag');
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

  if (req.method == 'OPTIONS') {
    res.send(200); /让options请求快速返回/
  }
  else {
    next();
  }
});
app.use('/index', index);
app.use('/users', users);
app.use('/test', test);
app.use('/userapi', userapi);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
