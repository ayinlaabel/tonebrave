var express = require('express');
var router = express.Router();


/* BRINGING IN MODELS */
const EventReg = require('../models/event_registration')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* GET About page. */
router.get('/about', function(req, res, next) {
  res.render('about');
});

/* GET Event page. */
router.get('/event', function(req, res, next) {
  res.render('event');
});

/* GET Event Registration page. */
router.get('/event/upcoming-event', function(req, res, next) {
  res.render('eventRegistration');
});

/* POST Event Registration page. */
router.post('/event/upcoming-event', function(req, res, next) {
  const eventReg = new EventReg();

  eventReg.name.first_name = req.body.first_name;
  eventReg.name.last_name = req.body.last_name;
  eventReg.phone.country = req.body.country;
  eventReg.phone.number = req.body.number;
  eventReg.email = req.body.email;
  eventReg.subject = req.body.subject;
  eventReg.objective = req.body.objective;
  eventReg.gender = req.body.gender;

  console.log(eventReg.name.first_name);
  eventReg.save().then(
    () => {
      req.flash('success', 'Thank you for registering for the event to complete you registeration you will need to pay the sum amount of  three Thousand Naira Only (N3000) to (Bank: Fidelity, Account Name: Michael Udeagha, Account Number: 6551122812)')
      res.redirect('/event')
      // alert('Thank you for registering for the even to complete you registeration you will need to pay three Thousand Naira Only (N3000) to');
    }
  ).catch(
    (err) => {
      console.log(err);
    }
  )
});

/* GET Tonebrave College  page. */
router.get('/tonebrave-college',function(req, res, next) {
  res.render('tonebraveCollege');
});




module.exports = router;
