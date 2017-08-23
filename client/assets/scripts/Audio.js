cc.Class({
    extends: cc.Component,

    properties: {
        Homebgm: {
            default: null,
            url: cc.AudioClip
        },
        Tablebgm:{
            default:null,
            url:cc.AudioClip
        },
        call:{
            default:null,
            url:cc.AudioClip
        },
        check:{
            default:null,
            url:cc.AudioClip
        },
        fold:{
            default:null,
            url:cc.AudioClip
        },
        raise:{
            default:null,
            url:cc.AudioClip
        },
        bet:{
            default:null,
            url:cc.AudioClip
        },
        win:{
            default:null,
            url:cc.AudioClip
        },
        shouqian:{
            default:null,
            url:cc.AudioClip
        },
        deal:{
            default:null,
            url:cc.AudioClip
        },
        allin:{
            default:null,
            url:cc.AudioClip
        },
    },


    onLoad: function () {

    },
    playHomeMusic: function() {
        cc.audioEngine.playMusic( this.Homebgm, true );
    },
    playTableMusic:function(){
        cc.audioEngine.playMusic( this.Tablebgm, true );
    },
    pauseMusic: function() {
        cc.audioEngine.pauseMusic();
    },

    resumeMusic: function() {
        cc.audioEngine.resumeMusic();
    },

    _playSFX: function(clip) {
        cc.audioEngine.playEffect( clip, false );
    },

    playWin: function() {
        this._playSFX(this.win);
    },
    playCall: function() {
        this._playSFX(this.call);
    },
    playCheck: function() {
        this._playSFX(this.check);
    },
    playFold: function() {
        this._playSFX(this.fold);
    },
    playRaise: function() {
        this._playSFX(this.raise);
    },
    playShouqian: function() {
        this._playSFX(this.shouqian);
    },
    playDeal: function() {
        this._playSFX(this.deal);
    },
    playBet: function() {
        this._playSFX(this.bet);
    },
    playAll:function() {
        this._playSFX(this.allin);
    },
    

});