const express = require('express');
const app = express();
const logger = require('morgan');
const bodyParser = require('body-parser');
require('./config.js');

const port = process.env.PORT || 3000;
const mongoose = require('mongoose');

//Database connection
mongoose.connect(process.env.MONGODB_CONNECTION, {useNewUrlParser: true},(err) =>{
    if(err){
        console.log(err.message);
    } else {
        console.log("Conncected Successfully");
    }
});

//End poin for api
const authApi = require('./api/routes/auth');
const balancedApi = require('./api/routes/balancedRoute');
const adminApi = require('./api/routes/admin');

//User Defined Middleware
const authorizationCheck = require('./middleware/checkAuth');
const adminAuthorizationCheck = require('./middleware/checkAdminAuth');


app.use(logger('dev'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })); 
// parse application/json
app.use(bodyParser.json());

// add route to auth api
app.use('/api/auth',authApi);
// add route to balanced api
app.use('/balanced',authorizationCheck,balancedApi);
// add route to admin api
app.use('/api/admin',adminAuthorizationCheck,adminApi);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// catch all error
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({message:err.message})
});

//Server connection
app.listen(port,function(){
    console.log("Server is running on port " + port);
});
