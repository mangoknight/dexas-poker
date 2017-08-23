cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        
         webview: cc.WebView
    },

    // use this for initialization
    onLoad: function () {
           this.webview.node.on('loaded', this.callback, this);
           var  m = JSON.parse(cc.sys.localStorage.getItem("UserMessage"));
           
          var url= "https://openapi.alipay.com/gateway.do?timestamp="+this.coverDate()+"&method=alipay.trade.wap.pay&app_id=2017030406044484&sign_type=RSA2&sign=MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCmdj5Pzsg9I/f64Pyk5XGI7dg8gTakwNsIOeHECAsQhhOABIL721vkx83yUkP18CXVhwlhtz+qIhl9IXpCwJmegHZcMT6Kb9Vl6vjhRwGodsPGkniBolTKHkMVfP2imJuLpZ5SA1GENKB6Qn6SG0oTSpA8aEWXidWo3heUWTf+/NRNXuHkuyF1IHZTv8maXyjXbmXMAzPgGr/0jDhQdhQdBK/LQEBvGEDvMqPgWJfKrFwfKml5wmYHHaAboIr6x73iJL58Lc1kXlOeK7vgPUpgNX1ToMMguDsy1zipauugNYy1JoS88vhKNr+J4Ryf1iBt3N51WNEFzl9uVSBXytgdAgMBAAECggEAf5cYceGkd8CvHZv/6oB3gqYT3WSJNsUf3fFHzBMCMBskrTZIE7XyfKxtffRyZPs6dK15km18HfLfKJtVc/7egLAkiMuyDThlECaHt1zOt4q4yuaP+YUsinOhpcHVQyDH8MT0UhZ7D+OqsatwCptiLuEzJyohVWLv4uzAlBPCqO1xaRh9C9FFPeTx9cG8zv9khuwImOFk42RU9bMo7mZrxeRxC/guINXjZG0Yhn+mGUa90PhPvZ4l6bzmQ1SvhQBKqPLzd2qpAm82l0jrf4WP07QC1G2hoXU/8azDTZNeG/p31pWCqELaw2OUXH6qs2oI35FAfVaqXbx5nHFqXhGB/QKBgQDnP/z1+If8wXoilMgi43TV3hzvAxMV1J40USK9WOepz0Rwse1yBJsUDfpJNJ3onBojlKCsDMiey3QCXF7Hdk9BSCDTQszZ/qvrzQacqLmeVzviCbmGwRMQ6paiXYJsBc3b2ZoRqizSLseWGO38YxTS4IyOIx8TNo1eIYeVAz//mwKBgQC4RyDu9qvEKFPTHO2zUaLxfw0a91gvGmWi0i4CS40J0zH5iHIxkY045SbmVzuFBBMIgq3RWjY8y0FodaL+8kpttDzNE/OBsG/4fe5Jkc3oRsh/FCVJmRICRFB7f6rbFY2SfSDsJrfX8ybWT48V5Dq9c9JW12UYxUGCAZo8dUvupwKBgQC+NLqLUqX/tuAPq5LGZ5JFCxF/YmcDUMPjwkyxs3uxB4OCskbcvn8Tyr9wETBFEIjLdUeG3Gjze+LqwjFPHLfpuTsOqWY3dCrSo+vpVTp/y768mEUaWpqlEl9eI03QLiH50AzStMdzBfkyM0UkkBajsQDLNIYt1nQG1ctgPLEaOwKBgA5RWHm4qLfg+kJY6Q8ZtLNWz8nclfly75qrAfAjtp2gzy04MMcxK+vTwiX7eSBopKHwpViyzawDjt1y5mswoB/N9Ttp5W2aK9j+z9jff0Qg28sj4ZHKVt/eNvKhhMDo98r99eTjTT12IvpbzB5DUV0O9rTQn4ZBLUnQng88fd3ZAoGAcpvBj7L1iNgZbfUOxTSC8TnNuexqqZ3dF7Zhy4H0UvwgCrJWYSd6J/Hr+QsEojXrZsdFOd0ZuK9fGA4zFqje+sRtpG+q6IV/XHZA+xZmLtMbAVQoo/TY+aMdhgK7ULQKbVAd8dXYtr2NGX0NZ4XeBGwzW3Ms7gS2VK/aXsB+tH4=&version=1.0&biz_content="+msg;
         var msg={"body":"1金币", "subject":"大乐透", "out_trade_no":"70501111111S001111119", "seller_id":"17854268652", "timeout_express":"90m", "total_amount":1.00, "product_code":"QUICK_WAP_PAY" } ;
           this.webview.url=url+msg;
           console.log(this.webview.url);
           
    },
    callback: function (event) {
       //这里的 event 是一个 EventCustom 对象，你可以通过 event.detail 获取 WebView 组件
       var webview = event.detail;
       //do whatever you want with webview
       //另外，注意这种方式注册的事件，也无法传递 customEventData
    },
     coverDate:function() {
    var date = new Date();
    var fullYear = date.getFullYear();
    var fullMonth = date.getMonth() + 1;
    if (fullMonth < 10) {
        fullMonth = 0 + "" + fullMonth + "";
    }
    var fullDay = date.getDate();
    if (fullDay < 10) {
        fullDay = 0 + "" + fullDay;
    }
    var hours = date.getHours();
    if (hours < 10) {
        hours = 0 + "" + hours;
    }
    var minutes = date.getMinutes();
    if (minutes < 10) {
        minutes = 0 + "" + minutes;
    }
    var seconds = date.getSeconds();
    if (seconds < 10) {
        seconds = 0 + "" + seconds;
    }
    return fullYear + "-" + fullMonth + "-" + fullDay + " " + hours + ":" + minutes + ":" + seconds;
}
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
