var express = require('express');
var commentModel = require('../model/comment.model');
var postModel = require('../model/post.model');
var userModel = require('../model/user.model');
var commentController = {};
var ObjectId = require('mongodb').ObjectId;

commentController.addComment = function(req,res){
	console.log("req.body============>",req.body);
	var Comment = new commentModel(req.body);	

	Comment.save((err,comments)=>{
		if(err){
			res.status(500).send(err)
		}else{
			var comment = req.body.comment;
			var postId = req.body.postId;
			var userId = req.body.userId;
			// console.log('userId,postId,comment===================>',req.body.postId,req.body.userId,comments);
			


			postModel.findOne({_id:postId})

			.exec((err,post)=>{
				if(err){
					res.status(500).send(err)
				}else{
					console.log('post============================>',post);
					console.log('comment=============================>',comments)
					post.comment.push(comments._id);
					post.save();
					res.status(200).send(comments);
				}
			})
			
		}
	})
}


// commentController.getComment = function(req,res){
// 	console.log("request()()()()",req);
// 	var userId = req.params.id;
// 	console.log("user ID ===============+>" , userId);
// 	var postId = req.params.postId;
// 	console.log("post**********",postId);
// 	var comment = req.body._id;
// 	console.log("comment[][][]",comment);
// 	postModel
// 	.findOne({ _id: postId })
// 	.populate('comment')
// 	.exec((err, result)=>{
// 		if (err) { res.status(500).send(err); }

// 		result.comment.push(userId);
// 		result.save();
// 		res.status(200).send(result);
// 	})
// }





module.exports = commentController;