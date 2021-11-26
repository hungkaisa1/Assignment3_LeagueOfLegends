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

// Multer - Upload image
const multer = require('multer')
const Skin = require("../models/champion");

// Define storage for the images
const storage = multer.diskStorage({
    //destination for files
    destination: function (request, file, callback){
        callback(null, './public/images')
    },
    // Add back the extension
    filename: function (request, file, callback){
        callback(null,Date.now() + file.originalname)
    }
})

// Upload parameters for multer
const upload = multer({
    storage: storage,
    limits:{
        fieldSize: 1024*1024*3
    }
})


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
router.post('/create', upload.single('image'), authCheck, (req, res) =>{
    // use Mongoose model to create a new Champion document
    Champion.create({
        champion_name: req.body.name,
        champion_img: req.file.filename,
        champion_classes: req.body.classes,
        champion_release_date: req.body.release,
        champion_blue_essence: req.body.essence,
        champion_rp: req.body.rp
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
    Champion.findByIdAndUpdate({_id: _id}, {
        'champion_name': req.body.name,
        'champion_classes': req.body.classes,
        'champion_release_date': req.body.release,
        'champion_blue_essence': req.body.essence,
        'champion_rp': req.body.rp

    }, null, (err, champion) => {
        if(err){
            console.log(err)
            res.end(err)
        }else{
            res.redirect('/champions')
        }
    })
})


// GET: /champions/privateSkin/abc123
router.get('/privateSkin/:_id', authCheck,(req, res,next) => {
    // read the _id from url param
    let _id = req.params._id

    //query the db for the selected Champion document
    Champion.findById(_id, (err, champion) => {
        if(err){
            console.log(err)
            res.end(err)
        }else{
            //load the edit view and pass the selected Champion doc to it for display
            res.render('champions/privateSkin',{
                title: 'Skin Details',
                champion: champion,
                user: req.user
            })
        }
    })
})

//POST: /champions/add-album/abc123 => save new album to existing champion doc in nested skins array
router.post('/add-skins/:_id',upload.single('image'), authCheck, (req, res) =>{
    //get selected champion
    Champion.findById(req.params._id, (err, champion) => {
        if(err){
            res.send(err)
        }else{
            champion.skins.push({
                skin_name: req.body.skin_name,
                skin_img: req.file.filename,
                skin_release_date: req.body.skin_release_date,
                skin_type: req.body.skin_type,
                skin_rp: req.body.skin_rp
            })
            champion.save((err, champion) =>{
                if(err){
                    res.send(err)
                }else{
                    res.redirect('/champions/privateSkin/' + req.params._id)
                }
            })
        }
    })
})

// make public
module.exports = router