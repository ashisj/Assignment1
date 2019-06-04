
const balancedCheck = require('../services/balancedParenthesisCheck');

var Balanced = require('../models/balancedModel');
const { validationResult } = require('express-validator/check');

exports.balanced = (req,res,next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({message:"Invalid input"})
    }
    let isBalanced = balancedCheck.isBalanced(req.body.parenthesis);
    let message = ''
    if(isBalanced){
        message = 'Success'
    }
    Balanced.findOne({'username':req.user.username},(error,data) => {
        if(error){
            return next(error)
        }
        if(data){
            data.message = message;
            data.attempts = data.attempts += 1;

            data.save((err,result) => {
                if(err){
                    return next(err)
                }
                res.status(200).json({
                    username : result.username,
                    message  : result.message,
                    attempts : result.attempts
                })
            });
        } else {
            let newbalanced = new Balanced();
            newbalanced.username = req.user.username;
            newbalanced.message = message;
            newbalanced.attempts = 1;

            newbalanced.save((err,result) => {
                if(err){
                    return next(err)
                }
                res.status(200).json({
                    username : result.username,
                    message  : result.message,
                    attempts : result.attempts
                })
            });
        }
    })
}