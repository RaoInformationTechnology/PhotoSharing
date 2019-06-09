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
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
// SALT_WORK_FACTOR = 10;

// CREATES A NEW USER
userController.addUser = function(req, res) {
	var hashedPassword = bcrypt.hashSync(req.body.password, 8);  
	User.create({
		firstName : req.body.firstName,
		lastName: req.body.lastName,
		email : req.body.email,
		password : hashedPassword
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

//GET SINGLE USER BY ID
// router.get('/me', VerifyToken, function(req, res, next) {
	userController.getSingleUser =  function(req, res, next) {
		console.log(req)
		console.log("req.paras ===>" , req.params.userId);

		User.findById({_id:req.params.userId}, function (err, user) {
			if (err) return res.status(500).send("There was a problem finding the user.");
			if (!user) return res.status(404).send("No user found.");

			res.status(200).send(user);

		});
	}



//LOGIN USER
// router.post('/login', function(req, res) {
	userController.login = function(req, res) {
		User.findOne({ email: req.body.email }, function (err, user) {
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

//FOLLOW THE USER

userController.addFriend = function (req,res){
	var currentUser = req.body.requestedUser;
	var user = req.body.userTobeFollowed;
	userModel.findOne({_id: currentUser},function(err,foundUser){
		console.log(foundUser);
		foundUser.friends.push(user);
		foundUser.save();
		res.send(foundUser);
	})
}





// userController.facebook = function(req,res){
// 	console.log("fjkdggggggggggggggggggg")
// 	passport.authenticate('facebook-token', {session: false}), function(req, res, next) {
// 		console.log("req.user")
//         if (!req.user) {
//             return res.send(401, 'User Not Authenticated');
//         }
//         req.auth = {
//             id: req.user.id
//         };

//         next();
//     }, generateToken, sendToken
// }
// userController.facebook = function(req,res){
// console.log("-----------------------facebook----------------------------")
// 	passport.use(new FacebookStrategy({
// 	    clientID: config.facebookAuth.clientID,
// 	    clientSecret: config.facebookAuth.clientSecret,
// 	    callbackURL: config.facebookAuth.callbackURL
// 	  },
// 	  function(accessToken, refreshToken, profile, done) {
// 	    	process.nextTick(function(){
// 	    		User.findOne({'facebook.id': profile.id}, function(err, user){
// 	    			if(err)
// 	    				return done(err);
// 	    			if(user)
// 	    				return done(null, user);
// 	    			else {
// 	    				var newUser = new User();
// 	    				newUser.facebook.id = profile.id;
// 	    				newUser.facebook.token = accessToken;
// 	    				newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
// 	    				newUser.facebook.email = profile.emails[0].value;

// 	    				newUser.save(function(err){
// 	    					if(err)
// 	    						throw err;
// 	    					return done(null, newUser);
// 	    				})
// 	    				console.log(profile);
// 	    			}
// 	    		});
// 	    	});
// 	    }

// 	));

// }


module.exports = userController;