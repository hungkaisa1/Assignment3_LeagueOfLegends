// link to mongoose
const mongoose = require('mongoose')

//define a schema for champions
var championSchema = new mongoose.Schema({
    champion_name: {
        type: String,
        required: true,
        trim: true
    }
})

//make this model public with the name of Champion
module.exports = mongoose.model('Champion', championSchema)