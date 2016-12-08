var express = require('express');
var mongoose = require('mongoose');

// Data models
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});


router.get('/posts', function(request, response, next){
  Post.find(function(err, posts){
    if(err) { return next(err)};

    response.json(posts);
  });
});

router.post('/posts', function(req, res, next){
  var post = new Post(req.body);

  post.save(function(err, post){
    if(err) { return next(err)};

    res.json(post);
  });
});

router.get('/posts/comments', function(req, res, next){



});

module.exports = router;
