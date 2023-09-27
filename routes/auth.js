const express = require('express');
const User = require('../models/User');
const Router = express.Router();
Router.post("/",(req,res)=>{
    const user = User(req.body);     
    console.log(req.body);
    user.save();
    res.send(req.body);
})


module.exports = Router;