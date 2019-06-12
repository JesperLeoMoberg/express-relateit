
var exphbs = require("express-handlebars");
var bodyParser = require('body-parser');
var express = require('express'),
    app     = express(),
    port    = parseInt(process.env.PORT, 10) || 8080;
const router = express.Router();

router.use(bodyParser.json());

const request = require('request');


getPosts("https://jsonplaceholder.typicode.com/posts");
//function for posts

let posts;

function getPosts(url){
  request({url: url, json: true}, (r, body, e) => {
    posts = e;
    countUsers(posts);
  });
}

//function for users
let totalUsers;
function countUsers(list){
  var unique = [];
  for (var i=0; i<posts.length;i++){
    if (!unique.includes(posts[i].userId)){
      unique.push(posts[i].userId);
    }
  }
  totalUsers = unique.length;
}





//routes

router.get('/', function (req, res){
  res.render('index');
});

router.get('/list', function (req, res){
  res.render('list');
});
//for api functions
router.get('/api/users', (req, res) => {
  res.json(posts);
});

router.get('/api/users/count', (req, res) => {
  res.json({users: totalUsers});
});

router.get('/api/users/:id', (req, res) => {
  const found = posts.some(user => user.userId === parseInt(req.params.id));
    if (found){
      res.json(posts.filter(user => user.userId === parseInt(req.params.id)));
    } else {
      res.status(400).json({message: `no user(s) with the ID og ${req.params.id}`});
    }
});
//for posts
router.get('/api/posts', (req, res) => {
  res.json(posts);

});

router.get('/api/posts/count', (req, res) => {
  res.json({posts: posts.length});
});

router.get('/api/posts/:id', (req, res) => {
  const found = posts.some(post => post.id === parseInt(req.params.id));
  if (found) {
    res.json(posts.filter(post => post.id === parseInt(req.params.id)));
  }else{
    res.status(400).json({message: `No posts with the ID of ${req.params.id}`});
  }
});

module.exports = router;
