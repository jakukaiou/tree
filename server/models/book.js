var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var BookSchema = new Schema({
    title:String,
    prev:[Number],
    next:[Number],
    pages:[
        {
            title:String,
            contents:[
                {
                    type:Number,
                    contents:[
                        {
                            type:Number,
                            data:Schema.Types.Mixed
                        }
                    ]
                }
            ]
        }
    ]
});

module.exports = mongoose.model('Book', BookSchema);