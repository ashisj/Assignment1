var User = require('../models/userModel');
const { validationResult } = require('express-validator/check');
const jwt = require('jsonwebtoken')

exports.register = (req,res,next)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      let errorResult={
          email:'',
          password:'',
          dob:'',
          username:'',
          role:''
      };
      errors.array().forEach((value)=>{
          errorResult[value.param] = value.msg;
      })
      res.status(400).json({message:errorResult});
  } else{
    User.findOne({$or:[{'email':req.body.email},{'username':req.body.username}]},(err,user) => {
      if(err){
        return next(err);
      }
      if(user){
        res.status(409).json({message:'Email or UserName is already exists.'});
      } else {
        var newUser = new User();
        newUser.email = req.body.email;
        newUser.password = newUser.encryptPassword(req.body.password);
        newUser.dob = req.body.dob;
        newUser.username = req.body.username;
        newUser.role = req.body.role;
        newUser.save(function(error,result){
          if(error){
            return next(error);
          }
          res.status(202).json({message:"Registration successfull"});
        });
      }
    });
  }
};

exports.login = (req,res,next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(401).json({message:'Authentication Failed'});
  }

  User.findOne({$or:[{'email': req.body.username},{'username':req.body.username}]},(err,user) => {
    if(err){
      return next(err)
    }
    if(user){
      if(!user.validPassword(req.body.password)){
        res.status(401).json({message:'Authentication Failed'});
      } else {
        var token = jwt.sign(
          {
            email:user.email,
            username:user.username,
            role:user.role
          },
          process.env.JWT_PRIVATE_KEY,
          {
            expiresIn: 3000
          }
        );
        res.cookie('token',token);
        res.status(200).json({token:token,message:"success"});
      }
    } else {
      res.status(401).json({message:'Authentication Failed'})
    }
  });
};
