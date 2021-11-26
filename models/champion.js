// link to mongoose
const mongoose = require('mongoose')
const buffer = require("buffer");

//define a schema for champions
var championSchema = new mongoose.Schema({
    champion_name: {
        type: String,
        required: true,
        trim: true
    },
    champion_img: {
        type: String,
        required: false
    },
    champion_classes: {
        type: String,
        required: true,
        trim: true
    },
    champion_release_date: {
        type: String,
        required: true,
        trim: true
    },
    champion_blue_essence: {
        type: Number,
        required: true,
        trim: true
    },
    champion_rp: {
        type: Number,
        required: true,
        trim: true
    }
})

//make this model public with the name of Champion
module.exports = mongoose.model('Champion', championSchema)