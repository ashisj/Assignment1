const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try{
    const token = req.headers.authorization;
    const decode = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    req.user = decode;
    next();
  }catch(error){
    return res.status(401).json({
      status:false,
      message: "Authentication Failed"
    })
  }
}