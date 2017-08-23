 var crypto = require('crypto');
 function jiami(aa)
{
   
    var hash = crypto.createHash("md5");
    hash.update(new Buffer(aa, "binary"));
    var encode = hash.digest('hex');
    return encode;
}
module.exports.jiami=jiami;