const express=require('express');
const abc=express();
const router =express.Router();
const passport=require('passport');
const mongoose=require('mongoose');
const bcrypt = require('bcryptjs');
const {User}=require('./../models/user');

var {isAuthenticated}=require('.././authenticate/auth');

router.get('/login',(req,res)=>{

res.render('login');

});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});

router.get('/signup',(req,res)=>{

res.render('signup');

});

router.get('/logout',isAuthenticated,(req,res)=>{

req.logout();
req.flash('success_msg', 'you are logged out');
res.redirect('/login');

});

router.post('/signup',(req,res)=>{
let errors=[];

if(!req.body.name){

	errors.push({text:'Name is required'})
}
if(!req.body.email){

	errors.push({text:'email is required'})
}

if(!(req.body.password && req.body.password2)){

	errors.push({text:'password is required'})
}

if(req.body.password != req.body.password2){

	errors.push({text:'password doesnot match'})
}

if(errors.length>0){

	res.render('signup',{

		errors:errors,
		name:req.body.name,
		email:req.body.email,
		password:req.body.password,
		password2:req.body.password2
	});
}
else{

	  User.findOne({email: req.body.email})
      .then(user => {
        if(user){
                  req.flash('error_msg', 'Email already regsitered');
          res.redirect('/signup');
        }
        else{

        	const user=new User({

			name:req.body.name,
			email:req.body.email,
			password:req.body.password
			});
     
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
              if(err) throw err;
              user.password = hash;
              user.save()
                .then(user => {

                                   req.flash('success_msg', 'your are regsitered now!!');
                  res.redirect('/login');
                })
                .catch(err => {
                  console.log(err);
                  return;
                });
            });
          });

                  }
      });
  }
});


module.exports=router;