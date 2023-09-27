const mongoose = require('mongoose');
const mongoUri = "mongodb+srv://tulasiram:Server1234@cluster0.esoaerw.mongodb.net/?retryWrites=true&w=majority"
const connectToMongo = ()=>{
    mongoose.connect(mongoUri).then(()=>{
        console.log("connection was succesful");
    }).catch(()=>{
        console.log("failed");
    })
}
module.exports = connectToMongo;