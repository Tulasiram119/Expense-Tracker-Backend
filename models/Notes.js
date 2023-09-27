const mongoose = require('mongoose');

const notesSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        typr: String,
        required: true,        
    },
    tag:{
        type: String,
        default: "Undefined"
    },
    date:{
        type: Date,
        default: Date.now
    }

});
module.exports = mongoose.model("Notes",notesSchema);