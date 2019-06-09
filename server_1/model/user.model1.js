var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

SALT_WORK_FACTOR = 10;  
var UserSchema = new mongoose.Schema({  

	firstName: String,
	lastName:String,
	email: String,
	password: String,
	facebookId: String,
	token: String,
		// email: String,
		name: String,
		friends:[{ type: Schema.Types.ObjectId, ref: 'User'}],
	});

// UserSchema.pre('save', function(next) {
//     var user = this;
//     console.log("Im Model=====================>", user);
//     // if (!user.isModified('password')) return next();

//     bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
//         if (err) return next(err);
//         bcrypt.hash(user.password, salt, function(err, hash) {
//             if (err) return next(err);
//             console.log(hash);
//             user.password = hash;
//             next();
//         });
//     });
// });

module.exports = mongoose.model('User', UserSchema);