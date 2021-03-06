var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var logger = require('morgan');
const expressValidator = require('express-validator');
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const config = require('./config/database');
const passport = require('passport');


mongoose.connect(config.database,  { useNewUrlParser: true} );

const db = mongoose.connection;

db.on('open',  () => {
    console.log('Connected to Mongodb on Port 27017  Successfully ...');
});

//Error
db.once('error',  (err) => {
    console.log(err);
});


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

//Connect-Flash Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
res.locals.messages = require('express-messages')(req, res);
next();
});

//Express Validator Middleware
app.use(expressValidator({
  errorFormatter: (param, msg, value) =>{
      var namespace = param.split('.'),
          root = namespace.shift(),
          formParam = root;
      
      while(namespace.length) {
          formParam += '[' + namespace.shift() + ']';
      }
      return{
          param : formParam,
          msg : msg,
          value : value
      };
  }
}));

//Passport Config
require('./config/passport')(passport);

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());


app.get('*', function(req, res, next){
    res.locals.user = req.user || null;
    next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
