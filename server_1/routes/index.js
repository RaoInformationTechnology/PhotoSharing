var express = require('express');
var router = express.Router();
var { generateToken, sendToken } = require('../utils/token.utils');
var passport = require('passport');
var config = require('../config');
var request = require('request');
require('../passport');
const expressJwt = require('express-jwt');

/* GET home page. */
 router.get('/', function(req, res, next) {
   res.render('index', { title: 'Express' });
 });

 var authenticate = expressJwt({
  secret: 'my-secret',
  requestProperty: 'auth',
  getToken: function(req) {
       console.log("*******************************************")
    if (req.headers['x-auth-token']) {
      return req.headers['x-auth-token'];
    }
    return null;
  }
});

router.post('/auth/facebook', function(req, res, next) {
        console.log('req=============================>',req.body)
        if (!req.body.accessToken) {
            return res.send(401, 'User Not Authenticated');
        }
        req.auth = {
            id: req.user.id
        };
        console.log(req.auth)

        next();
    }, generateToken, sendToken);

// router.route('/auth/google')
//     .post(passport.authenticate('google-token', {session: false}), function(req, res, next) {
//         if (!req.user) {
//             return res.send(401, 'User Not Authenticated');
//         }
//         req.auth = {
//             id: req.user.id
//         };

//         next();
//     }, generateToken, sendToken);

module.exports = router;





