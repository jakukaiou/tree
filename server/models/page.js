var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

//pageIDは1からスタート
var PageSchema = new Schema({
    pageID:Number,
    bookID:Number,
    title:String,
    contents:[
        {
            type:Schema.Types.Mixed,
            data:Schema.Types.Mixed
        }
    ]
})

module.exports = mongoose.model('Page', PageSchema,'page');