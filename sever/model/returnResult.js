var config = require('../model/config');
var clisent = require("redis")
    , redis = clisent.createClient(config.redis.port, config.redis.host, config.redis.opts);

var shuzu = [],
    min = 0,
    max = 0,
    puke = [],
    userpai = [],
    dengji = 0;

/*
    1-13 红桃          1   2   3   4   5   6   7   8   9   10    11   12   13
    14-26 黑桃         14 15   16  17  18  19  20  21  22  23    24   25   26 
    27-39 方片         27 28   29  30  31  32  33  34  35  36    37   38   39
    40-52 梅花         40 41   42  43  44  45  46  47  48  49    50   51   52
    
    
    同花顺＞四条＞葫芦(豪斯)＞同花＞顺子＞三条＞两对＞一对＞高牌
    9       8     7         6     5     4     3     2     1
*/
// use this for initialization
function onload(c,callback) { 
    shuzu.splice(0,shuzu.length);
   
    /*userpai[0]=1;
    userpai[1]=9;
    userpai[2]=10;
    userpai[3]=11;
    userpai[4]=12;
    userpai[5]=13;
    userpai[6]=52;*/
    userpai = c;
    
    console.log('传进来的数组'+c);
    for (var i = 0; i < 14; i++) {
        puke[i] = 0;
    }
    var a = tiqu();
    console.log("等级为：" + a);
    var fff = aaaa();
    console.log(fff + 'fff');
    userpai = [];
    puke = [];
    callback(a, fff);
}

//手牌的判断
function shoupai(roomid, callback) {
    var a, b;
    redis.hget('Message', roomid + 'you', (e, r) => {
        redis.hget('Message', roomid + 'zuo', (e1, r1) => {
            var you = JSON.parse(r);
            var zuo = JSON.parse(r1);
            console.log(you.pai + ' returnresult  pai ' + zuo.pai);
            pai(you.pai, (dengji1, dengji2) => {
                pai(zuo.pai, (dengji3, dengji4) => {
                    a = dengji1;
                    b = dengji2;
                    if (dengji1 < dengji3) {
                        a = dengji3;
                    }
                    if (dengji2 < dengji4) {
                        b = dengji4;
                    }
                    console.log('a  b' + a + b);
                    callback(a, b);
                });
            });

        });
    });

}
function pai(shuzu, callback) {//dengji1 1同花 2同花连  dengji2  1连牌  2对子  3对A
    var a = shuzu;
    // a.push(30);
    // a.push(12);
    var dengji1 = 0;
    var dengji2 = 0;
    var qian = a[0] % 13;
    var hou = a[1] % 13;
    //判断同花   同花连牌
    if (a[1] > 0 && a[1] < 14 && a[0] > 0 && a[0] < 14) {
        dengji1 = 1;
        if (a[0] + 1 == a[1] || a[1] + 1 == a[0]) {//连牌
            dengji1 = 3;
        }

    }
    else if (a[1] > 13 && a[1] < 27 && a[0] > 13 && a[0] < 27) {
        dengji1 = 1;
        if (a[0] + 1 == a[1] || a[1] + 1 == a[0]) {//连牌
            dengji1 = 3;
        }
    }
    else if (a[1] > 26 && a[1] < 40 && a[0] > 26 && a[0] < 40) {
        dengji1 = 1;
        if (a[0] + 1 == a[1] || a[1] + 1 == a[0]) {//连牌
            dengji1 = 3;
        }
    }
    else if (a[1] > 39 && a[1] < 53 && a[0] > 39 && a[0] < 53) {
        dengji1 = 1;
        if (a[0] + 1 == a[1] || a[1] + 1 == a[0]) {//连牌
            dengji1 = 3;
        }
    }//判断连牌 对子  对A


    if (qian + 1 == hou || hou + 1 == qian) {//连牌
        dengji2 = 1;
    }
    else {
        if (qian == hou) {//duizi
            dengji2 = 2;
            if (qian == 1) {//duiA
                dengji2 = 3;
            }
        }
    }

    console.log('dengji1  ' + dengji1 + 'dengji2  ' + dengji2);

    callback(dengji1, dengji2);

}
function aaaa() {
    var jieguo = '';
    for (var i = 0; i < 5; i++) {
        console.log("第" + i + "位：" + shuzu[i]);
        if (shuzu[i] == 1) {
            jieguo += 14;
        } else if (shuzu[i] > 1 && shuzu[i] < 10) {
            jieguo += 0;
            jieguo += shuzu[i];
        }
        else {
            jieguo += shuzu[i];
        }

    }
    console.log(jieguo + 'jieguo0000000000000000000000000000');
    return jieguo;
}
function tiqu() {//提取数组里面的不同花色的张数，然后进行下一步操作

    var hong = 0;
    var fang = 0;
    var mei = 0;
    var hei = 0;
    var c = 0;

    var shun = 0;
    var count = 0;
    for (var i = 0; i < userpai.length; i++)//统计收到用户7张牌后，每个花色的张数
    {
        if (userpai[i] > 0 && userpai[i] < 14) {
            hong++;
        }
        else if (userpai[i] > 13 && userpai[i] < 27) {
            hei++;
        }
        else if (userpai[i] > 26 && userpai[i] < 40) {
            fang++;
        }
        else if (userpai[i] > 39 && userpai[i] < 53) {
            mei++;
        }

    }
    if (hong >= 5 || hei >= 5 || fang >= 5 || mei >= 5) {//说明是同花，不可能出现葫芦和四条，同花比三条和顺子大，所以不考虑之后的，直接将相同花色的装入五张牌的数组进行比较
        if (hong >= 5) {
            for (var i = (userpai.length) - 1; i >= 0; i--) {
                if (userpai[i] < 14) {
                    shuzu[c] = userpai[i];
                    c++;
                }

            }
        }
        else if (hei >= 5) {
            for (var i = (userpai.length) - 1; i >= 0; i--) {
                if (userpai[i] > 13 && userpai[i] < 27) {
                    shuzu[c] = userpai[i];
                    c++;
                }
            }

        }
        else if (fang >= 5) {
            for (var i = (userpai.length) - 1; i >= 0; i--) {
                if (userpai[i] > 26 && userpai[i] < 40) {
                    shuzu[c] = userpai[i];
                    c++;
                }
            }
        }
        else if (mei >= 5) {
            for (var i = ((userpai.length) - 1); i >= 0; i--) {
                if (userpai[i] > 39 && userpai[i] < 53) {
                    shuzu[c] = userpai[i];
                    c++;
                }
            }
        }
        xiugaishuzu();//统计完成之后，对里面的牌进行一个处理，选出最大
        return panduan();//进行大小判断
    } else {//统计每种牌  排除同花

        for (var i = 0; i < userpai.length; i++) {//先把牌放到一个计算每种牌个数的数组里，数组的i就是牌的大小，数组的值就是该大小的牌的张数
            if (userpai[i] % 13 != 0) {
                c = userpai[i] % 13;
            }
            else {
                c = 13;
            }
            puke[c]++;
        }

        if (shunzi()) {//判断顺子
            if (puke[1] >= 1) { count++; }
            if (puke[10] >= 1) { count++; }
            if (puke[11] >= 1) { count++; }
            if (puke[12] >= 1) { count++; }
            if (puke[13] >= 1) { count++; }
            if (count == 5) {
                dengji = 5;
                console.log(userpai+"最大的顺子"+puke);
                shuzu[0]=1;
                shuzu[1]=13;
                shuzu[2]=12;
                shuzu[3]=11;
                shuzu[4]=10;
                return dengji;
            }
            else {
                for (var a = 13; a >= 5; a--) {//倒着往回找  从12开始，看看有没有联续的五个位置都为1，说明有顺子
                    if (puke[a] >= 1) {
                        for (var i = a - 1; i > a - 5; i--) {//开始查找
                            if (puke[a] >= 1 && puke[a - 1] >= 1 && puke[a - 2] >= 1 && puke[a - 3] >= 1 && puke[a - 4] >= 1) {//找到之后进行修改
                                shuzu[0] = a;
                                shuzu[1] = a - 1;
                                shuzu[2] = a - 2;
                                shuzu[3] = a - 3;
                                shuzu[4] = a - 4;
                                shun = 1;
                            }
                        }
                    }
                    if (shun === 1) {
                        dengji = 5;
                        console.log("顺子+");
                        return dengji;
                    }

                }
                if (shun !== 1)//没找到的话再往下传
                {

                    return fenlei();

                }

            }
        }//不满足有五种不同的牌时继续往下传
        else { return fenlei(); }

    }
    console.log(shuzu.length);


}
function fenlei() {//找出同一大小的牌的个数，判断4条........
    var length = 0;
    var num = 4;

    for (var g = 0; g < 3; g++) {
        for (var i = 14; i > 0; i--) {//0表示13
            length = shuzu.length;
            if (puke[i] === num && puke[1] != num) {//把张数最多的先放到数组
                for (var k = length; k < puke[i] + length; k++) {
                    if (i !== 0) {
                        shuzu[k] = i;
                    } else {
                        shuzu[k] = 13;
                    }
                }
            }
            else if (puke[1] === num) {
                for (var k = length; k < puke[1] + length; k++) {
                    shuzu[k] = 1;
                }
                puke[1] = 0;
            }
        }
        num--;
    }
    length = shuzu.length;
    if (length < 6) {//长度不够的话往进放单牌，从最大的开始放
        for (var i = 14; i >= 0; i--) {
            if (puke[i] === 1 && shuzu.length < 5 && puke[1] !== 1) {
                shuzu[length] = i;
                length++;
            }
            else if (puke[1] === 1) {
                shuzu[length] = 1;
                puke[1] = 0; length++;
            }

        }
    }


    for (var i = 0; i < 14; i++)//归零puke数组
    {
        puke[i] = 0;
    }
    return butong();

}
function shunzi() {//判断有没有五种以上的牌

    var i = 0;
    var num = 0;
    for (i = 1; i < 14; i++) {
        if (puke[i] >= 1) {
            num++;
            if (num >= 5) {
                return true;
            }
        }
    }
    return false;
}
function panduan() {//判断同花


    if (tonghua()) {
        console.log("同花" + max % 13);

        dengji = 6;
        if (tonghuashun()) {
            console.log("同花顺");
            dengji = 9;
            if (chaojitong()) {
                dengji = 9;
                console.log("超级同花顺");

            }
        }
        return dengji;
    }
}
function butong() {//判断其他

    var num = 0;
    var flag = 0;
    var aa = 0;
    tonghua();
    classify();

    for (var i = 1; i < 14; i++) {

        if (puke[i] !== 0) {
            if (puke[i] == 4) {
                console.log("你的牌为" + "四条" + i);
                aa = 1;
                dengji = 8;
            }
            if (puke[i] == 3) {
                //里面加豪斯和三条的判断方式
                for (var k = 1; k < 14; k++) {
                    if (puke[k] == 2 && k != i) {
                        console.log("你的牌为" + "豪斯" + i);
                        dengji = 7;
                        flag = 1;
                    }

                }
                if (flag === 0) {
                    console.log("你的牌为三条" + i);
                    dengji = 4;
                }
                aa = 1;

            }
            if (puke[i] === 2 && flag === 0) {
                aa = 1;
                console.log("你的牌为" + "对" + i);
                dengji = 2;
                num++;
                if (num == 2) {
                    dengji = 3;
                }

            }

            // console.log(" "+puke[i]);
        }
    }
    if (aa === 0) {
        dengji = 1;
    }
    return dengji;
}

function tonghua() {
    max = min = shuzu[0];
    for (var i = 0; i < 5; i++) {
        if (shuzu[i] > max) {
            max = shuzu[i];
        }

        if (shuzu[i] < min) {
            min = shuzu[i];
        }
        console.log("shuzu" + shuzu[i]);
    }
    if (max - min > 13) {
        //那么他们肯定不是同花
        return false;
    }
    else {
        if (min >= 1 && max <= 13 || min > 13 && max < 27 || min >= 27 && max < 40 || min >= 40 && max <= 52) {
            //继续判断，排除在红桃Q到黑桃3之间的这种情况
            return true;
        }
    }
}
function tonghuashun() {

    if (max - min == 4) {
        return true;
    }
    else if (chaojitong()) {
        return true;
    }
    else {

        return false;
    }
}
function chaojitong() {
    var self = this;
    var count = 0;
    for (var i = 0; i < 5; i++) {
        if (shuzu[i] % 13 == 1) { count++; }
        if (shuzu[i] % 13 == 10) { count++; }
        if (shuzu[i] % 13 == 11) { count++; }
        if (shuzu[i] % 13 == 12) { count++; }
        if (shuzu[i] % 13 == 0) { count++; }
    }
    if (count == 5) {
        return true;
    }
    else {
        return false;
    }
}
function classify() {//分类

    var a;
    for (var i = 0; i < 5; i++) {
        if (shuzu[i] % 13 != 0) {
            shuzu[i] = shuzu[i] % 13;
        }
        else {
            shuzu[i] = 13;
        }
        console.log(shuzu[i] + "  ");
    }
    for (var i = 0; i < 5; i++) {
        a = shuzu[i];
        puke[a]++;
    }
}
function xiugaishuzu() {

    var flag = 0;

    if (shuzu.length > 5) {
        for (var i = 0; i < shuzu.length - 5; i++) {    //第一次判断就有顺子，那么这个是最大的顺子
            if ((shuzu[i] - 1) == shuzu[i + 1] && (shuzu[i] - 2) == shuzu[i + 2] && (shuzu[i] - 3) == shuzu[i + 3] && (shuzu[i] - 4) == shuzu[i + 4]) {
                flag = 1;
                if (shuzu[shuzu.length - 1] == 1 && shuzu[0] == 13) {
                    flag = 0;
                }
            }
            else {//第一次进来没有顺子，那么循环往下查找，找后面的最大顺子
                for (var a = i; a < 3; a++) {
                    if ((shuzu[a] - 1) == shuzu[a + 1] && (shuzu[a] - 2) == shuzu[a + 2] && (shuzu[a] - 3) == shuzu[a + 3] && (shuzu[a] - 4) == shuzu[a + 4]) {

                        shuzu[0] = shuzu[a];
                        shuzu[1] = shuzu[a + 1];
                        shuzu[2] = shuzu[a + 2];
                        shuzu[3] = shuzu[a + 3];
                        shuzu[4] = shuzu[a + 4];
                        flag = 1;

                    }
                }
            }
        }
        if (flag == 0)//如果不是顺子 并且有1，那么1最大，应该替换数组中最小的那一个
        {
            for (var i = 0; i < shuzu.length; i++) {
                if (shuzu[i] == 1) {

                    shuzu[4] = 1;
                    console.log("you 1");

                }
            }
        }

    }
}


module.exports.onload = onload;
module.exports.shoupai = shoupai;