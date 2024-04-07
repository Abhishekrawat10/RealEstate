const bcrypt = require("bcrypt");
const { User, Listing } = require("../db");

const test = (req, res) => {
  res.json({
    msg: "Api working fine",
    token: req.cookies.access_token,
  });
};

const updateUser = async (req, res) => {
  if (req.user.id !== req.params.id) {
    res.status(401).json({
      msg: "Not authenticated",
    });
  }
  try {
    if (req.body.password) {
      const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    }
    console.log(req.body);
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.formData.username,
          email: req.body.formData.email,
          passowrd: req.body.formData.passowrd,
          avatar: req.body.formData.avatar,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    return res.status(200).json({
      msg: "User Updataed Successfully",
      rest,
    });
  } catch (err) {
    res.status(400).json({
      msg: "Error while Updating",
    });
  }
};

const deleteUser = async (req, res) => {
  if (req.user.id !== req.params.id) {
    res.status(401).json({
      msg: "Not authenticated",
    });
  }
  try {
    const findUser = await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json({
      msg: "Your Account has been deleted",
    });
  } catch (err) {
    res.status(400).json({
      msg: "Internal Server Error",
    });
  }
};

const getUserListing = async (req, res) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (err) {
      console.log(err);
      res.status(401).json({
        msg: "Error Occured!!!!",
      });
    }
  } else {
    res.status(401).json({
      msg: "You can only view your listing",
    });
  }
};

const getUser = async(req,res)=>{
  try {    
    const user = await User.findById(req.params.id);  
    if (!user) return res.status(400).json({msg: "User not found!!!"})
    const { password, ...rest } = user._doc;
  
    res.status(200).json(rest);
  } catch (error) {
    console.log(err)
    res.status(400).json({msg: "Error while finding ther user"})
  }

}

module.exports = {
  test,
  updateUser,
  deleteUser,
  getUserListing,
  getUser
};
