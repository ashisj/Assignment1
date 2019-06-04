const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try{
    const token = req.headers.authorization;
    const decode = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    if(decode.role.toLowerCase() == 'admin'){
        req.user = decode;
        next();
    } else {
        return res.status(401).json({
            message: "You are not authorized to access this api"
        })
    }
    
  }catch(error){
    return res.status(401).json({
      status:false,
      message: "Authentication Failed"
    })
  }
}