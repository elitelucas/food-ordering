const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({

  table: { type: String, required: true,index:true },
  dishes:[{
      dish:{
        type: Schema.Types.ObjectId,
        ref: 'dish',
        required: true
      },
      elements:{type:String}    
  }],
  price:{type:Number},
  createdAt:{type:Date,default:Date.now},
  updatedAt:{type:Date,default:Date.now},
  customerStatus:{type:String,enum:["order","receive","cancel"],default:"order"},
  chiefStatus:{type:String,enum:["accept","inProgress","cancel"],default:"inProgress"},

});


module.exports = mongoose.model('order', orderSchema);
