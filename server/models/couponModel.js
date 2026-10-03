import mongoose from "mongoose"
let pattern=new mongoose.Schema({
name:{
    type:String,
    trim:true,
    required:[true,"requierd name"],
    unique:true
},
expier:{
    type:Date,
    required:[true,"coupon expierd time req"],
},
discount:{
    type:Number,
    required:[true,"coupon discount req"],

},
active:{
    type:Boolean,
    default:true
},
},{timestamps:true})
let couponModel=mongoose.model("coupon",pattern)
export  {couponModel}
