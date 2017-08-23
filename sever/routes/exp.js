var sqlcmd=require("../model/sqlcmd");
function shengji(msg,callback){
    var select=new sqlcmd.Select('user',["lv","Exp"]).Where({User_Id:msg.id}).query;
    sqlcmd.Doit(select,(a,b)=>{
        var lvv=b[0].lv;
        var jingyan=b[0].Exp;
        var exp=0;
        console.log('exp==================='+lvv+"        "+jingyan);
        var selc=new sqlcmd.Select('exp',["Exp","add","reduce"]).Where({lv:lvv}).query;
        sqlcmd.Doit(selc,(c,d)=>{
            console.log(c);
            if(c==null){
            var sheng=d[0].Exp;
            console.log('exp==================='+lvv+" "+jingyan+" "+sheng);
            if(msg.ss=='win'){
                exp=d[0].add;
            }else if(msg.ss=='lose'){
                exp=d[0].reduce;
            }
            if(jingyan+exp>=sheng){
                lvv++;
                jingyan=jingyan+exp-sheng;
            }else{
                jingyan+=exp;
            }
            console.log('exp==================='+lvv+" "+jingyan+" "+sheng);
            
            var update = sqlcmd.Update({ Lv: lvv, Exp: jingyan }, 'user',{ User_Id: msg.id});
             sqlcmd.Doit(update,(f,g)=>{
                 if(f==null){
                     callback(lvv,jingyan);
                 }
             });
            }
        });
    });
}
module.exports.shengji=shengji;