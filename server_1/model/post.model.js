var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var postSchema = new Schema({
	content: String,
	images:String,
	userId:{type:Schema.Types.ObjectId,ref:"user"},
	like:[{
		type:Schema.Types.ObjectId,
		ref:"user"
	}],
	comment:[{
		type:Schema.Types.ObjectId,
		ref:"comment"
	}],
	created_date: {
		type: Date,
		default: new Date()
	},
	isLiked:{type:Boolean, default: false},
	
});


module.exports =  mongoose.model('post', postSchema);