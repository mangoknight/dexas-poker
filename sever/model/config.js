///By Sinmor 用来封装整个网站的所有的数据配置文件

///封装数据库连接字段
var sql={
    //ip地址
    host: '127.0.0.1', 
    //用户名 
    user: 'root',  
    //连接密码
    password: '0229',
    //使用数据库名字  
    database: 'dezhou',
    //port: port 
   
};
var redis={
  host:'106.14.40.93',
  port:6379,
  opts:{},
  ///没有密码请填写空字符串
  password:''
};
module.exports.sql=sql;
module.exports.redis=redis;