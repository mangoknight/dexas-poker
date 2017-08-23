cc.Class({
    extends: cc.Component,

    properties: {
        loadingLabel:cc.Label,
    },

    // use this for initialization
    onLoad: function () {
         var timeCallback = function () {
           this.loadingLabel.string+='.';
        }
        this.schedule(timeCallback, 1, 1, 1);
        // if( this.loadingLabel.string=='loading...'){
        //     cc.director.loadScene('');
        // }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
