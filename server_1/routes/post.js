var express = require('express');
var router = express.Router();

var postController = require('./../controller/post.controller');
const postValidation = require('./../validation/postValidation');

/* GET users listing. */
router.post('/addpost',postController.addPost);
router.post('/like',[postValidation.likePost],postController.likePost);

router.get('/get-all-post',postController.getAllPost);
router.get('/get-post-by-id/:userId',postController.getPostByUserId);
router.get('/get-my-friends-post/:userId',postController.getMyFriendsPost);
router.get('/get-post-by-post-id/:postId',postController.getPostBYPostId)
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.put('/updatepost/:postId',postController.updatePostById);

router.delete('/delete-post-by-id/:postId',postController.deletePost);



module.exports = router;
