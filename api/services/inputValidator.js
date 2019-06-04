const {check} = require('express-validator/check');

exports.validate = (method) => {
    switch (method){
      case 'register':{
        return [
            check('email').exists().trim()
                .matches(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)
                    .withMessage('please enter a valid email address eg:- a@gmail.com')
                .not().isEmpty().withMessage('Email field should not be empty')
                .isLength({ max: 50 }).withMessage('Email must have maximum 50 character'),
            check('password').exists()
                .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/)
                    .withMessage('Password must contain at least 6 characters, including uppercase,lowercase and number')
                .not().isEmpty().withMessage('Password field should not be empty'),
            check('dob').exists().trim()
                .matches(/^(0[1-9]|[1-2]\d|3[0-1])-(0[1-9]|1[0-2])-\d\d\d\d$/).withMessage('Date should be a format dd-mm-yyyy')
                .not().isEmpty().withMessage('Date of Birth field should not be empty')
                .custom((value) => new Date(value)  <= new Date())
                .withMessage("Date of Birth should not be greater than today's date"),
            check('username').exists().trim()
                .matches(/^[A-Za-z0-9@_-]+$/).withMessage('User Name is not a valid username')
                .not().isEmpty().withMessage('User Name field should not be empty')
                .isLength({ min:5,max: 15 }).withMessage('User Name must have minimum 5 character and maximum 15 character'),
            check('role').exists().trim()
                .matches(/^(user|admin)$/).withMessage('Role field is not valid')
                .not().isEmpty().withMessage('Role field should not be empty')   
        ]
        break;
      }
      case 'login':{
          return [
            check('username').exists().trim()
                .matches(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$|^[A-Za-z0-9@_-]+$/)
                .not().isEmpty(),
            check('password').exists()
                .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/)
                .not().isEmpty()
          ]
          break;
      }
      case 'parenthesis':{
          return [
              check('parenthesis').trim()
              .matches(/^(\{|\}|\(|\)|\[|\])*$/)
          ]
          break;
      }
      
    }
  }