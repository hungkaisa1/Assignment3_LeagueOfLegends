//use express
let express = require('express')

//instantiate an express router to parse and direct url requests
const router = express.Router()

//add model ref
const Champion = require('../models/champion')


//passport for auth
const passport = require('passport')

// auth check
function authCheck(req, res, next){
    //use express built-in method to check for user identity. If a user is found, continue to the next method
    if(req.isAuthenticated()){
        return next()
    }

    // if no user found, go to login
    res.redirect('/login')
}

//GET: /champions => show index view
router.get('', (req, res) =>{
    //use Champion model to fetch all documents from Champions collection in mongodb
    Champion.find((err, champions) => {
        if(err){
            console.log(err)
            res.end(err)
        }else{
            res.render('champions/index', {
                champions: champions,
                title: 'Champions',
                user: req.user
            })
        }
    })

})

// GET: /champions/create => show new champion form. Now call authCheck first
router.get('/create', authCheck, (req, res) =>{
    res.render('champions/create', {
        title: 'Create a new champion',
        user: req.user
    })
})

//POST: //champions/create => Process from submission & save new champion document
router.post('/create', authCheck, (req, res) =>{
    // use Mongoose model to create a new Champion document
    Champion.create({
        champion_name: req.body.name
    }, (err, newChampion) =>{
        if(err){
            console.log(err)
            res.end(err)
        }else{ // save successful; update champions list view
            res.redirect('/champions')
        }
    })
})


// GET: champions/delete/abc123 => delete champion with the _id param
router.get('/delete/:_id', authCheck, (req, res) =>{
    //get document id from url param
    let _id = req.params._id
    //use Mongoose to delete the document & redirect
    Champion.remove({ _id: _id}, (err) => {
        if(err){
            console.log(err)
            res.end(err)
        }else{
            res.redirect('/champions')
        }
    })
})

// GET: /champions/edit/abc123 => show pre-populated Edit form
router.get('/edit/:_id', authCheck,(req, res,next) => {
    // read the _id from url param
    let _id = req.params._id

    //query the db for the selected Champion document
    Champion.findById(_id, (err, champion) => {
        if(err){
            console.log(err)
            res.end(err)
        }else{
            //load the edit view and pass the selected Champion doc to it for display
            res.render('champions/edit',{
                title: 'Champion Details',
                champion: champion,
                user: req.user
            })
        }
    })
})

// POST: /champions/edit/abc123 => update existing Champion doc with values from form submission
router.post('/edit/:_id', authCheck, (req, res) => {
    // get document id from url param
    let _id = req.params._id

    // Use Mongoose findByIdAndUpdate to save changes to existing doc
    Champion.findByIdAndUpdate({_id: _id}, {'champion_name': req.body.name}, null, (err, champion) => {
        if(err){
            console.log(err)
            res.end(err)
        }else{
            res.redirect('/champions')
        }
    })
})


// make public
module.exports = router