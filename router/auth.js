const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const router = new express.Router();
require("../db/mongoose");
const authenticate = require("../middlewares/authenticate")

router.get("/", authenticate, (req, res) => {
  res.send(req.user);
});

router.get("/getcontact", authenticate, async (req, res) => {
  res.send(req.user)
})

router.post("/contact", authenticate , async (req, res) => {
  try {

    const {name, email, message} = req.body
    if(!name|| !email|| !message){
      console.log("Error Occured")
      return res.json({ error: "Please fill the contact form"})
    }

    const user = await User.findOne({_id: req.userId})
    if(user){
      const userMessage = await user.addMessage(message)
      await user.save()
      res.send(userMessage)
      res.status(200).send("message sent successfully")
    }

  } catch (error) {
    console.log(error)
  }
});

router.get("/about", authenticate , (req, res) => {
  res.send(req.user);
});

router.get("/logout", (req, res) => {
  res.clearCookie('merncookie', {path:'/'})
  res.status(200).send("logged out")
});

router.post("/register", async (req, res) => {
  const { name, email, phone, work, password, cpassword } = req.body;
  if (!name || !email || !phone || !work || !password || !cpassword) {
    return res.status(400).send("enter required fields");
  }

  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).send("user already exist");
    }
    const user = new User({ name, email, phone, work, password, cpassword });
    //useSchema.pre()
    await user.save();
    res.status(200).send("registration successfull");
  } catch (error) {
    console.log(error);
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Invalid details");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("not a user");
    } else {
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      const token = await user.generateAuthToken();
      res.cookie("merncookie", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly:true
      })

      if (!isPasswordMatch) {
        return res.status(400).send("login failed");
      } else {
        res.status(200).send("login successfull");
      }
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
