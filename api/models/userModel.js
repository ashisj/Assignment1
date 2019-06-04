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