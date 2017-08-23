var config = require('../model/config');
var clisent = require("redis")
  , redis = clisent.createClient(config.redis.port, config.redis.host, config.redis.opts);

var Suit = {
    "Spade": 1,   // 黑桃
    "Heart": 2,   // 红桃
    "Club": 3,    // 梅花(黑)
    "Diamond": 4, // 方块(红)
};

var A2_10JQK = 'NAN,A,2,3,4,5,6,7,8,9,10,J,Q,K'.split(',');

/**
 * 扑克牌类，只用来表示牌的基本属性，不包含游戏逻辑，所有属性只读，
 * 因此全局只需要有 52 个实例（去掉大小王），不论有多少副牌
 * @class Card
 * @constructor
 * @param {Number} point - 可能的值为 1 到 13
 * @param {Suit} suit
 */
function Card (point, suit) {
    Object.defineProperties(this, {
        point: {
            value: point,
            writable: false
        },
        suit: {
            value: suit,
            writable: false
        },
        /**
         * @property {Number} id - 可能的值为 0 到 51
         */
        id: {
            value: (suit - 1) * 13 + (point - 1),
            writable: false
        },
        //
        pointName: {
            get: function () {
                return A2_10JQK[this.point];
            }
        },
        suitName: {
            get: function () {
                return Suit[this.suit];
            }
        },
        isBlackSuit: {
            get: function () {
                return this.suit === Suit.Spade || this.suit === Suit.Club;
            }
        },
        isRedSuit: {
            get: function () {
                return this.suit === Suit.Heart || this.suit === Suit.Diamond;
            }
        },
    });
}

Card.prototype.toString = function () {
    return this.suitName + ' ' + this.pointName;
};

// 存放 52 张扑克的实例
// var cards = new Array(52);

Card.fromId = function (id) {
    return cards[id];
    
};

// 初始化所有扑克牌
// (function createCards () {
//     for (var s = 1; s <= 4; s++) {
//         for (var p = 1; p <= 13; p++) {
//             var card = new Card(p, s);
//             cards[card.id] = card;
            
//         }
//     }
// })();


/**
 * 扑克管理类，用来管理一副或多副牌
 * @class Decks
 * @constructor
 * @param {number} numberOfDecks - 总共几副牌
 */
// function Decks (numberOfDecks) {
//     // 总共几副牌
//     this._numberOfDecks = numberOfDecks;
//     // 还没发出去的牌
//     this._cardIds = new Array(numberOfDecks * 52);

//     this.reset();
// }

// /**
//  * 重置所有牌
//  * @method reset
//  */
// Decks.prototype.reset = function () {
//     this._cardIds.length = this._numberOfDecks * 52;
//     var index = 0;
//     var fromId = this.Card.fromId;
//     for (var i = 0; i < this._numberOfDecks; ++i) {
//         for (var cardId = 0; cardId < 52; ++cardId) {
//             this._cardIds[index] = fromId(cardId);
//             ++index;
//         }
//     }
// };

/**
 * 随机抽一张牌，如果已经没牌了，将返回 null
 * @method draw
 * @return {Card}
 */

    

       
       function draw (roomid,shuzu) {



       
        var cardIds = shuzu;
        var len = cardIds.length;
    
        if (len === 0) {
            return null;
        }

        var random = Math.random();
        var index = (random * len) | 0;
        //var result = cardIds[index];

        // // 保持数组紧凑
        // var last = cardIds[len - 1];
        // cardIds[index] = last;
        // cardIds.length = len - 1;
        
        if(cardIds[index]!=0&&cardIds[index]!=null){
            var result = cardIds[index];
              console.log('此时生成的牌是'+result);
            cardIds[index]=0;
            redis.hset('card',roomid,JSON.stringify(cardIds));
          
            return result;
        }else{
            return draw(roomid,shuzu);
        }
        
          
           
        
    
    
};

        
     
    


///**
// * 发一张牌
// * @method deal
// * @return {Card}
// */
//Decks.prototype.deal = function () {
//    this._cardIds.pop();
//};

///**
// * 洗牌
// * @method shuffle
// */
//Decks.prototype.shuffle = function () {
//    shuffleArray(this._cardIds);
//};
//
///**
// * Randomize array element order in-place.
// * Using Durstenfeld shuffle algorithm.
// * http://stackoverflow.com/a/12646864
// */
//function shuffleArray(array) {
//    for (var i = array.length - 1; i > 0; i--) {
//        var j = (Math.random() * (i + 1)) | 0;
//        var temp = array[i];
//        array[i] = array[j];
//        array[j] = temp;
//    }
//    return array;
//}

module.exports.draw= draw;
module.exports.Card=Card;
