//use express
let express = require('express')

//instantiate an express router to parse and direct url requests
const router = express.Router()

//add model ref
const Skin = require('../models/skin')


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

//GET: /skins => show index view
router.get('', authCheck, (req, res) =>{
    //use Skins model to fetch all documents from Skins collection in mongodb
    Skin.find((err, skins) => {
        if(err){
            console.log(err)
            res.end(err)
        }else{
            res.render('skins/index', {
                skins: skins,
                title: 'Skins',
                user: req.user
            })
        }
    })

})

// GET: /skins/create => show new skin form. Now call authCheck first
router.get('/create', authCheck, (req, res) =>{
    res.render('skins/create', {
        title: 'Create a new skin',
        user: req.user
    })
})

//POST: //skins/create => Process from submission & save new skin document
router.post('/create', authCheck, (req, res) =>{
    // use Mongoose model to create a new Skin document
    Skin.create({
        skin_name: req.body.name
    }, (err, newSkin) =>{
        if(err){
            console.log(err)
            res.end(err)
        }else{ // save successful; update skins list view
            res.redirect('/skins')
        }
    })
})


// GET: skins/delete/abc123 => delete skin with the _id param
router.get('/delete/:_id', authCheck, (req, res) =>{
    //get document id from url param
    let _id = req.params._id
    //use Mongoose to delete the document & redirect
    Skin.remove({ _id: _id}, (err) => {
        if(err){
            console.log(err)
            res.end(err)
        }else{
            res.redirect('/skins')
        }
    })
})

// GET: /skins/edit/abc123 => show pre-populated Edit form
router.get('/edit/:_id', authCheck,(req, res,next) => {
    // read the _id from url param
    let _id = req.params._id

    //query the db for the selected Skin document
    Skin.findById(_id, (err, skin) => {
        if(err){
            console.log(err)
            res.end(err)
        }else{
            //load the edit view and pass the selected Skin doc to it for display
            res.render('skins/edit',{
                title: 'Skin Details',
                skin: skin,
                user: req.user
            })
        }
    })
})

// POST: /skins/edit/abc123 => update existing Skin doc with values from form submission
router.post('/edit/:_id', authCheck, (req, res) => {
    // get document id from url param
    let _id = req.params._id

    // Use Mongoose findByIdAndUpdate to save changes to existing doc
    Skin.findByIdAndUpdate({_id: _id}, {'skin_name': req.body.name}, null, (err, skin) => {
        if(err){
            console.log(err)
            res.end(err)
        }else{
            res.redirect('/skins')
        }
    })
})


// make public
module.exports = router