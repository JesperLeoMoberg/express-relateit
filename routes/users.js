
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

router.use(expressValidator());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));
router.use(cookieParser('secret'));
router.use(session({
    secret: 'I7^dj23ff@9LvB6siu^7$uInxGhMw2',
    resave: false,
    saveUninitialized: false
}));
router.use(passport.initialize());
router.use(passport.session());
router.use(flash());





// for users
router.get('/login', function (req, res){
  res.render('login');
});

router.post('/login', function(req, res, next){
  passport.authenticate('local', {
      successRedirect: '/list',
      failureRedirect: '/users/login',
      failureFlash: true
  })(req, res, next);
});

router.get('/register', function (req, res){
  res.render('register');
});

router.post('/register', function(req, res){
  const name = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  req.checkBody('username', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is valid').isEmail();
  req.checkBody('password', 'Password is required').notEmpty();

  let errors = req.validationErrors();

  if(errors) {
    res.render('register', function(err) {
      errors:errors;
    });
  }else{
    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(password, salt, function(err, hash){
        if (err) {
          console.log(err);
        }
        var values = {
          name: name,
          email: email,
          password: hash
        }
        var sql = mysql.format("SELECT * FROM users WHERE email=" + mysql.escape(values.email));
        connection.query(sql, function(err, result){
          if (err) {
            console.log(err);
            return;
          }
          if (!result.length){
            var sql = mysql.format("INSERT INTO users (username, email, password) VALUES (" + mysql.escape(values.name) + ", " + mysql.escape(values.email) + ", " + mysql.escape(values.password) + ")");
            connection.query(sql, function(err, result){
              if (err) {
                console.log(err);
                return;
              }else{
                console.log("Registration by email '" + values.email + "' have been successful")
                req.flash('success', 'Registration Successful');
                res.redirect('login');
              }
            });
          } else {
            console.log("Registration by email '" + values.email + "' have been denied")
            req.flash('failure', 'Email already registered');
            res.redirect('register');
          }
        });
      });
    });
  }
});

module.exports = router;

//login
// router.post('/login',
//   passport.authenticate('local', {
//     successRedirect: 'list',
//     failureRedirect: 'login',
//     faliureFlash: true })
//
// );
