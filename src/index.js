const express = require("express");
const dotenv = require("dotenv").config();
const app = express();
const User = require('../models/user')
const auth = require('../router/auth')
const cookieParser = require('cookie-parser')

app.use(cookieParser())
app.use(express.json())
const PORT = process.env.PORT;

require('../db/mongoose');
app.use(auth)

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
   