var express = require('express');
const bcrypt = require('bcryptjs');
var router = express.Router();
const passport = require('passport');
const twilio = require('twilio');

//bring User Model
let User = require('../models/users');

/* GET users listing. */
router.get('/',(req,res) => {
  var pageNo = parseInt(req.query.pageNo)
  var size = parseInt(req.query.size)
  var query = {}
  if(pageNo < 0 || pageNo === 0) {
        response = {"error" : true,"message" : "invalid page number, should start with 1"};
        return res.json(response)
  }
  query.skip = size * (pageNo - 10)
  query.limit = size
  // Find some documents

       User.count({},function(err,ssize) {
        // Mongo command to fetch all data from collection.
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            }
            User.find({},{},query,function(err,data) {
              // Mongo command to fetch all data from collection.
                  if(err) {
                      response = {"error" : true,"message" : "Error fetching data"};
                  } else {
                    var sssize = Math.ceil(ssize / size)
                      response = {"error" : false,"message" : data, "pages":sssize };
                  }
                  res.json(response); 
              });
        });
})

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

/* GET Profile page. */
router.get('/profile', ensureAuthenticated, function(req, res, next) {
  res.render('profile');
});


/* GET Edit Profile page. */
router.post('/profile/edit/:id', ensureAuthenticated, function(req, res, next) {
  const user = {};

  user.name = req.body.name;
  user.email = req.body.email;
  user.username = req.body.username;
  user.facebook = req.body.facebook;
  user.instagram = req.body.instagram;
  user.twitter = req.body.twitter;

  let query = {_id:req.params.id}

  User.update(query, user)
  .then(
    () => {
      res.redirect('/users/profile');
      req.flash('success', 'Profile Updated Successful!!!')
    }
  )
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



//Router Authenticated
function ensureAuthenticated(req, res, next){
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('danger', 'You are require to login');
    res.redirect('/users/login');
  }
}


module.exports = router;
