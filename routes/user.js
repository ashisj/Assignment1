const express = require('express');
const router = express.Router();
const User = require('../api/models/userModel');

router.get('/',(req,res)=>{
  console.log(req.user);
    res.render('user');
});

router.get('/registeredUsers',(req,res)=>{
    User.find({},{_id:0,email:1,username:1,dob:1,role:1},(err,users)=>{
      if(err){
        return res.send('Error!');
      }
      console.log(users);
        res.render('registeredUsers',{users : users});
    })
});


module.exports = router;
