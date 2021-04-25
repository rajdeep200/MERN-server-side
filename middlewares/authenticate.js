const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authenticate = async (req, res, next) => {
  try {
    const token = await req.cookies.merncookie;
    const verifyToken = await jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findOne({
      _id: verifyToken._id
    });
    if (!user) {
      throw new Error("User Not Found");
    }
    req.token = token;
    req.user = user;
    req.userId = user._id;

    next();
  } catch (error) {
    res.status(401).send("Unauthorized User");
    console.log(error);
  }
};

module.exports = authenticate;
