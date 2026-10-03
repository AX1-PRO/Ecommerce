import { cartModel } from "../models/cartModel.js";
import {productModel} from "../models/productModel.js"
import {couponModel} from "../models/couponModel.js"
import AsyncHandler from "express-async-handler"
import {Handel_ERROR_GLOBAL_APP} from "../utils/Handel_ERROR_GLOBAL_APP.js"
//calc
let calc=(cart)=>{
    let total_price=0
    cart.items.forEach((el)=>{
        return total_price+=(el.count*el.price)
    })
    cart.totalprice=Number(total_price)
    cart.totalpriceafterdiscount=null
    return cart
}
/**add to cart
 * method : post
 * route : /api/v1/cart
 */
let add_to_cart=AsyncHandler(async(req,res,next)=>{
    let {productid,color,count}=req.body
    //check user have acart or not
    let cart_check=await cartModel.findOne({user:req.user.id})
    //get orignal price
    let orignal_price=await productModel.findById(productid)
    if (!orignal_price) {
  return next(new Handel_ERROR_GLOBAL_APP("Product not found", 404));
}
    //if user dont have acart
    if(!cart_check){
         cart_check=await cartModel.create({ user:req.user.id,items:[ { product:productid, color:color,count:count||1, price:(orignal_price.price-orignal_price.discount)||orignal_price.price }],})
    }else{
        //check if product existing
        let checked_existing=cart_check.items.findIndex((el)=>{return el.product.toString()===productid&&el.color===color})
        //if existing
        if(checked_existing>-1){
            let update_cart=cart_check.items[checked_existing]
            update_cart.count +=1;
           cart_check.items[checked_existing]=update_cart
        }else{
            //if not existing
            cart_check.items.push({ product:productid, color:color,count:count||1, price:(orignal_price.price-orignal_price.discount)||orignal_price.price })
        }
    }
    //calculate price
    calc(cart_check)
    await cart_check.save()
    res.status(200).json({message:"added done"})
})
/**get to cart
 * method : get
 * route : /api/v1/cart
 */
let one_cart = AsyncHandler(async (req, res, next) => {
  let cart = await cartModel .findOne({ user: req.user.id }) .populate('items.product');
  if (!cart) {
    return res.status(200).json({
      user: req.user.id,
      items: [],
      totalprice: 0,
      totalpriceafterdiscount: 0
    });
  }

  res.status(200).json(cart);
});
/**delete to cart
 * method : delete
 * route : /api/v1/cart/:itemid
 */
let delete_from_cart=AsyncHandler(async(req,res,next)=>{
    let cart=await cartModel.findOneAndUpdate({user:req.user.id},
        {
            $pull:{items:{_id:req.params.itemid}}
        }
        ,{new:true})
    calc(cart)
    await cart.save()
    res.status(200).json({message:"Deleted Done"})
})
/**delete all cart item
 * method : delete
 * route : /api/v1/cart/
 */
let clear_all_cart=AsyncHandler(async(req,res,next)=>{
    const cart = await cartModel.findOneAndUpdate(
    { user: req.user.id },
    {
      $set: {
        items: [],
        totalprice: 0,
        totalpriceafterdiscount: 0
      }
    },
    { new: true }
  );
    res.status(200).json({message:"deleted Done"})
})
//update quantity product from cart
/**update item
 * method : put
 * route : /api/v1/cart/itemid
 */
let update_cart_item=AsyncHandler(async(req,res,next)=>{
    let {product_count}=req.body
    console.log(req.body)
    let cart=await cartModel.findOne({user:req.user.id})
    if(!cart){
        return next(new Handel_ERROR_GLOBAL_APP("cart not found ",404))
    }
    //select index item we have delete
    let item_target=cart.items.findIndex((el)=>{return el._id.equals(req.params.itemid)})
    //check if item target founded
    if(item_target>-1){
        let item=cart.items[item_target];
        item.count=product_count
        cart.items[item_target]=item
        //calc price
         calc(cart)
           await cart.save()
    }else{
        return next(new Handel_ERROR_GLOBAL_APP("product item not hear in cart ",404))
    }
    res.status(200).json({message:"updated done"})
})
//applay coupon
/* method : post
 * route : /api/v1/cart/applaycoupon
 */
let applyCoupon=AsyncHandler(async(req,res,next)=>{
    //checked coupon
    let coupon=await couponModel.findOne({name:req.body.coupon,expier:{$gt:Date.now()}})
    if(!coupon){
     return next(new Handel_ERROR_GLOBAL_APP("coupon not active",400))
    }
    //caet user
    let cart=await cartModel.findOne({user:req.user._id})
   //calc price after discount
   let totalpriceafterdiscount=(cart.totalprice-(cart.totalprice*coupon.discount)/100).toFixed(2)
   cart.totalpriceafterdiscount=totalpriceafterdiscount
   await cart.save()
       res.status(200).json({message:"coupon is running --_--",discount:coupon.discount,totalprice:cart.totalprice,totalpriceafterdiscount})

})
export {add_to_cart,one_cart,delete_from_cart,clear_all_cart,update_cart_item,applyCoupon}
