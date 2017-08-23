var config = require('../model/config');
var jieguo = require('../model/returnResult');
var clisent = require("redis")
    , redis = clisent.createClient(config.redis.port, config.redis.host, config.redis.opts);

function change(shunxu, money, name) {
    var a = {};
    a.shunxu = shunxu;
    a.money = money;
    a.name = name;
    a.pai = [];
    a.dengji = 0;
    a.zuizhongpai = 0;
    return JSON.stringify(a);
};
function qipai(data, callback) {
    var flag = 0;
    var f = 0;
    var a = 0;
    redis.hget('room', data.roomid, (e, reply) => {
        redis.hget('qipai', data.roomid, (er, re) => {
            //    if(JSON.parse(re).length+1==JSON.parse(reply).length){
            //        //直接执行结束函数，把当前的钱都给该用户
            //    }
            //    else{
            if (JSON.parse(re).length >= 1) {
                redis.hmget('Message', data.id, (ee, rep) => {
                    let i = JSON.parse(rep);
                    var s;
                    if (i.shunxu + 1 == JSON.parse(reply).length) {
                        s = -1;
                    }
                    else {
                        s = i.shunxu;
                    }
                    console.log('现在该执行弟' + (s + 1));
                    for (let c = s + 1; c < JSON.parse(reply).length; c++) {//从那个位置开始向后找
                        for (let a = 0; a < JSON.parse(re).length; a++) {//开始在弃牌表中对比
                            if (JSON.parse(reply)[c] == JSON.parse(re)[a]) {
                                flag = 1;
                            }
                        }
                        if (flag == 0) {//控制循环  可以再从0开始执行一次，避免落下前面没执行的用户
                            callback(JSON.parse(reply)[c]);
                            console.log(JSON.parse(reply)[c] + "在弃牌nei这里传回去的是");

                            break;
                        }
                        if (c == (JSON.parse(reply).length - 1) && a == 0) {
                            c = (-1);
                            a = 1;
                        }
                        flag = 0;
                    }

                });


            }
            else {
                redis.hmget('Message', data.id, (e, r) => {
                    let i = JSON.parse(r);
                    if ((i.shunxu + 1) == JSON.parse(reply).length) {
                        console.log(JSON.parse(reply)[0] + "在弃牌这里传回去的是");
                        callback(JSON.parse(reply)[0]);
                    } else {
                        console.log(JSON.parse(reply)[(i.shunxu + 1)] + "在弃牌这里传回去的是");
                        callback(JSON.parse(reply)[(i.shunxu + 1)]);
                    }
                });

            }
            //  }  
        });
    });

}
function allin(room, id, callback) {//房间号和人需要传进来
    var flag = 0;
    redis.hget('allin', room, (e, r) => {

        if (JSON.parse(r).length == 0) {
            callback('false');
        } else {
            for (let i = 0; i < JSON.parse(r).length; i++) {
                if (id == JSON.parse(r)[i]) {
                    callback('true');;//表示有相同的  代表已经allin了
                    flag = 1;//全部循环完成 看看有没有一样的再做决定，不能循环一次callback一次
                    break;
                }

            }
            if (flag == 0) {
                callback('false');;//表示有相同的 
            }
        }
    });
}

function xiazhu(data, callback) {
    var sum = 0;
    var gen = 0;
    redis.hget('jiangchinum', data.roomid, (eee, rep) => {
        redis.get('jiangchi', (er, repl) => {

            console.log(JSON.parse(repl)[rep]);
            redis.hget(JSON.parse(repl)[rep], data.roomid, (e, r) => {
                redis.hmget('Message', data.id, (ee, rr) => {
                    var ddd = JSON.parse(rr);

                    gen = parseInt(data.money) - parseInt(ddd.money);
                    sum = parseInt(gen) + parseInt(r);
                    redis.hset(JSON.parse(repl)[rep], data.roomid, sum);

                    console.log(r);

                    ddd.money = data.money;
                    console.log('个人信息' + ddd.money000000000000000000000000000000000000000000000000);
                    redis.hmset('Message', data.id, JSON.stringify(ddd));
                    callback(1);
                });
            });
        });
    });
}

function jiazhu(data, callback) {
    var sum = 0;
    var gen = 0;
    redis.hget('jiangchinum', data.roomid, (eee, rep) => {
        redis.get('jiangchi', (er, repl) => {
            redis.hget(JSON.parse(repl)[rep], data.roomid, (e, r) => {
                redis.hmget('Message', data.id, (ee, rr) => {
                    var ddd = JSON.parse(rr);

                    sum = parseInt(data.money) + parseInt(r);
                    redis.hset(JSON.parse(repl)[rep], data.roomid, sum);

                    console.log(r);

                    ddd.money = data.money + parseInt(ddd.money);
                    console.log('个人信息' + ddd);
                    redis.hmset('Message', data.id, JSON.stringify(ddd));
                });
            });
        });
    });
    callback(1);
}
function fenjiangchi(data, callback) {
    console.log('进到分奖池了');
    var shu = [];//记录一轮完成后每一个allin的注数
    var flag = 0;
    var f = 0;
    var shunxu = 1;
    redis.hget('allin', data.roomid, (e, r) => {
        if (JSON.parse(r).length > 0) {
            //找出allin的人  在他们的个人信息中看下注的多少  根据这个划分奖池，一个等级一个奖池，奖池1人数最多，依次类推，要把人存进去

            //存hmset
            redis.hmget('Message', JSON.parse(r), (e, rep4) => {
                shu.push(JSON.parse(rep4[0]).money);//初始化
                for (let i = 1; i < rep4.length; i++) {
                    console.log(JSON.parse(r)[i] + rep4[i] + 'cccccccccc');
                    console.log(JSON.parse(rep4[i]).money + 'ddddddddd');
                    for (let b = 0; b < shu.length; b++)//避免放入重复数据
                    {
                        if (JSON.parse(rep4[i]).money == shu[b]) {
                            flag = 1;
                        }
                    }
                    if (flag == 0) {
                        shu.push(JSON.parse(rep4[i]).money);
                    }
                    flag = 0;
                }
                var jiaohuan;
                for (let a = 0; a < shu.length; a++) {//将所有allin的人的钱数排序，从小到大
                    for (let b = a; b < shu.length; b++) {
                        if (shu[a] > shu[b]) {
                            jiaohuan = shu[a];
                            shu[a] = shu[b];
                            shu[b] = jiaohuan;
                        }
                    }
                    console.log('b数组' + shu[a]);
                }
                console.log('jinqul1111111111111111');
                jiangchifen(data.roomid, shu, 0, callback, 0);
            });
        }
        else {//没有allin的人，只有一个奖池
            noallin(data.roomid, callback);
        }


    });
}
function noallin(roomid, callback) {//没有allin的人
    var flag = 0;
    redis.hget('room', roomid, (e0, r0) => {
        redis.hmget('Message', JSON.parse(r0), (e1, r1) => {
            redis.hget('qipai', roomid, (er, re) => {
                redis.hget('dipai', roomid, (e2, r2) => {
                    var dipai = JSON.parse(r2);

                    for (let a = 0; a < JSON.parse(r0).length; a++) {
                        for (let b = 0; b < JSON.parse(re).length; b++) {//找弃牌表中的相同数据，不进行结果传输
                            if (JSON.parse(r0)[a] == JSON.parse(re)[b]) {
                                flag = 1;
                            }
                        }
                        if (flag == 0) {//弃牌的进不来，牌型大小全是0
                            var s = JSON.parse(r1[a]).pai;
                            console.log(s + dipai + '000000');
                            s.push.apply(s, dipai);
                            console.log(s);
                            //数组排序 
                            var jiaohuan;
                            for (let c = 0; c < s.length; c++) {//将所有allin的人的钱数排序，从小到大
                                for (let d = c; d < s.length; d++) {
                                    if (s[c] > s[d]) {
                                        jiaohuan = s[c];
                                        s[c] = s[d];
                                        s[d] = jiaohuan;
                                    }
                                }
                            }
                            console.log('s数组' + s);
                            jieguo.onload(s, (aa, shuzu) => {
                                // ccc[num].push(aa);
                                console.log(aa + 'aa' + shuzu + 'shuzu'+JSON.parse(r0)[a]);
                                var ddd = JSON.parse(r1[a]);
                                //  var zuizhongpai=JSON.parse(r2[a]).zuizhongpai;
                                ddd.dengji = aa;
                                ddd.zuizhongpai = shuzu;
                                console.log(ddd.dengji + 'denggji' + ddd.zuizhongpai + 'pai'+JSON.parse(r0)[a]);
                                redis.hmset('Message', JSON.parse(r0)[a], JSON.stringify(ddd));
                            });
                        }
                        flag = 0;
                    }
                    noallkaijiang(roomid, callback);
                });
            });
        });
    });
}
function noallkaijiang(roomid, callback) {
    var dengji = 0;//记录玩家的等级
    var dengjiid = 0;
    var dengjiaaa = [];

    var pai = 0;

    redis.hget('jiangchi1', roomid, (ee, r1) => {

        redis.hget('room', roomid, (e0, r0) => {
            redis.hmget('Message', JSON.parse(r0), (e1, r2) => {
                for (let a = 0; a < JSON.parse(r0).length; a++) {
                    if (JSON.parse(r2[a]).dengji > dengji) {//找到大的就放
                        dengji = JSON.parse(r2[a]).dengji;
                        dengjiid = JSON.parse(r0)[a];
                        pai = parseInt(JSON.parse(r2[a]).zuizhongpai);
                    } else if (JSON.parse(r2[a]).dengji == dengji) {
                        if (parseInt(JSON.parse(r2[a]).zuizhongpai) > pai) {//一样的话比里面的牌
                            dengji = JSON.parse(r2[a]).dengji;
                            dengjiid = JSON.parse(r0)[a];
                            pai = parseInt(JSON.parse(r2[a]).zuizhongpai);
                        }
                    }
                }
                for (let a = 0; a < JSON.parse(r0).length; a++) {
                    if (JSON.parse(r2[a]).dengji == dengji) {//找到大的就放
                        if (parseInt(JSON.parse(r2[a]).zuizhongpai) == pai) {//一样的话比里面的牌

                            dengjiaaa.push(JSON.parse(r0)[a]);

                        }
                    }
                }
                callback(dengjiaaa, r1);

            });
        });
    });
}
function jiangchifen(roomid, shuzu, shuzixiao, callback, shunxu) {//传进去一个数字，然后在遍历的时候找到这个大小的下注数
    console.log('进到奖池分了');

    var s;
    var f = 0;
    var g = shunxu;

    var shuzi = shuzu[g];
    redis.hget('jiangchinum', roomid, (eee, rep) => {//获取记录奖池和用户表的数字
        //  rep=0;
        console.log(rep + '此时的轮数' + shuzu.length);
        redis.get('jiangchiuser', (era, repl) => {//获取奖池用户表的名字的数组
            redis.get('jiangchi', (errr, reply) => {//获取奖池表的名字的数组
                var jiangchi = JSON.parse(reply);

                redis.hget('room', roomid, (e, r) => {//获取用户
                    var usernum = JSON.parse(r).length;
                    redis.hget('qipai', roomid, (er, re) => {//获取弃牌用户
                        redis.hget('allin', roomid, (er, rere) => {//获取allin用户

                            redis.hget(JSON.parse(repl)[rep], roomid, (err, rep2) => {//找出奖池用户表
                                s = JSON.parse(rep2);
                                s.splice(0, s.length);
                                redis.hmget('Message', JSON.parse(re), (ere, rer) => {//获取弃牌用户信息
                                    redis.hmget('Message', JSON.parse(rere), (eeee, rer4) => {//获取allin用户


                                        redis.hget(jiangchi[rep], roomid, (edd, rep3) => {
                                            var jiang = rep3;
                                            rep3 = 0;
                                            console.log('jiangchi' + jiang);

                                            for (let a = 0; a < JSON.parse(r).length; a++) {//在用户表中和弃牌表中把用户做对比，如果此轮的弃牌表中的用户的下注数满足此轮条件，说明在此轮弃牌了，所以不加入到奖金表中

                                                for (let b = 0; b < JSON.parse(re).length; b++) {
                                                    var df = JSON.parse(rer[b]).money;
                                                    console.log('df' + df + 'rer' + rer);
                                                    if (JSON.parse(r)[a] == JSON.parse(re)[b]) {
                                                        if (df >= shuzixiao && df < shuzi) {//找出在第一个范围的用户，就代表是第一轮弃牌的
                                                            rep3 = rep3 + parseInt(df) - parseInt(shuzixiao);
                                                            f = 1;
                                                            console.log('jinglail111111' + a);
                                                        } else if (df < shuzixiao) {
                                                            f = 1;
                                                        }

                                                    }

                                                }
                                                for (let b = 0; b < JSON.parse(rere).length; b++) {
                                                    var df = JSON.parse(rer4[b]).money;
                                                    //console.log('df'+df+'rer'+rer);
                                                    if (JSON.parse(r)[a] == JSON.parse(rere)[b]) {
                                                        if (df < shuzi) {//大于allin数的人才可以进下一分奖池，防止allin少的进入

                                                            f = 1;
                                                            console.log('jinlai..' + a);
                                                        }

                                                    }

                                                }
                                                if (f == 0) {
                                                    s.push(JSON.parse(r)[a]);
                                                }
                                                f = 0;

                                            }
                                            redis.hset(JSON.parse(repl)[rep], roomid, JSON.stringify(s));//将数组保存
                                            //处理弃牌的钱再加平时的钱
                                            console.log('shuzi' + shuzi + 'shuzixiao' + shuzixiao);
                                            rep3 += parseInt(s.length * (shuzi - shuzixiao));
                                            redis.hset(jiangchi[rep], roomid, rep3);//将钱数放到奖池中
                                            console.log('当前' + jiangchi[rep] + '为' + rep3);

                                            console.log('剩余下一个奖池的钱为' + (jiang - rep3));//第一个奖池放完之后
                                            rep++;
                                            console.log(jiangchi[rep] + 'jiangchishi');

                                            var sssss = (jiang - rep3);
                                            redis.hset(jiangchi[rep], roomid, sssss);//剩下没分的放到第二个奖池，然后看下一个allin的数目，依次循环


                                            //然后开始向下一个奖池放用户

                                            redis.hset('jiangchinum', roomid, rep);
                                            var ds = [];
                                            redis.hmget('Message', s, (asd12, asd23) => {
                                                for (let a = 0; a < s.length; a++) {
                                                    var ss = JSON.parse(asd23[a]);

                                                    if (ss.money <= shuzi) {
                                                        f = 1;
                                                    }

                                                    if (f == 0) {
                                                        ds.push(s[a]);
                                                    }
                                                    f = 0;
                                                }

                                                redis.hset(JSON.parse(repl)[rep], roomid, JSON.stringify(ds));
                                            });

                                            redis.hget(JSON.parse(repl)[0], roomid, (a, bb) => {
                                                console.log('jiangchi1de user' + bb);
                                            });
                                            redis.hget(jiangchi[0], roomid, (asdasd, asdasdasd) => {
                                                console.log('jiangchi1=' + asdasdasd);
                                            });
                                            redis.hget(JSON.parse(repl)[1], roomid, (a, bb) => {
                                                console.log('jiangchi2de user' + bb);
                                            });
                                            redis.hget(jiangchi[1], roomid, (asdasd, asdasdasds) => {
                                                console.log('jiangchi2=' + asdasdasds);
                                                // 开奖
                                            });

                                            g++;
                                            if (g < shuzu.length) {
                                                console.log('shuzi' + shuzi + 'shuzixiao' + shuzixiao + 'g' + g + 'shuzuqian' + shuzu[g - 1] + 'shuzug' + shuzu[g]);
                                                return jiangchifen(roomid, shuzu, shuzu[(g - 1)], callback, g);
                                            }
                                            else {
                                                kaijiang(roomid, callback);
                                            }


                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}
function kaijiang(roomid, callback) {//给每个玩家把最终的牌和等级记录
    var ccc = [];
    var flag = 0;

    //  rep=0;
    redis.hget('room', roomid, (e0, r0) => {


        redis.hget('qipai', roomid, (e, re) => {
            redis.hget('dipai', roomid, (e1, r1) => {

                var dipai = JSON.parse(r1);//五张底牌

                redis.hmget('Message', JSON.parse(r0), (e2, r2) => {//获取所有人的信息

                    for (let a = 0; a < JSON.parse(r0).length; a++) {
                        for (let b = 0; b < JSON.parse(re).length; b++) {//找弃牌表中的相同数据，不进行结果传输
                            if (JSON.parse(r0)[a] == JSON.parse(re)[b]) {
                                flag = 1;
                            }
                        }
                        if (flag == 0) {
                            var s = JSON.parse(r2[a]).pai;
                            console.log(s + dipai + '000000');
                            s.push.apply(s, dipai);
                            console.log(s);
                            //数组排序 
                            var jiaohuan;
                            for (let c = 0; c < s.length; c++) {//将所有allin的人的钱数排序，从小到大
                                for (let d = c; d < s.length; d++) {
                                    if (s[c] > s[d]) {
                                        jiaohuan = s[c];
                                        s[c] = s[d];
                                        s[d] = jiaohuan;
                                    }
                                }

                            }
                            console.log('s数组' + s);
                            jieguo.onload(s, (aa, shuzu) => {
                                // ccc[num].push(aa);
                                console.log(aa + 'aa' + shuzu + 'shuzu');
                                var ddd = JSON.parse(r2[a]);
                                //  var zuizhongpai=JSON.parse(r2[a]).zuizhongpai;
                                ddd.dengji = aa;
                                ddd.zuizhongpai = shuzu;
                                console.log(ddd.dengji + 'denggji' + ddd.zuizhongpai + 'pai');
                                redis.hmset('Message', JSON.parse(r0)[a], JSON.stringify(ddd));
                            });

                        }

                        flag = 0;
                    }
                    redis.hmget('Message', JSON.parse(r0), (e3, r3) => {
                        for (let c = 0; c < r3.length; c++) {
                            console.log(r3[c] + 'jieguo');
                        }
                        //奖金分配
                        redis.hget('jiangchinum', roomid, (eee, rep) => {//获取记录奖池和用户表的数字

                            redis.hget('jiangchi5', roomid, (a, b) => {
                                redis.hget('jiangchi5user', roomid, (ss, bb) => {
                                    console.log('当前总共奖池数为' + JSON.parse(bb) + '          ' + b);
                                });

                            });
                            jiangjinfenpei(roomid, rep, callback);//将总共的奖池数传过去
                        });
                    });

                });
            });
        });
    });
}

function jiangjinfenpei(roomid, rep, callback) {
    console.log('jindaoQPP来了');
    var dengji = 0;//记录玩家的等级
    var dengjiid = 0;
    var dengjiaaa = [];
    dengjiaaa.splice(0, dengjiaaa.length);
    var pai = 0;

    var lun = rep;
    //  callback(123);
    if (lun >= 0) {
        redis.get('jiangchiuser', (era, repl) => {//获取奖池用户表的名字的数组
            redis.get('jiangchi', (errr, reply) => {//获取奖池表的名字的数组

                var jiangchi = JSON.parse(reply);
                var jiangchiuser = JSON.parse(repl);
                redis.hget(jiangchiuser[lun], roomid, (e0, r0) => {//奖池里的人
                    redis.hget(jiangchi[lun], roomid, (e1, r1) => {//奖池里的钱数
                        redis.hmget('Message', JSON.parse(r0), (e2, r2) => {
                            for (let a = 0; a < JSON.parse(r0).length; a++) {
                                if (JSON.parse(r2[a]).dengji > dengji) {//找到大的就放
                                    dengji = JSON.parse(r2[a]).dengji;
                                    dengjiid = JSON.parse(r0)[a];
                                    pai = parseInt(JSON.parse(r2[a]).zuizhongpai);
                                } else if (JSON.parse(r2[a]).dengji == dengji) {
                                    if (parseInt(JSON.parse(r2[a]).zuizhongpai) > pai) {//一样的话比里面的牌
                                        dengji = JSON.parse(r2[a]).dengji;
                                        dengjiid = JSON.parse(r0)[a];
                                        pai = parseInt(JSON.parse(r2[a]).zuizhongpai);
                                    }
                                }
                            }

                            for (let a = 0; a < JSON.parse(r0).length; a++) {
                                if (JSON.parse(r2[a]).dengji == dengji) {//找到大的就放
                                    if (parseInt(JSON.parse(r2[a]).zuizhongpai) == pai) {//一样的话比里面的牌

                                        dengjiaaa.push(JSON.parse(r0)[a]);

                                    }
                                }
                            }

                            callback(dengjiaaa, r1);
                            lun--
                            if (lun >= 0) {
                                return jiangjinfenpei(roomid, lun, callback);//递归  直到为0  才停止
                            }
                        });

                    });
                });


            });
        });
    }
}
function checkuser(data, callback) {//true 代表可以自动完成后续的流程，因为所有玩家已经无需操作，false 代表不可以
    var id = 0;
    var flag = 0;
    redis.hget('room', data.roomid, (e0, r0) => {
        var room = JSON.parse(r0).length;
        redis.hget('qipai', data.roomid, (e1, r1) => {
            var qipai = JSON.parse(r1).length;
            redis.hget('allin', data.roomid, (e2, r2) => {
                var allin = JSON.parse(r2).length;


                if ((room - 1) == (qipai + allin) || room == (qipai + allin)) {
                    for (let a = 0; a < room; a++) {
                        for (let b = 0; b < qipai; b++) {
                            if (JSON.parse(r0)[a] == JSON.parse(r1)[b]) {
                                flag = 1;
                            }
                        }
                        for (let c = 0; c < allin; c++) {
                            if (JSON.parse(r0)[a] == JSON.parse(r2)[c]) {
                                flag = 1;
                            }
                        }
                        if (flag == 0) {
                            id = JSON.parse(r0)[a];
                        }
                        flag = 0;
                    }

                    redis.hget('zuidazhu', data.roomid, (e4, r4) => {
                        if (r4 == id) {
                            callback('true');//只剩一个人
                        } else if (id == 0) {
                            callback('true');//全部allin   
                        } else if (id != 0) {
                            redis.hmget('Message', id, (e5, r5) => {
                                redis.hmget('Message', r4, (e6, r6) => {
                                    var a = JSON.parse(r5).money;
                                    var b = JSON.parse(r6).money;
                                    if (a == b) {
                                        callback('true');//只剩一个人  但是没allin，注数和最大注的一样，可以自动
                                    } else {
                                        callback('false');
                                    }
                                });
                            });

                        }
                        else {
                            callback('false');
                        }
                    });
                }
                else {
                    callback('false');//还有至少两个人
                }
            });
        });
    });
}
module.exports.qipai = qipai;
module.exports.change = change;
module.exports.allin = allin;
module.exports.xiazhu = xiazhu;
module.exports.jiazhu = jiazhu;
module.exports.fenjiangchi = fenjiangchi;
module.exports.checkuser = checkuser;