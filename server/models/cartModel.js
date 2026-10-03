import mongoose from "mongoose";
let pattern=new mongoose.Schema({
    items:[
        {
            product:{
                type:mongoose.Schema.ObjectId,
                ref:"product"
            },
           count: {
               type: Number,
               default: 1
           },
            color:String,
            price:Number
        }
    ],
    totalprice:Number,
    totalpriceafterdiscount:Number,
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"user"
    }
},{timestamps:true})
let cartModel=mongoose.model("cart",pattern)
export {cartModel}
