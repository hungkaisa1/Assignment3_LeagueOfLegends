//use express
let express = require('express')

//instantiate an express router to parse and direct url requests
let router = express.Router()

//GET: /skins => show index view
router.get('/', (req, res) =>{
    res.render('skins/index')
})

// make public
module.exports = router