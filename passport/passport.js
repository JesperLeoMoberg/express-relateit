const LocalStrategy = require('passport-local').Strategy;
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const connection = require('../db/db-connect');

module.exports = (passport) => {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      console.log("Currently processing email: " + email);
      connection.query('SELECT * FROM users WHERE email=' + mysql.escape(email), (err, user) => {
        if (err) { return done(err); }
        if (!user.length) {
          console.log(email + " has been denied access with wrong email.")
          return done(null, false, { message: 'Incorrect email.' });
        }
        bcrypt.compare(password, user[0].password, (err, isMatch) => {
          if (err) { return done(err); }
          if (isMatch) {
            return done(null, user);
          } else {
            console.log(email + " has been denied access with wrong password.")
            return done(null, false, { message: 'Incorrect password.' });
          }
        });
        passport.serializeUser((user, done) => {
          console.log(email + " has been granted access.")
          return done(null, user[0].id);
        });

        passport.deserializeUser((id, done) => {
          connection.query('SELECT * FROM users WHERE id=' + id, (err, user) => {
            return done(err, user);
          });
        });
      });
    }
  ));
}
