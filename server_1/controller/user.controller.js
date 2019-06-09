var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var User = require('../model/user.model');
var userController = {};
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');
// var VerifyToken = require('./verifyToken');

var multer  = require('multer');
// SALT_WORK_FACTOR = 10;

// CREATES A NEW USER
userController.addUser = function(req, res) {
	console.log('============adduser=============',req.body)
	// var hashedPassword = bcrypt.hashSync(req.body.password, 8);  
	User.findOne({userName:req.body.userName})
	.exec((err,foundUser)=>{
		if(err){
			res.status(500).send(err);
		}else if(foundUser){
			res.status(409).send('user already exists! ');
		}else{
			User.create({
				name : req.body.name,
				userName:req.body.userName,				
				email : req.body.email,
				password : req.body.password
			},
			function (err, user) {
				if (err) {
					return res.status(500).send("There was a problem registering the user.")
				}else{
					console.log('user======================>',user)
					res.status(200).send(user);
				}
			}); 
		}
	})	
}

//GET SINGLE USER BY ID
userController.getSingleUser =  function(req, res, next) {
	console.log(req)
	console.log("req.paras ===>" , req.params.userId);

	User.findById({_id:req.params.userId})
	// 	User.aggregate([

	// 	{
	// 		$lookup:{
	// 			from:'users',
	// 			localField:'friends',
	// 			foreignField:'_id',
	// 			as: 'friends'
	// 		}
	// 	},
	// // { $unwind: '$friends' },

	// ])
	.exec((err, user)=> {
		if (err) return res.status(500).send("There was a problem finding the user.");
		if (!user) return res.status(404).send("No user found.");

		res.status(200).send(user);

	});
}

userController.updateUser = function(req,res){
	console.log("===============userId===============",req.params.userId,req.params.userName);
	console.log("---------------------------",req.body)

	User.findOne({userName:req.params.userName})
	.exec((err,foundUser)=>{
		if(err){
			console.log('err==================>',err);
			res.status(500).send(err)
		}else if(!foundUser){

			User.findOneAndUpdate({_id:req.params.userId}, {$set:{userName:req.params.userName}} ,{upsert:true,new:true},function(err,user){
				if(err){
					console.log('err================>',err)
					res.status(500).send(err);
				}else{		
					console.log('post======================>',user);
					
					// res.status(200).send(user)
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
					let upload = multer({ storage: storage }).single('profilePhoto');

					upload(req, res, (err) => {
						if (err) return res.send({ err: err });
						console.log("req.file",req.file);
						if(req.file){
							req.body.profilePhoto = req.file.filename;
						}else{
								req.body.profilePhoto = user.profilePhoto
							}
						User.findOneAndUpdate({_id:req.params.userId},{$set:{userName:req.params.userName, profilePhoto:req.body.profilePhoto}},{upsert:true, new:true},function(err,post){
							if(err){
								res.status(500).send(err);
							}else{
								console.log("post========================>",post);
								res.status(200).send(post)
							}


						})	
					})

				}
			})
		}
		else{
			console.log('foundUser==================>',foundUser);
			if(foundUser._id == req.params.userId){
				console.log("======================");
				User.findOneAndUpdate({_id:req.params.userId}, {$set:{userName:req.params.userName}} ,{upsert:true,new:true},function(err,user){
					if(err){
						res.status(500).send(err);
					}else{		
						console.log('post======================>',user);
						
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
						let upload = multer({ storage: storage }).single('profilePhoto');

						upload(req, res, (err) => {
							if (err) return res.send({ err: err });
							console.log("req.file",req.file);
							if(req.file){
								req.body.profilePhoto = req.file.filename;
							}else{
								req.body.profilePhoto = user.profilePhoto
							}
							User.findOneAndUpdate({_id:req.params.userId},{$set:{userName:req.params.userName, profilePhoto:req.body.profilePhoto}},{upsert:true, new:true},function(err,post){
								if(err){
									res.status(500).send(err);
								}else{
									console.log("post========================>",post);
									res.status(200).send(post)
								}


							})	
						})

					}
				})

			}else{
				console.log("Try other UserName")
				res.status(409).send("try other username.....")
			}

		}

	})
}

// User.findOneAndUpdate({_id:req.params.userId}, {$set:req.body} ,{upsert:true,new:true},function(err,user){
	// if(err){
	// 	res.status(500).send(err);
	// }else{		
	// 	console.log('post======================>',user);
	// 	User.findOne({userName:req.body.userName})
	// 	.exec((err,foundUser)=>{
	// 		if(err){
	// 			console.log('err==================>',err);
	// 			res.status(500).send(err)
	// 		}else{
	// 			console.log('foundUser==================>',foundUser);
	// 			// res.status(200).send(foundUser);
	// 		}

	// 	})
	// 	res.status(200).send(user)
	// 	let storage = multer.diskStorage({
	// 		destination: function(req, file, cb) {
	// 			console.log("files--------->>>>>>",file);
	// 			cb(null, './uploads/')
	// 		},
	// 		filename: function(req, file, cb) {
	// 			let ext = '';
	// 			console.log("ext")
	// 			if (file.originalname.split(".").length>1) 
	// 				ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);

	// 			cb(null, file.fieldname + '_' + Date.now()+ext)
	// 		}
	// 	})
	// 	let upload = multer({ storage: storage }).single('profilePhoto');

	// 	upload(req, res, (err) => {
	// 		if (err) return res.send({ err: err });
	// 		console.log("req.file",req.file);
	// 		if(req.file){
	// 			req.body.profilePhoto = req.file.filename;
	// 		}
	// 		User.findOneAndUpdate({_id:req.params.userId},{$set:req.body},{upsert:true, new:true},function(err,post){
	// 			if(err){
	// 				res.status(500).send(err);
	// 			}else{
	// 				console.log("post========================>",post);
	// 				res.status(200).send(post)
	// 			}


	// 		})	
	// 	})

	// }
// })
// }








userController.getMyAllFriendsById = function(req,res){
	var currentUser = req.params.userId;
	console.log("id",currentUser);
	User.findOne({_id:currentUser})
	.exec((err,result)=>{
		if(err) {
			res.status(500).send(err);
		}else{
			User.find({'_id': { $in: result.friends }})
			.exec((err, friend)=>{
				if(err) {res.status(500).send(err);}
				console.log("==========&%^$&$$%^$%^%&^%$^",friend);
				res.status(200).send(friend);
			})
		}
	})

}
userController.getMyFollowersById = function(req,res){
	var currentUser = req.params.userId;
	console.log("id",currentUser);
	User.findOne({_id:currentUser})
	.exec((err,foundUser)=>{
		if(err){
			res.status(500).send(err);
		}else{
			User.find({'_id': {$in: foundUser.followers}})
			.exec((err,followers)=>{
				if(err){
					res.status(500).send(err);
				}else{
					console.log('followers================>',followers);
					res.status(200).send(followers);
				}
			})
		}
	})
}


//LOGIN USER

userController.login = function(req, res) {
	console.log("============login==============",req.body);
	User.findOne({ userName: req.body.userName }, function (err, user) {
		if (err) return res.status(500).send('Error on the server.');
		if (!user) return res.status(404).send('No user found.');

		var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
		if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

		var token = jwt.sign({ id: user._id }, config.secret, {
			expiresIn: 86400 

		});
		console.log('token=============>',token);
		res.status(200).send({data:user, auth: true, token: token });
	});

}
//GET ALL USER
userController.getAllUser = function(req,res){
	User.find({})
	User.aggregate([

	{
		$lookup:{
			from:'users',
			localField:'friends',
			foreignField:'_id',
			as: 'friends'
		}
	},
	// { $unwind: '$friends' },

	])
	.exec((err,users)=>{
		if (err) {
			res.status(500).send(err);
		}else if (users){
			console.log('users==================================>',users);
			res.status(200).send(users);
		}else{
			res.status(404).send( { msg : 'Users not found' });
		}
	})
}

//DELETE USER BY ID
userController.deleteUserById = function(req,res){
	User.findOneAndDelete({_id:req.params.userId}).exec((err,user)=>{
		if(err){
			res.status(500).send(err);
		}else{
			console.log(user);
			res.status(200).send(user);
		}
	})
}

userController.checkAvailability = function(req,res){
	console.log('req=========================>',req.body);
	console.log('req.id========>',req.body.id);
	User.findOne({facebookId: req.body.id},function(err,user){
		if(err){
			res.status(500).send(err);
		}
		if(user){
			console.log('user========*************========>',user);
			res.status(200).send(user);
		}else{
			User.create({
				facebookId : req.body.id,
				token : req.body.accessToken,
				name : req.body.name,
			},
			function (err, user) {
				if (err) {
					return res.status(500).send("There was a problem registering the user.")
				}else{
					console.log('user======================>',user)
					res.status(200).send(user);
				}

			}); 
		}
	})
}

userController.searchUser = function(req,res){
	console.log('req,body===================>',req.body);
	var value = req.body.key;
	var id = req.body.userId;
	console.log('search text================>',value);
	User.find({userName:{$regex:value,$options:'i'}},function(err,foundUser){
		if(err){			
			console.log('==============err============',err)
			res.status(500).send(err);
		}else{	
			console.log('res===================>',foundUser)
			res.status(200).send(foundUser)
		}
	})

}

//FOLLOW THE USER

userController.addFriend = function (req,res){
	var currentUser = req.body.requestedUser;
	var user = req.body.userTobeFollowed;
	User.findOne({_id: currentUser},function(err,foundUser){

		if(err){
			res.status(500).send(err);
		}
		var index = foundUser.friends.indexOf(user);
		console.log('index===================>',index);
		if(index != -1){
			res.status(200).send("you already follow ")
		}
		else{
			console.log('user==============>',user);
			console.log("foundeuser===============>",foundUser);
			foundUser.friends.push(user);
			foundUser.save();
			User.findOne({_id:user},function(err,user){
				if(err){
					res.status(500).send(err);
				}
				var index = foundUser.friends.indexOf(currentUser);
				console.log('index===================>',index);
				if(index != -1){
					res.status(200).send("you already follow ")
				}else{
					console.log('user found------------------------------->',user);
					user.followers.push(currentUser);
					user.save();
					res.status(200).send(foundUser);
				}
			})
		}
	})
}

// UNFOLLOW USER
userController.removeFriend = function(req,res){
	var currentUser = req.body.requestedUser;
	var user = req.body.userTobeUnFollowed;
	console.log('user================>',user);
	User.findOne({_id:currentUser},function(err,foundUser){
		console.log("foundUser==========>",foundUser);
		var index = foundUser.friends.indexOf(user);
		console.log(index);
		if(index == -1){
			console.log("user not found");
			res.status(401).send("Bad Request");
		}
		else{
			foundUser.friends.splice(index,1);
			foundUser.save();
			User.findOne({_id:user},function(err,user){
				if(err){
					res.status(500).send(err);
				}
				var index = foundUser.friends.indexOf(currentUser);
				console.log('index===================>',index);
				if(index != -1){
					res.status(200).send("you already unfollow ")
				}
				else{
					console.log('user found------------------------------->',user);
					user.followers.splice(index,1);
					user.save();
					res.status(200).send(foundUser);
				}


			})
		}
		
	})

}


module.exports = userController;