var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();

// passport for auth, express-session for session mgmt
const passport = require('passport')
const session = require('express-session')

// 1 - configure app to use sessions
app.use(session({
    secret: 'someRandomString@123',
    resave: true,
    saveUninitialized: false
}))

// 2 - enable passport
app.use(passport.initialize())
app.use(passport.session())

// 3 - Link passport to User model with extends passport-local-mongoose
const User = require('./models/user')
passport.use(User.createStrategy())

// 4 - set passport to read/write User data to/from the session object
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


var indexRouter = require('./controllers/index');
var usersRouter = require('./controllers/users');
var championsRouter = require('./controllers/champions');
var skinRouter = require('./controllers/skins');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/champions', championsRouter);
app.use('/skins', skinRouter);

//mongodb connect w/mongoose
const mongoose =  require('mongoose')
const globals = require('./config/globals')


mongoose.connect(globals.db, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(
    (res) => {
      console.log('Connected to MongoDB')
    }
).catch(() =>{
  console.log('Could not connect to MongoDB')
})

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
