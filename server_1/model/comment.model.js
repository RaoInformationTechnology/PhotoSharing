var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var commentSchema = new Schema({
	postId:{type:Schema.Types.ObjectId,ref:"post"},
	userId:{type:Schema.Types.ObjectId,ref:"user"},
	comment:String
	
});


module.exports =  mongoose.model('comment', commentSchema);