var TopClient = require('./phone/topClient').TopClient;
//发送手机验证码

function phone(Phone,Num){
    var client = new TopClient({
    'appkey': '23429454',
    'appsecret': '162b1ca076da84cdb1cde8d305571f6f',
    'REST_URL': 'http://gw.api.taobao.com/router/rest'
    });
 
 client.execute('alibaba.aliqin.fc.sms.num.send', {
    'extend':'',
    'sms_type':'normal',
    'sms_free_sign_name':'聚脉',
    'sms_param':"{name:'" + Num + "',time:'60s'}",
    'rec_num':Phone,
    'sms_template_code':'SMS_13031389'
} , function(error, response) {
    if (!error) console.log(response);
    else console.log(error);
})

}
function GetRandomNum() {
    var Num = "";
    for (var i = 0; i < 4; i++) {
        Num += Math.floor(Math.random() * 10);
    }
    return Num;
};
function getUserid(userid) {
    var auserid = userid + "asd" + new Date().getTime();
    return auserid;
};
function resUserid(auserid) {
    auserid = auserid.split("asd");
    return auserid;
};
function returnmsg(status) {
    this.status = status;
    this.dhand = { status: this.status, msg: { desc: '', userid: 0, portrait: '', name: '', sex: '' } };
    //this.desc='q';
    this.msg = function (desc1 = null, userid = null, portrait = null, name = null, sex = null) {
        //  console.log(this.desc); 
        this.dhand = { status: this.status, msg: { desc: '', userid: 0, portrait: '', name: '', sex: '' } };
        this.dhand.msg.desc = desc1;
        this.dhand.msg.userid = userid;
        this.dhand.msg.portrait = portrait;
        this.dhand.msg.name = name;
        this.dhand.msg.sex = sex;
        this.query = JSON.stringify(this.dhand);
        return this;
    };
    // console.log(this.desc);
    this.query = JSON.stringify(this.dhand);
    return this;
};
function coverDate() {
    var date = new Date();
    var fullYear = date.getFullYear();
    var fullMonth = date.getMonth() + 1;
    if (fullMonth < 10) {
        fullMonth = 0 + "" + fullMonth + "";
    };
    var fullDay = date.getDate();
    if (fullDay < 10) {
        fullDay = 0 + "" + fullDay;
    };
    var hours = date.getHours();
    if (hours < 10) {
        hours = 0 + "" + hours;
    };
    var minutes = date.getMinutes();
    if (minutes < 10) {
        minutes = 0 + "" + minutes;
    };
    var seconds = date.getSeconds();
    if (seconds < 10) {
        seconds = 0 + "" + seconds;
    }
    return fullYear + "-" + fullMonth + "-" + fullDay + " " + hours + ":" + minutes + ":" + seconds;
};
//------------转化时间函数结束------------------------------------------------/////
module.exports.phone = phone;
module.exports.GetRandomNum = GetRandomNum;
module.exports.getUserid = getUserid;
module.exports.resUserid = resUserid;
module.exports.returnmsg = returnmsg;
module.exports.coverDate = coverDate;