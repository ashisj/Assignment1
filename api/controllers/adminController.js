var User = require('../models/userModel');

exports.getAllRegisteredUser = (req,res,next) => {
    User.find({},{_id:0,email:1,username:1,dob:1,role:1},(err,users) => {
        if(err){
            return next(err)
        }
        res.status(200).json({registeredUsers:users});
    })
}

exports.deleteUser = (req,res,next) => {
    User.remove({$or:[{email:req.params.username},{username:req.params.username}]},(err,user) => {
        if(err){
            return next(err)
        }
        if(user.deletedCount){
            return res.status(200).json({message : req.params.username + ' is deleted successfully' })
        } else {
            return res.status(200).json({message : req.params.username + ' is not present' })
        }
    })
}