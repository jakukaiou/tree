var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var BookSchema = new Schema({
    bookID:Number,
    title:String,
    prev:[{bookID:Number,title:String}],
    next:[{bookID:Number,title:String}],
    pageCount:Number,
});

module.exports = mongoose.model('Book', BookSchema,'book');