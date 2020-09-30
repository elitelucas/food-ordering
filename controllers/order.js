const Dish=require('../models/dish');
const OrderHistory=require("../models/order_history");
const Order=require("../models/order");
exports.listDishes = async (req, res, next) => {
    
    var order=new Order({tabel:req.params.no});
    saved=await order.save();
    req.session.id=saved._id;
    await req.session.save();
    const dishes = await Dish.find({}); 
      
      return res.status(200).json({
        dishes
      });
};

exports.showDish = async (req, res, next) => {
    const dish = await Dish.findOne({name:req.params.name}); 
      
      return res.status(200).json({
        dish
      });
};

exports.showOrder = async (req, res, next) => {
    try{
        if(req.session.id!==undefined){
            const order=await Order.findById(req.session.id);
            return res.status(200).json({
                order
            });
        }else
            return res.status(200).json({
                order:{}
            });
    }catch(ex){
        next(ex);
    }
    
};
exports.postOrder = async (req, res, next) => {
    try{
        const order=await Order.findById(req.session.id);
        order.dishes=req.body.dishes;
        var price=0;
        for(var i=0;i<req.body.dishes;i++){
            const tmp=await Dish.findById(req.body.dishes[i].dish);
            price+=tmp.price;
        }
        order.price=price;
        
        await order.save();
        return res.status(200).json({
            mesage:'ok'
        });
        
    }catch(ex){
        next(ex);
    }   

};
exports.patchOrder = async (req, res, next) => {
    try{
        const order=await Order.findById(req.session.id);
        order.customerstatus=req.body.action;
        
        await order.save();
        return res.status(200).json({
            mesage:'ok'
        });
        
    }catch(ex){
        next(ex);
    }   

};