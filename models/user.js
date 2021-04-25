const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  work: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cpassword: {
    type: String,
    required: true,
  },
  tokens:[
      {
          token:{
              type: String,
              required: true
          }
      }
  ],
  date:{
    type: Date,
    default: Date.now()
  },
  messages:[
    {
      message:{
        type:String
      }
    }
  ]
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
    this.cpassword = await bcrypt.hash(this.cpassword, 8);
  }
  next();
});

userSchema.methods.generateAuthToken = async function(){
    try {
        let token = jwt.sign({_id: this.id.toString()}, "MYFIRSTMERNPROJECT");
        this.tokens = this.tokens.concat({ token });
        await this.save();
        return token;
    } catch (error) {
        console.log(error)
    }
}

userSchema.methods.addMessage = async function(message){
  try {
    this.messages = await this.messages.concat({message})
    await this.save()
    return this.messages;
  } catch (error) {
    console.log(error)
  }
}

const User = mongoose.model("users", userSchema);

module.exports = User;
