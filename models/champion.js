// link to mongoose
const mongoose = require('mongoose')

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
    },
    // in case, one to many relationship. 1 champion has many skins, 1 skin belongs to unique a champion.
    skins: [{
        skin_name: String,
        skin_release_date: String,
        skin_type: String,
        skin_rp: Number,
        skin_img: String
    }]
})

//make this model public with the name of Champion
module.exports = mongoose.model('Champion', championSchema)