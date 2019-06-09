var express = require('express');
var router = express.Router();
const commentValidation = require('./../validation/commentValidation');


var commentController = require('./../controller/comment.controller');

/* GET users listing. */
router.post('/addcomment',[commentValidation.addComment],commentController.addComment);


router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});



module.exports = router;
