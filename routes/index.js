var express = require('express');
const sgMail = require('@sendgrid/mail');
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


    // SENDGRID HERE
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: eventReg.email,
      from: 'noreply@tonebrave.com',
      subject: 'Next Process On Event Registration On Tonebrave',
      text: 'and easy to do anywhere, even with Node.js',
      html: `      <div class="container">
                      <div class="row justify-content-md-center">
                        <div class="col col-lg-2">
                          
                        </div>
                        <div class="col-md-auto">
                          <div class="card text-center">
                              <div class="card-body">
                                <h5 class="card-title">kindly find below your login details, it is very confidential;</h5>
                                <h2>Registration Details </h2>
                                </h3>
                                  <h3 class="card-text text-left"><strong>Name:</strong> ${eventReg.name.first_name},  ${eventReg.name.last_name} </h3>
                                  <h3 class="card-text text-left"><strong>Phone:</strong> +234 - ${eventReg.phone.number} </h3>
                                  <h3 class="card-text text-left"><strong>Email:</strong> +234 - ${eventReg.email} </h3>
                                </h3>
                                <h2>Payment Details </h2>
                                <h3 class="card-text text-left"><strong>Bank:</strong>FIDELITY </h3>
                                <h3 class="card-text text-left"><strong>Account Name:</strong>MICHAEL UDEAGHA</h3>
                                <h3 class="card-text text-left"><strong>Account Number:</strong> 6551122812</h3>
                                <h3 class="card-text text-left"><strong>Amount:</strong> Three Thousand Naira Only (N3000)</h3>
                              </div>
                          </div>
                      
                        </div>
                        <div class="col col-lg-2">
                      </div>
                  </div>`,
    };
  eventReg.save().then(
    () => {
      req.flash('success', `Next Process has been sent to you via ${eventReg.email}`)
      res.redirect('/event');
      sgMail.send(msg);
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
