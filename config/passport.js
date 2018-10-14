const LocalStrategy=require('passport-local').Strategy; 
const mongoose=require('mongoose');
const passport=require('passport');
const bcrypt = require('bcryptjs');
const {User}=require('./../models/user');


module.exports = function(passport){
  passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
     User.findOne({
      email:email
    }).then(user => {
      if(!user){
        console.log('no user found');
        return done(null, false);
      } 

      // Match password
      bcrypt.compare(password, user.password, (err,Match) => {
        if(err) throw err;
        if(Match){
          return done(null, user);
        } else {
          return done(null, false);
        }
      })
    })
  }));

    passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}