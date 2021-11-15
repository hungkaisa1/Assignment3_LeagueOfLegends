var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'League of Legends' });
});


// GET: /About

router.get('/about', (req,res) =>{
  res.render('about', {
    title: 'About',
    content: 'This is about page.'
  })
})
module.exports = router;
