var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    twitter_id : { type: String, required: true, unique: true },
    name: String,
    age: Number
});

//3つめの引数はコレクション名
module.exports = mongoose.model('User', UserSchema, 'user');