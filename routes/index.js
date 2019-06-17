
var exphbs = require("express-handlebars");
var express = require('express'),
    app     = express(),
    port    = parseInt(process.env.PORT, 10) || 8080;
const router = express.Router();
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
const connection = require('../db/db-connect');

// Passport
const bcrypt = require('bcryptjs');
var passport = require('passport');
require('../passport/passport')(passport);
const { ensureAuthenticated } = require('../passport/auth');

router.use(expressValidator());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));
router.use(cookieParser('secret'));
router.use(session({
    secret: 'I7^dj23ff@9LvB6siu^7$uInxGhMw2',
    resave: false,
    saveUninitialized: true
}));
router.use(passport.initialize());
router.use(passport.session());
router.use(flash());

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
  if(req.isAuthenticated()){
    req.flash('error', "You're already logged in.")
    res.redirect('/list');
  }else{
    res.render('index');
  }
});

router.get('/list', ensureAuthenticated, function (req, res) {
    res.render('list', {message: req.flash('error')});
});

// router.get('/list', function (req, res){
//
//     app.use(passport.authenticate('session') {
//       res.render('list');
//     }));
// });
//for api functions
router.get('/api/users', ensureAuthenticated, (req, res) => {
  res.json(posts);
});

router.get('/api/users/count', (req, res) => {
  res.json({users: totalUsers});
});

router.get('/api/users/:id', ensureAuthenticated, (req, res) => {
  const found = posts.some(user => user.userId === parseInt(req.params.id));
    if (found){
      res.json(posts.filter(user => user.userId === parseInt(req.params.id)));
    } else {
      res.status(400).json({message: `No user(s) with the ID og ${req.params.id}`});
    }
});
//for posts
router.get('/api/posts', ensureAuthenticated, (req, res) => {
  res.json(posts);

});

router.get('/api/posts/count', ensureAuthenticated, (req, res) => {
  res.json({posts: posts.length});
});

router.get('/api/posts/:id', ensureAuthenticated, (req, res) => {
  const found = posts.some(post => post.id === parseInt(req.params.id));
  if (found) {
    res.json(posts.filter(post => post.id === parseInt(req.params.id)));
  }else{
    res.status(400).json({message: `No posts with the ID of ${req.params.id}`});
  }
});

module.exports = router;
