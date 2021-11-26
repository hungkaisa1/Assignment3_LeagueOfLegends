var express = require('express');
var router = express.Router();

// passport for auth
const passport = require('passport')
const User = require('../models/user')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'League of Legends',
    user: req.user
  });
});


// GET: /About

router.get('/about', (req,res) =>{
  res.render('about', {
    title: 'About',
    content: 'This is about page.',
    user: req.user
  })
})

// GET: /register
router.get('/register', (req, res) => {
  res.render('register', {
    title: 'Register'
  })
})

// POST: /register
router.post('/register', (req, res) => {
  // user User Model & Passport to create a new user in MongoDB. Send password separately so it can be hashed by passport.
  User.register(new User({username: req.body.username}), req.body.password, (err, newUser) => {
    if(err){
      console.log(err)
      res.render('register',{
        message: err
      })
    }else{
      // registration succeeded, log user in and loan main champion page.
      req.login(newUser, (err) => {
        res.redirect('/champions')
      })
    }
  })
})

// GET: /login
router.get('/login', (req, res) => {
// check the session for error messages
  let messages = req.session.message || []
  req.session.message = []
  res.render('login', {
    title: 'Login',
    messages: messages
  })
})

// POST: /login - passport.authenticate does all the work behind the scenes to validate the login attempt
router.post('/login', passport.authenticate('local', {
  successRedirect: '/champions',
  failureRedirect: '/login',
  failureMessage: 'Invalid Login' // stored in the session object
}))

// GET: /logout
router.get('/logout', (req, res) =>{
  req.logout()
  res.redirect('/login')
})

//GET: /github
router.get('/github', passport.authenticate('github', {
  scope: ['user.email']
}))

//GET: /github/callback
router.get('/github/callback', passport.authenticate('github', {
  failureRedirect: '/login'
}), (req, res) =>{
  res.redirect('/champions')
})



module.exports = router;
