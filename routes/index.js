const express = require('express');
const router = express.Router();

router.get('/',isLoggedIn,(req,res)=>{
    res.render('index');
});

function isLoggedIn(req,res,next){
  console.log(req.user);
  if(req.user){
    res.redirect('/user');
  }
  return next();
}
module.exports = router;
