'use strict';

// require('./mongoose')();
var passport = require('passport');

var FacebookTokenStrategy = require('passport-facebook-token').Strategy;
var GoogleTokenStrategy = require('passport-google-token').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('./model/user.model');
var config = require('./config');

module.exports = function (passport) {
console.log("------------------*************------------")
     passport.use(new FacebookStrategy({
        clientID: config.facebookAuth.clientID,
        clientSecret: config.facebookAuth.clientSecret,
        callbackURL: config.facebookAuth.callbackURL
      },
        function (accessToken, refreshToken, profile, done) {
           // process.nextTick(function(){
               console.log("--------------------------------------------------------->>>>>>",accessToken)
                User.findOne({'facebook.id': profile.id}, function(err, user){
                    if(err)
                        return done(err);
                    if(user)
                        return done(null, user);
                    else {
                        var newUser = new User();
                        newUser.facebook.id = profile.id;
                        newUser.facebook.token = accessToken;
                        newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                        newUser.facebook.email = profile.emails[0].value;

                        newUser.save(function(err){
                            if(err)
                                throw err;
                            return done(null, newUser);
                        })
                        console.log(profile);
                    }
                });
            // });
        }));

//     passport.use(new GoogleTokenStrategy({
//             clientID: config.googleAuth.clientID,
//             clientSecret: config.googleAuth.clientSecret
//         },
//         function (accessToken, refreshToken, profile, done) {
//             User.upsertGoogleUser(accessToken, refreshToken, profile, function(err, user) {
//                 return done(err, user);
//             });
//         }));

//     passport.use(new FacebookStrategy({
//         clientID: config.facebookAuth.clientID,
//         clientSecret: config.facebookAuth.clientSecret,
//         callbackURL: config.facebookAuth.callbackURL
//       },
//       function(accessToken, refreshToken, profile, done) {
//             process.nextTick(function(){
//                 User.findOne({'facebook.id': profile.id}, function(err, user){
//                     if(err)
//                         return done(err);
//                     if(user)
//                         return done(null, user);
//                     else {
//                         var newUser = new User();
//                         newUser.facebook.id = profile.id;
//                         newUser.facebook.token = accessToken;
//                         newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
//                         newUser.facebook.email = profile.emails[0].value;

//                         newUser.save(function(err){
//                             if(err)
//                                 throw err;
//                             return done(null, newUser);
//                         })
//                         console.log(profile);
//                     }
//                 });
//             });
//         }

//     ));
};