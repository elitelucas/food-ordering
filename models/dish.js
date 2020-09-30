const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dishSchema = new Schema({

  name: { type: String, required: true,index:true },
  photo:{type:String,required:true},
  description:{type:String,required:true},
  ingredients:[{
    type: Schema.Types.ObjectId,
    ref: 'ingredient',
    required: true
  }],
  elements:[String],
  price:{type:Number,required:true},
  createdAt:{type:Date,default:Date.now}
});


module.exports = mongoose.model('dish', dishSchema);
