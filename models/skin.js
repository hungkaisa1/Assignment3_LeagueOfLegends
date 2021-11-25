// link to mongoose
const mongoose = require('mongoose')

//define a schema for skins
var skinSchema = new mongoose.Schema({
    skin_name: {
        type: String,
        required: true,
        trim: true
    }
})

//make this model public with the name of skin
module.exports = mongoose.model('Skin', skinSchema)