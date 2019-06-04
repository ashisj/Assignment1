# Big App Company

## Steps to create folder structue
1. Create package.json file by using command 'npm init'.
2. Create app.js file which is the entry point of the project.
3. Create a api folder which will contain controller,routes,services and model 
4. For environment variable create a .env file and config.js file
5. Create a middleware folder where we will put userDefined middleware

## Code Implementation
1. Install express for server setup
    ```npm i express``` 

    Inside app.js
    ```
    const express = require('express');
    const app = express();
    require('config.js')
    const port = process.env.PORT || 3000;

    app.listen(port,function(){
        console.log("Server is running on port " + port);
    });
    ```
2. Install nodemon for live server(reload automatically on code changes)
    ```npm i nodemon -D```

    Inside package.json
    added below line
    ```
    "scripts": {
     "start": "nodemon app.js"
    }
    ```

    to run the server
    ```
    npm start
    ```
3. Create auth.js file for api call inside api/routes

    Inside auth.js
    ```
    const express = require('express');
    const router = express.Router();

    router.post('/login',(req,res,next) => {
        res.send("Login Successfull");
    });
    router.post('/register',(req,res,next) => {
        res.send("Registration Successfull");
    });

    module.exports = router;
    ```

    Inside app.js
    ```
    const auth = require('./api/routes/auth');

    // add route to auth api
    app.use('/api/auth',auth)
    ```

    To check the api use 
    ```
    1. http://localhost:3000/api/auth/register
    2. http://localhost:3000/api/auth/login
    ```

4. To handle file not found error or server error below code should be added.
    In app.js
    ```
    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });
    
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json({message:err.message})
    });
    ```
5. Database connection
    instal mongoose for mongodb ORM
    ```npm i mongoose```

    inside .env file add mongod connection pat
    ```
    MONGODB_CONNECTION = "mongodb://localhost:27017/bigapp"
    ```

    To connect to mongodb add
    Inside app.js
    ```
    const mongoose = require('mongoose');

    //Database connection
    mongoose.connect(process.env.MONGODB_CONNECTION, {useNewUrlParser: true},(err) =>{
        if(err){
            console.log(err.message);
        } else {
            console.log("Conncected Successfully");
        }
    });
    ```

6. For Registration
    install body-parser and express-validator for form value input and input validation
    ```
    npm i body-parser express-validator
    ```

    Inside app.js add
    ```
    const bodyParser = require('body-parser');
    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }))
    
    // parse application/json
    app.use(bodyParser.json())
    ```
    add userModel.js file inside api/models

    Inside userModel.js
    ```
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var bcrypt = require('bcrypt');

    var userSchema = new Schema({
        email     : {type:String,required:true},
        password  : {type:String,required:true},
        dob       : {type:Date,required:true},
        username  : {type:String,required:true},
        role      : {type:String,enum: ['admin', 'user']}
    })

    userSchema.methods.encryptPassword = function(password){
        return bcrypt.hashSync(password,bcrypt.genSaltSync(5),null);
    }

    userSchema.methods.validPassword = function(password){
        return bcrypt.compareSync(password,this.password);
    }

    module.exports = mongoose.model('User',userSchema);
    ```

    add authController file inside api/controllers
    
    Inside authController.js
    ```
    var User = require('../models/userModel');
    const { validationResult } = require('express-validator/check');

    exports.register = (req,res,next)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errorResult={
                email:'',
                password:'',
                dob:'',
                username:'',
                role:''
            }
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
    ```
    add inputValidator file inside api/services
    ```
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
        }
    }
    ```

    change the api content for register in auth.js file

    ```
    const AuthControllers = require('../controllers/authControllers');
    const InputValidator = require('../services/inputValidator');

    router.post('/register',InputValidator.validate('register'),AuthControllers.register); 
    ```

    Test the api using postman with x-www-form-url-encoded format
    ```
    http://localhost:4000/api/auth/register

    in post method with x-www-form-urlencoded format having below field

        email = "email must be a valid mail like a@a.com"
        password = "must have 1 number, 1 capital letter, 1 small letter and minimum 6 digit"
        dob = "date must be a valid date and greater than todays date"
        username = "can contain special character(_,-,@),alphbets,numbers and length between 5 to 15"
        role = "either user or admin"
    ```

7. For Login
    install jsonwebtoken for authorization 
    ```
    npm i jsonwebtoken
    ```

    Inside inputValidator file of api/services
    ```
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
    ```
    
    In authController.js add code for login
    ```
    const jwt = require('jsonwebtoken');

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
                    res.status(200).json({token:token,message:"success"});
                }
            } else {
                res.status(401).json({message:'Authentication Failed'})
            }
        });
    };
    ```

    Inside auth.js of ap/routes add
    ```
    router.post('/login',InputValidator.validate('login'),AuthControllers.login);
    ```

    Test the api using postman with x-www-form-url-encoded format
    ```
    http://localhost:4000/api/auth/login

    In post method with x-www-form-urlencoded format having below field
        username = "pass email address or username"
        password = "valid password"
    ```

8. For Authorize user  
    add checkAuth.js inside middleware folder

    In checkAuth.js
    ```
    const jwt = require('jsonwebtoken');

    module.exports = (req, res, next) => {
        try{
            const token = req.headers.authorization;
            const decode = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
            req.user = decode;
            next();
        }catch(error){
            return res.status(401).json({
                message: "Authentication Failed"
            })
        }
    }
    ```
9. For Balanced api

    Create balancedModel.js inside api/model folder

    In balancedModel.js
    ```
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var balancedSchema = new Schema({
        message   :  {type:String,default:''},
        username  : {type:String,required:true},
        attempts  : {type:Number,default:0},
    })

    module.exports = mongoose.model('balanced',balancedSchema,'balanced');
    ```

    To check valid parenthesis add balancedParenthesisCheck.js inside api/services folder
    ```
    exports.isBalanced = (parenthesis) => {
    let isBalanced = true;
    let stack = []
    inputArray = parenthesis.split('');
    if(inputArray[0] == '}' || inputArray[0] == ')' || inputArray[0] == ']'){
        return false
    }
    
    for(i=0;i<inputArray.length;i++){
        switch(inputArray[i]){
          case '{' :
          case '[' :
          case '(' :
                stack.push(inputArray[i]);
                break;
          case '}':
            if(stack[stack.length-1] == '{'){
                stack.pop();
            } else {
                isBalanced = false;
            }
            break;
          case ']':
            if(stack[stack.length-1] == '['){
                stack.pop();
            } else {
                isBalanced = false;
            }
            break;
          case ')':
            if(stack[stack.length-1] == '('){
                stack.pop();
            } else {
                isBalanced = false;
            }
            break;
          default:
                break;
        }
        
        if(!isBalanced){
          break
        }
      }

      if(stack.length){
            return false;
      }
      return isBalanced; 
    }
    ``` 

    To check for the parenthesis input value add below code insode api/services/inputValidator.js
    ```
    case 'parenthesis':{
          return [
              check('parenthesis').trim()
              .matches(/^(\{|\}|\(|\)|\[|\])*$/)
          ]
          break;
    }
    ```
    Create balancedController.js file inside api/controllers folder

    In balancedController.js
    ```
    
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
    ```

    Create balancedRoute.js file inside api/route
    
    In balancedRoute.js
    ```
    const express = require('express');
    const router = express.Router();

    const BalancedControllers = require('../controllers/balancedController');
    const InputValidator = require('../services/inputValidator');

    router.use(InputValidator.validate('parenthesis'));

    router.post('/',BalancedControllers.balanced);
    module.exports = router;
    ```

    Import and create the end point for balance route in the app.js file
    ```
    const balancedApi = require('./api/routes/balancedRoute');
    //to check authorized user
    const authorizationCheck = require('./middleware/checkAuth');
    //end point to balance route
    app.use('/balanced',authorizationCheck,balancedApi);
    ```

    To check for api
    ```
    In post mode
    http://localhost:4000/balanced

    with header 
    Authorization = JWT token
    and body in x-www-form-urlencoded format
    parenthesis = valid parenthesis data 
    ```
10. For Admin Authorization

    add checkAdminAuth.js inside middleware folder

    In checkAdminAuth.ja
    ```
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
                message: "Authentication Failed"
            })
        }
    }
    ```

11. For admin functionality 

    add admin.js file inside api/route folder

    In admin.js
    ```
    const express = require('express');
    const router = express.Router();

    const adminController = require('../controllers/adminController');

    router.get('/',adminController.getAllRegisteredUser);

    router.delete('/username/:username',adminController.deleteUser);

    module.exports = router;
    ```

    add admin end point in app.js file
    ```
    const adminApi = require('./api/routes/admin');

    //To check admin access
    const adminAuthorizationCheck = require('./middleware/checkAdminAuth');

    app.use('/api/admin',adminAuthorizationCheck,adminApi);
    ```

    Create adminController.js file inside api/controllers
    ```
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
    ```