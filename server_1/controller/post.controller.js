var express = require('express');
var postModel = require('../model/post.model');
var userModel = require('../model/user.model');
var postController = {};
var mkdir = require('mkdirp');
var _ = require('lodash');
var path = require('path');
// var dir = require('node-dir');
var fs = require('fs');
var multer  = require('multer');

var ObjectId = require('mongodb').ObjectId;



postController.addPost = function(req,res){
	console.log('req.body=================>',req.body);
	console.log('req.file====================>',req.file);
	var Post = new postModel(req.body);	
	Post.save((err,post)=>{
		if(err){
			res.status(500).send(err);
		}else{
			let storage = multer.diskStorage({
				destination: function(req, file, cb) {
					console.log("files--------->>>>>>",file);
					cb(null, './uploads/')
				},
				filename: function(req, file, cb) {
					let ext = '';
					console.log("ext")
					if (file.originalname.split(".").length>1) 
						ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);

					cb(null, file.fieldname + '_' + Date.now()+ext)
				}
			})
			let upload = multer({ storage: storage }).single('images');

			upload(req, res, (err) => {
				if (err) return res.send({ err: err });
				console.log("req.file",req.file);
// res.send({ file: req.file });
req.body.images = req.file.filename;
// const upload = new postModel(req.body).save();
postModel.findOneAndUpdate({_id:post._id},{$set: req.body}, {upsert:true, new:true},).exec((error,post)=>{
	if (error) res.status(415).send(error);
	console.log("post=======================================================>",post);
	res.status(200).send(post);

// res.status(200).send("post add succesfully")

})

});


		}
	})
}


postController.getAllPost = function(req,res){
	postModel.find({})
	postModel.aggregate([
	{
		$lookup:{
			from:'users',
			localField:'userId',
			foreignField:'_id',
			as: 'userId'
		}
	}

	])
	.exec((err,posts)=>{
		if(err){
			res.status(500).send(err);
		}else{
			console.log('all post====================>',posts)
			res.status(200).send(posts);
		}
	})
}



postController.getPostByUserId = function(req,res){
	var curruntUser = req.params.userId;
	console.log('userid=================>',curruntUser);

	userModel.aggregate([
	{
		$match: { '_id': ObjectId(curruntUser) }
	},

	{
		$lookup:{	
			from:'posts',
			localField:'_id',
			foreignField:'userId',
			as: 'post'
		}

	},
	{
		$unwind:'$post'
	},
	{
		$group:{
			_id:'$_id',
			name:{
				$first:'$name'
			},
			friends:{
				$first:'$friends'
			},
			followers:{
				$first:'$followers'
			},
			userName:{
				$first:'$userName'
			},
			email:{
				$first:'$email'
			},
			password:{
				$first:'$password'
			},
			
			profilePhoto:{$first:'$profilePhoto'},

			post:{
				$push:'$post',
			},

		}
	},





	])


	.exec((err,post)=>{
		if(err){
			res.status(500).send(err);
		}else{
			console.log('post===========================>',post);
			res.status(200).send(post[0]);
		}
	})
}


postController.updatePostById = function(req,res){
	var postId = req.params.postId;
	console.log('postid====================>',postId)
	postModel.findOneAndUpdate({_id:req.params.postId}, req.body ,{upsert:true},function(err,post){
		if(err){
			res.status(500).send(err);
		}else{
			console.log('post======================>',post);
// let storage = multer.diskStorage({
// destination: function(req, file, cb) {
// console.log("files--------->>>>>>",file);
// cb(null, './uploads/')
// },
// filename: function(req, file, cb) {
// let ext = '';
// console.log("ext")
// if (file.originalname.split(".").length>1) 
// ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);

// cb(null, file.fieldname + '_' + Date.now()+ext)
// }
// })
// let upload = multer({ storage: storage }).single('images');

// upload(req, res, (err) => {
// if (err) return res.send({ err: err });
// console.log("req.file",req.file);
// // res.send({ file: req.file });
// req.body.images = req.file.filename;
// postModel.findOneAndUpdate({_id:req.params.postId},{$set:req.body},{upsert:true, new:true},function(err,post){
	if(err){
		res.status(500).send(err);
	}else{
		console.log("post========================>",post);
		res.status(200).send(post)
	}
// })
// })
}	
});
// res.status(200).send(post);
}

postController.getPostBYPostId = function(req,res){
	var postId = req.params.postId;
	console.log("postIid===============>",postId)
	postModel.aggregate([
	{
		$match: { '_id': ObjectId(postId) }
	},
	{
		$lookup:{	
			from:'users',
			localField:'userId',
			foreignField:'_id',
			as: 'userId'
		}
	},
	{
		$unwind:{
			path: '$userId',
			preserveNullAndEmptyArrays: true
		}
	},
	{
		$lookup:{	
			from:'comments',
			localField:'comment',
			foreignField:'_id',
			as: 'comment'
		}
	},
	{
		$unwind: {
			path: '$comment',
			preserveNullAndEmptyArrays: true
		}
	},
	{
		$lookup:{	
			from:'users',
			localField:'comment.userId',
			foreignField:'_id',
			as: 'comment.userId'
		}
	},
	{
		$unwind:{
			path:'$comment.userId',
			preserveNullAndEmptyArrays: true,
		}
	},
	{
		$group:{
			_id:'$_id',
			userId: {$first: '$userId'},
			like:{	$first:'$like'},
			comment:{$push:'$comment'},
			content: {$first:'$content'},
			created_date: {$first:'$created_date'},
			isLiked:{$first:'$isLiked'},
			images: {$first:'$images'},
		}
	},




	]).exec((err,post)=>{
		if(err){
			res.status(500).send(err);
		}else{
			console.log('post========================>',post);
			res.status(200).send(post);
		}
	})
}



postController.deletePost = function(req,res){
	console.log("postIddddddd==========================>",req.params.postId)
	postModel.deleteOne({_id:req.params.postId},function(err,post){
		if(err){
			res.status(500).send(err);
		}else{
			console.log('post============>',post);
			res.status(200).send(post);
		}
	})
}


postController.getMyFriendsPost = function(req,res){
	var currentUser = req.params.userId;


	console.log("current User",currentUser);
// userModel.findOne({_id:currentUser})



userModel.aggregate([
{
	$match: { '_id': ObjectId(currentUser) }
},

{
	$lookup:{	
		from:'posts',
		localField:'friends',
		foreignField:'userId',
		as: 'post'
	}
},
{
	$unwind:{
		path: '$post',
		preserveNullAndEmptyArrays: true
	}
},
{
	$lookup:{	
		from:'users',
		localField:'post.userId',
		foreignField:'_id',
		as: 'post.userId'
	}
},
{
	$unwind:{
		path:'$post.userId',
		preserveNullAndEmptyArrays: true,
	}
},
{
	$unwind:{
		path:'$post.comment',
		preserveNullAndEmptyArrays: true,
	}
},
{
	$lookup:{	
		from:'comments',
		localField:'post.comment',
		foreignField:'_id',
		as: 'post.comment'
	}
},
{
	$unwind: {
		path: '$post.comment',
		preserveNullAndEmptyArrays: true
	}
},
{
	$lookup:{	
		from:'users',
		localField:'post.comment.userId',
		foreignField:'_id',
		as: 'post.comment.userId'
	}
},
{
	$unwind:{
		path:'$post.comment.userId',
		preserveNullAndEmptyArrays: true,
	}
},
{
	$group:{
		_id:'$post._id',
		userId: {$first: '$_id'},
		name:{	$first:'$name'},
		friends:{$first:'$friends'},
		followers:{$first:'$followers'},
		userName:{$first:'$userName'},
		email:{	$first:'$email'},
		profilePhoto:{$first:'$profilePhoto'},
		comment: {$push: '$post.comment'},
		friendsPost:{$first:'$post'},
	}
},
{
	$project: {
		_id: '$userId',
		name: 1,
		friends: 1,
		followers: 1,
		userName: 1,
		profilePhoto: 1,
		email: 1,
		friendsPost: {
			_id: '$friendsPost._id',
			userId: '$friendsPost.userId',
			like: '$friendsPost.like',
			isLiked:'$friendsPost.isLiked',
			comment: '$comment',
			content: '$friendsPost.content',
			created_date: '$friendsPost.created_date',
			images: '$friendsPost.images',
		}
	}
},
{
	$group: {
		_id: '$_id',
		name:{$first:'$name'},
		friends:{$first:'$friends'},
		followers:{$first:'$followers'},
		userName:{$first:'$userName'},
		email:{$first:'$email'},
		profilePhoto:{$first:'$profilePhoto'},
		friendsPost: {
			$push: '$friendsPost'
		}
	}
}

])

.exec((err,post)=>{
	if (err) {
		console.log('err: ', err);
	} else {
		console.log('friends posts======================>',post);
		res.status(200).send(post[0]);
	}
})
}



postController.likePost = function(req,res){
	var postId = req.body.postId;
	console.log('postId=================>',postId);
	var userId = req.body.userId;
	console.log('userId=================>',userId);
	postModel.findOne({_id:postId},function(err,foundPost){
		if(err){
			res.status(500).send(err);
		}
		var index = foundPost.like.indexOf(userId);
		console.log("index===========================//>",index);
		if(index != -1){
			console.log("already liked");
			foundPost.like.splice(index,1);
			foundPost.isLiked = false;
			foundPost.save();
			res.status(200).send(foundPost);
// res.status(401).send("already like");
}

else{
	console.log('foundUser========================>',foundPost);
	foundPost.like.push(userId);
	foundPost.isLiked = true;
	foundPost.save();
	res.status(200).send(foundPost);
}
})
}


postController.disLikePost = function(req,res){
	var postId = req.body.postId;
	console.log('postId=================>',postId);
	var userId = req.body.userId;
	console.log('userId=================>',userId);
	postModel.findOne({_id:postId},function(err,foundPost){
		if(err){
			res.status(500).send(err)
		}
		var index = foundPost.like.indexOf(userId);
		if(index == -1){
			console.log("user not found");
			res.status(401).send("Bad Request")
		}else{
			foundPost.like.splice(index,1);
			foundPost.save();
			res.status(200).send(foundPost);
		}
	})
}










module.exports = postController;