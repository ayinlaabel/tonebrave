var express = require('express');
const bcrypt = require('bcryptjs');
var router = express.Router();
const passport = require('passport');

//bring User Model
let User = require('../models/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', (req, res)=>{
  res.render('register');
});

router.post('/register', (req, res)=>{
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const passwordC = req.body.passwordC;

  //Check for Validation
  req.checkBody('name', 'Name is Required').notEmpty();
  req.checkBody('email', 'Email is Required').notEmpty();
  req.checkBody('email', 'Email should be like example@example.com').isEmail();
  req.checkBody('username', 'Username is Required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('passwordC', 'The Password Dont Match').equals(req.body.password);

  let errors = req.validationErrors();

  if (errors) {
    console.log(errors);
    res.render('register', {
      errors:errors
    });
  }else{
    let newUser = new User({
      name:name,
      email:email,
      username:username,
      password:password
    });

    bcrypt.genSalt(10, (err, salt) =>{
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) {
          console.log(err);
        }
        newUser.password = hash;
        newUser.save((err) => {
          if (err) {
            console.log(err);
          }else{
            req.flash('success', 'Registration Completed.');
            res.redirect('/users/login');
          }
        })
      })
    });
  }
});

router.get('/login', (req, res) =>{
  res.render('login');
});

router.post('/login', (req, res, next) =>{
  passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/users/login',
      failureFlash: true
  })(req, res, next);
});


router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'You have logout successfully');
  res.redirect('/users/login');
});



module.exports = router;
