///mysql语句组装器 version 0.01    By Sinmor Dhand
var mysql=require('mysql');
///引用配置文件
var config=require('./config');
// 组装插入sql字符串方法////采用｛id:1,name:2｝对象形势传入即可插入，第二个参数是表名
//建立连接池
var pool=mysql.createPool(config.sql);
function Insert(params,table){
    var keys='';
    var values='';
    for(var p in params){
      keys+=p+',';
      values+='"'+params[p]+'"'+',';
    }
var str='INSERT INTO '+table+'('+keys.substr(0,(keys.length-1))+')VALUES('+values.substr(0,(values.length-1))+')';
return str;
};
//更新数据sql字符串方法---------////暂时封装了where条件下的update方法
function Update(params,table,condition){
var key='';
for(var p in params){
 key+=p+'='+'"'+params[p]+'",';
};
key=key.substr(0,(key.length-1));
var condi='';
for(var q in condition){
condi+=reWhere(q,condition[q])+' and ';
};
condi=condi.substr(0,(condi.length-4));
var str='UPDATE '+table+' SET '+key+' WHERE '+condi+'';
return str;
};
//删除数据sql字符串方法---------////暂时封装了where条件下的update方法
function Delete(condition,table){
var wherestr='';
for(var p in condition){
wherestr+=reWhere(p,condition[p])+' and ';
}
var str='DELETE FROM '+table+' where '+wherestr.substr(0,(wherestr.length-4));
return str;
};
//查询数据方法--------///暂时封装了where，orderby,skip,take,count///select内容可以是all也可以某几条
function Select(table,params='*'){
if(params!='*'){
    var key='';
 for(var p in params){
   key+=params[p]+',';
 }  
 params=key.substr(0,(key.length-1));
};
this.query=' select '+params+' from '+table;
///where方法
this.Where=(condition)=>{
var wherestr='';
for(var p in condition){
wherestr+=reWhere(p,condition[p])+' and ';
}
this.query+=' where '+wherestr.substr(0,(wherestr.length-4));
return this;
};
///orderby方法,true代表升序，false代表降序
this.OrderBy=(condition)=>{
var wherestr='';
for(var p in condition){
if(condition[p]!=false){
 wherestr+=p+',';
}else{
    wherestr+=p+' desc '+',';
}
};   
this.query+=' order by '+wherestr.substr(0,(wherestr.length-1));
return this;
};
///分页方法 ,take
this.Take=(skip,take)=>{
this.query+=' limit '+skip+','+take;
return this;
};
 return this;
};
//执行sql语句方法,第一个参数为生成的sql语句,第二个为回调方法
function Doit(sql,callback){
 pool.getConnection(function(err,conn){  
        if(err){  
            callback(err,null,null);  
        }else{  
            conn.query(sql,function(qerr,vals,fields){  
                //释放连接  
                conn.release();  
                //事件驱动回调  
                callback(qerr,vals,fields);  
            });  
        }  
    });  

};
//拼接where字符串用的方法
function reWhere(key,values)
{var panduan=key.substr(0,2);
 var fuhao='';   
  switch(panduan){
  case "D_":
  key=key.substr(2,key.length);
  fuhao='>=';
  break;
  case "d_":
  key=key.substr(2,key.length);
  fuhao='>';
  break;
  case "X_":
  key=key.substr(2,key.length);
  fuhao='<='
  break;
  case "x_":
  key=key.substr(2,key.length);
  fuhao='<'
  break;
  default:
  fuhao='='
  }; 
return key+' '+fuhao+' "'+values+'"';
};
// create trigger after_register_add
// on register
// for insert
// as
// declare @User_Id BIGINT
// select  @User_Id  = id from inserted;
// insert into user (User_Id) values (@User_Id)

module.exports.Insert=Insert;
module.exports.Update=Update;
module.exports.Delete=Delete;
module.exports.Select=Select;
module.exports.Doit=Doit;