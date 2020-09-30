const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderHistorySchema = new Schema({

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
  createdAt:{type:Date},
  updatedAt:{type:Date}
  

});


module.exports = mongoose.model('order_history', orderHistorySchema);
