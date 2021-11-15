//use express
let express = require('express')

//instantiate an express router to parse and direct url requests
let router = express.Router()

//GET: /champions => show index view
router.get('/', (req, res) =>{
    res.render('champions/index')
})

// make public
module.exports = router