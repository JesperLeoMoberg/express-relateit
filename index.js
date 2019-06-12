
//web functions
var express = require("express");
var exphbs = require("express-handlebars");
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

const request = require('request');
const app = express();
const PORT = process.env.PORT || 5000;

// handler for web (handlebars engine)
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//routes
app.use('/', require('./routes/index'));

app.use('/users', require('./routes/users'));

//app listen on port.
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
