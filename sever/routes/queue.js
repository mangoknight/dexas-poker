var express = require('express');
var router = express.Router();
function Queue(size) {
        var list = [];

        //向队列中添加数据
        this.push = function(data) {
            if (data==null) {
                return false;
            }
            //如果传递了size参数就设置了队列的大小
            if (size != null && !isNaN(size)) {
                if (list.length == size) {
                    this.pop();
                }
            }
            list.unshift(data);
            return true;
        }

        //从队列中取出数据
        this.pop = function() {
            return list.pop();
        }

        //返回队列的大小
        this.size = function() {
            return list.length;
        }

        //返回队列的内容
        this.quere = function() {
            return list;
        }
    }



 var queue = new Queue(5);
function chatQueue(param){
    queue.push(param);
    console.log(queue.quere());
    return queue.quere();
  }  
  module.exports.chatQueue=chatQueue;
