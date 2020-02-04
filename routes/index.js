var express = require('express');
var router = express.Router();

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
/* GET Tonebrave College  page. */
router.get('/tonebrave-college',function(req, res, next) {
  res.render('tonebraveCollege');
});




module.exports = router;
