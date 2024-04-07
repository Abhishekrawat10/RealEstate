const { User } = require("../db/index");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  const { username, email, password } = req.body.formData;
  const findUser = await User.findOne({ username, email });
  if (findUser) {
    res.status(406).json({
      msg: "User Already Exist",
    });
  }
  // console.log(req.body.formData);
  // console.log(username);
  // console.log(email);
  // console.log(typeof password);
  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({
      msg: "User Created Successfully!",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Server Error",
    });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return res.status(400).json({
        msg: "Invalid User",
      });
    }
    const validPassword = bcrypt.compareSync(password, validUser.password);
    console.log(validPassword);
    if (!validPassword) {
      return res.status(400).json({
        msg: "enter Proper Credentials",
      });
    }
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
    res.cookie("access_token", token, { httpOnly: true }).status(200).json({
      msg: "User looged In",
      rest,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      msg: "Error Occured",
    });
  }
};

const google = async (req, res) => {
  const { email, name, photo } = req.body;
  try {
    const user = await User.findOne({
      email,
    });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password, ...rest } = user._doc;
      res.cookie("access_token", token, { httpOnly: true }).status(200).json({
        rest,
      });
    } else {
      const generatePassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatePassword, 10);
      const newUser = new User({
        email,
        username:
          name.split(" ").join("").tolowerCase() +
          Math.random().toString(36).slice(-4),
        username: name.split(" ").join(""),
        password: hashedPassword,
        avatar: photo,
      });
      // return res.json({
      //   msg: "Sb changaa Si Ji"
      // })
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password, ...rest } = user._doc;
      res.cookie("access_token", token, { httpOnly: true }).status(200).json++ +
        {
          msg: "User Created Successfully",
          rest,
        };
    }
  } catch (err) {
    res.status(400).json({
      msg: "Error in google auth",
    });
  }
};

const signout = (req,res) =>{
  try{
    res.clearCookie('access_token');
    res.status(200).json("user Has been logged out");
  }catch(err){
    console.log(err);
    res.status(400).json({
      msg: "Error Occured"
    })
  }
}

module.exports = {
  signup,
  signin,
  google,
  signout
};
