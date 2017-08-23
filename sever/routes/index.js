var express = require('express');
var router = express.Router();
var mysql=require("mysql");
var sqlcmd=require("../model/sqlcmd");

router.get('/index1', function(req, res, next) {

var up=sqlcmd.Update({math:50,name:'xinzhengyu'},"hello",{id:5});

var dele=sqlcmd.Delete({D_id:4,name:"xinzhengyu"},"hello");
    //调用查询
    var str=new sqlcmd.Select('hello',["name","id","eng"]).query;
  var str=new sqlcmd.Select('hello',["name","id","eng"]).Where({D_id:4}).OrderBy({id:true,name:false}).Take(0,4).query;
  sqlcmd.Doit(str,(a,b,c)=>{
   console.log(a);
   ///第二个参数b是查询出来的数据哦
   console.log(b);
   console.log(c);
  });
 res.render('index', { title: str});
    
});

module.exports = router;