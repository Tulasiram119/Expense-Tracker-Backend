const express = require("express");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const Router = express.Router();
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const fetchUser = require("../middleware/fetchUser");
const JWT_SCRET = "tttuuunnn";
//Route1: we are creating user here using post method end-point /api/auth/createuser nologin required
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
    var sucess = false;
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
          .json({sucess,error:"Sorry user with the same email already exits"});
      }
      //Here we are adding hashing and salt to password by using bcryptjs
      const salt = await bcrypt.genSalt(10);
      const secPassword = await bcrypt.hash(req.body.password, salt);
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
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SCRET);
      //res.send(user);
      sucess = true;
      res.json({sucess, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

// route 2: authenicate user using post end point /api/auth/login nologin required
Router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body(
      "password",
      "Length of the password is too small it must be atleast 5 charaters"
    ).isLength({ min: 5 }),
  ],
  async (req, res) => {
    // is there are erros return bad request and errors
    var sucess = false;
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).send(result.array());
    }
    const { email,password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        sucess = false;
        return res
          .status(400)
          .json({sucess : sucess, error: "please try to login with correct creditionals" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        sucess = false;
        return res
          .status(400)
          .json({ sucess: sucess,error: "please try to login with correct creditionals" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SCRET);
      //res.send(user);
      sucess = true;
      res.json({ sucess:sucess,authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("internal sever error");
    }
  }
);
// route 3: get user details user using post end point /api/auth/getuser login required
Router.post("/getuser", fetchUser, async (req, res) => {
  try {
    let userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("some error occurred");
  }
});
module.exports = Router;
