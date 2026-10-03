import mongoose from "mongoose"
let pattern=new mongoose.Schema({
user:{
    type:mongoose.Schema.ObjectId,
    ref:"user",
    requierd:[true,"order must be user"]
},
cartitems:[
     {
         product:{
             type:mongoose.Schema.ObjectId,
             ref:"product"
         },
        count: Number,
         color:String,
         price:Number
     }
],
taxies:{
    type:Number,
    default:0
},
totalorderprice:Number,
paymentMethod:{
    type:String,
    enum:["cash","card"],
    default:"cash"
},
ispay:{
    type:Boolean,
    default:false
},
payat:Date
,isdelivary:{
    type:Boolean,
    default:false
},
address:{
    details:String,
    phone:String,
    city:String,
    postlocation:String
}
,delivaryat:Date
},{timestamps:true})
pattern.pre("find", function () {
  this.populate({
    path: "user",
    select: "name address email phone"
  }).populate({
    path: "cartitems.product"
  });
});
let orderModel=mongoose.model("order",pattern)
export  {orderModel}
