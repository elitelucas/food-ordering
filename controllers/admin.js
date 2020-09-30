const User = require('../models/user');
const Dish=require('../models/dish');
const Ingredient=require('../models/ingredient');
const OrderHistory=require("../models/order_history");
const Order=require("../models/order");
const { hashPassword } = require('../utils/authentication');
const fs = require('fs');
const path=require("path");

////dishes
exports.listAdminDishes = async (req, res, next) => {
    const dishes = await Dish.find({}); 
      
      return res.status(200).json({
        dishes
      });
};
// exports.detailDish = async (req, res, next) => {
//   const dish = await Dish.findOne({name:req.params.name});

    
//     return res.status(200).json({
//       dish
//     });
// };
exports.putDish = async (req, res, next) => {
  const dish = await Dish.findOne({name:req.params.name});

  if(req.file) {
        
    const tempPath = req.file.path;
    if (path.extname(req.file.originalname).toLowerCase() === ".png" || path.extname(req.file.originalname).toLowerCase() === ".jpeg"  || path.extname(req.file.originalname).toLowerCase() === ".jpg" ) {
        try{
            const targetPath = path.join(__dirname, "../uploads/dishes/"+req.user.name+path.extname(req.file.originalname).toLowerCase());

            const renamed=await fs.rename(tempPath, targetPath,()=>{});
            
            dish.name=req.body.name;
            dish.photo=path.extname(req.file.originalname).toLowerCase();
            dish.description=req.body.description;
            
            dish.elements=req.body.elements.split(',');
            dish.price=parseFloat(req.body.price);
            await dish.save();
            return res
            .status(200)
            .contentType("text/plain")
            .json({message:"ok"});
        }catch(ex){
            console.log(ex);
            return res
            .status(500)
            .contentType("text/plain")
            .json({message:"internal server error!"});
        }
        
        
    } else {
        fs.unlink(tempPath, err => {
            

            return res
            .status(403)
            .contentType("text/plain")
            .json({message:"Only .png and .jpg files are allowed!"});
        });
    }
  }else{
    dish.name=req.body.name;
    dish.description=req.body.description;
    
    dish.elements=req.body.elements.split(',');
    dish.price=parseFloat(req.body.price);
    await dish.save();
    return res
    .status(200)
    .contentType("text/plain")
    .json({message:"ok"});
  }
 
  
};

exports.createDish = async (req, res, next) => {
  const dish = new Dish();

  if(req.file) {
        
    const tempPath = req.file.path;
    if (path.extname(req.file.originalname).toLowerCase() === ".png" || path.extname(req.file.originalname).toLowerCase() === ".jpeg"  || path.extname(req.file.originalname).toLowerCase() === ".jpg" ) {
        try{
            const targetPath = path.join(__dirname, "../uploads/dishes/"+req.user.name+path.extname(req.file.originalname).toLowerCase());

            const renamed=await fs.rename(tempPath, targetPath,()=>{});
            
            dish.name=req.body.name;
            dish.photo=path.extname(req.file.originalname).toLowerCase();
            dish.description=req.body.description;
            
            dish.elements=req.body.elements.split(',');
            dish.price=parseFloat(req.body.price);
            await dish.save();
            return res
            .status(200)
            .contentType("text/plain")
            .json({message:"ok"});
        }catch(ex){
            console.log(ex);
            return res
            .status(500)
            .contentType("text/plain")
            .json({message:"internal server error!"});
        }
        
        
    } else {
        fs.unlink(tempPath, err => {
            

            return res
            .status(403)
            .contentType("text/plain")
            .json({message:"Only .png and .jpg files are allowed!"});
        });
    }
  }else{
    dish.name=req.body.name;
    dish.description=req.body.description;
    
    dish.elements=req.body.elements.split(',');
    dish.price=parseFloat(req.body.price);
    await dish.save();
    return res
    .status(200)
    .contentType("text/plain")
    .json({message:"ok"});
  }
 
  
};

exports.deleteDish = async (req, res, next) => {
  try{
    const dish = await Dish.findOne({name:req.params.name});
    await fs.unlink(path.join(__dirname, "../uploads/dishes/"+dish.name+path.extname(dish.photo).toLowerCase()), err => {
     
    });
    await dish.delete();
    return res
    .status(200)
    .contentType("text/plain")
    .json({message:"ok"});
  }catch(ex){
    return res
    .status(500)
    .contentType("text/plain")
    .json({error:"failed"});
  }
  
  
 
  
};


////////////////////////////////////////////////
//ingredients



exports.listIngredients = async (req, res, next) => {
  const ingredients = await Ingredient.find({}); 
    
    return res.status(200).json({
      ingredients
    });
};
// exports.detailDish = async (req, res, next) => {
//   const dish = await Dish.findOne({name:req.params.name});

  
//     return res.status(200).json({
//       dish
//     });
// };
exports.putIngredient = async (req, res, next) => {
  try{
    const ingredient = await Ingredient.findOne({name:req.params.name});
    ingredient.name=req.body.name;
  
    ingredient.price=parseFloat(req.body.price);
    await ingredient.save();
    return res
    .status(200)
    .contentType("text/plain")
    .json({message:"ok"});
  }catch(ex){
    return res
    .status(500)
    .contentType("text/plain")
    .json({error:"failed"});
  }
};

exports.createIngredient = async (req, res, next) => {
  try{
    const ingredient = new Ingredient();
    ingredient.name=req.body.name;
  
    ingredient.price=parseFloat(req.body.price);
    await ingredient.save();
    return res
    .status(200)
    .contentType("text/plain")
    .json({message:"ok"});
  }catch(ex){
    return res
    .status(500)
    .contentType("text/plain")
    .json({error:"failed"});
  }
};
exports.deleteIngredient = async (req, res, next) => {
  try{
    const ingredient = await Ingredient.findOne({name:req.params.name});
    
    await ingredient.delete();
    return res
    .status(200)
    .contentType("text/plain")
    .json({message:"ok"});
  }catch(ex){
    return res
    .status(500)
    .contentType("text/plain")
    .json({error:"failed"});
  }
};

////////////////////////////////////
//order history
exports.listHitory = async (req, res, next) => {
  const order=await Order.find({chiefStatus:'cancel'});
  var today=new Date();
  for(var i=0;i<order.length;i++){
    var date=new Date(order[i].updatedAt);
    if(today.getTime()-date.getTime()>60*60*1000)
    {
      var history=new OrderHistory();
      history.table=order[i].table;
      history.dishes=order[i].dishes;
      history.price=order[i].price;
      history.createdAt=order[i].createdAt;
      history.updatedAt=order[i].updatedAt;
      await history.save();
    }
  }
  history = await OrderHistory.find({}); 
    
    return res.status(200).json({
      history
    });
};