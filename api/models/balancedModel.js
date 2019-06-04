var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var balancedSchema = new Schema({
  message   :  {type:String,default:''},
  username  : {type:String,required:true},
  attempts  : {type:Number,default:0},
})

module.exports = mongoose.model('balanced',balancedSchema,'balanced');