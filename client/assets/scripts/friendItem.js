cc.Class({
    extends: cc.Component,

    properties: {
        nameL:cc.Label,
        // ...
    },

    // use this for initialization
    init: function (name) {
       this.nameL.string=name;
    },

    // called every frame
    update: function (dt) {

    },
});
