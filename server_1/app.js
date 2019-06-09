var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors');
var router = express.Router(); 
var bodyParser = require('body-parser');
// const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const request = require('request');
// const passport = require('passport');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postRouter = require('./routes/post');
var commentRouter = require('./routes/comment');
var multer  = require('multer')


// var { generateToken, sendToken } = require('./utils/token.utils');
var passport = require('passport');
var app = express();
var corsOption = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['x-auth-token']
};
 require('./passport')(passport);
var FacebookTokenStrategy = require('passport-facebook-token').Strategy;
app.use(cors(corsOption));

mongoose.connect('mongodb://localhost:27017/photosharing_1', {useNewUrlParser: true})

.then(() => console.log("Connected"))
.catch(err => console.log(err));




// var UserController = require('./controller/user.controller');
// app.use('/api/auth', UserController);

app.use(passport.initialize());
app.use(passport.session());




//token handling middleware
const authenticate = expressJwt({
  secret: 'my-secret',
  requestProperty: 'auth',
  getToken: function(req) {
    if (req.headers['x-auth-token']) {
      return req.headers['x-auth-token'];
    }
    return null;
  }
});


const getCurrentUser = function(req, res, next) {
  User.findById(req.auth.id, function(err, user) {
    if (err) {
      next(err);
    } else {
      req.user = user;
      next();
    }
  });
};

var getOne = function (req, res) {
  var user = req.user.toObject();

  delete user['facebook'];
  delete user['__v'];

  res.json(user);
  console.log("res====================>",res)
};

router.route('/auth/me')
.get(authenticate, getCurrentUser, getOne);









// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1', indexRouter);
app.use('/user',usersRouter);
app.use('/post',postRouter);
app.use('/comment',commentRouter);
// app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));
// 
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
