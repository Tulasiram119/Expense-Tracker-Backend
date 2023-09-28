const express = require("express");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const Router = express.Router();
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const JWT_SCRET="tttuuunnn";
//we are creating user here using post method
Router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body(
      "password",
      "Length of the password is too small it must be atleast 5 charaters"
    ).isLength({ min: 5 }),
  ],
  async (req, res) => {
    // is there are erros return bad request and errors
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).send(result.array());
    }
    //checking weather the user with same email exits or not
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .send("Sorry user with the same email already exits");
      }
      //Here we are adding hashing and salt to password by using bcryptjs
      const salt = await bcrypt.genSalt(10);
      const secPassword = await bcrypt.hash(req.body.password,salt);      
      //creating the user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPassword,
      });
      // .then((user) => res.json(user))
      // .catch((err) => {
      //   console.log(err);
      //   res.json({
      //     error: "please enter a unique email",
      //     message: err.message,
      //   });
      // });
      const data = {
        user:{
          id: user.id
        }
      }
      const authtoken = jwt.sign(data,JWT_SCRET);
      console.log(authtoken);
      //res.send(user);
      res.json({authtoken})
    } catch (error) {
      console.error(error.message);
      res.status(500).send("some error occurred");
    }
  }
);
module.exports = Router;
