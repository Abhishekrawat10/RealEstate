const jwt = require("jsonwebtoken");


const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json({
      msg: "Unauthorized user ",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      messsage: "Wrong user ",
      token,
    });
  }
};

module.exports = { verifyToken };
