import {orderModel} from "../models/orderModel.js"
import {cartModel} from "../models/cartModel.js"
import { userModel } from "../models/userModel.js";
import {productModel} from "../models/productModel.js"
import AsyncHandler from "express-async-handler";
import {Handel_ERROR_GLOBAL_APP} from "../utils/Handel_ERROR_GLOBAL_APP.js"
import Stripe from "stripe";
import dotenv from 'dotenv';

dotenv.config();
//mat be run or not hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

///////////////////////////////////////////////////////////////

/**create cash order
 * method : post
 * route: /api/v1/order/cartid
 */
let createCashOrder=AsyncHandler(async(req,res,next)=>{
    let taxies=100
    //get cart user
let cart=await cartModel.findOne({_id: req.params.cartid,user: req.user._id})
//if cart not found
if(!cart){
     return next(new Handel_ERROR_GLOBAL_APP("cart not fount",400))
}
//if cart found
//cart price
let cartPrice=cart.totalpriceafterdiscount?cart.totalpriceafterdiscount:cart.totalprice
//total price after add taxies
let totalorderprice=cartPrice+taxies
//creat order cash
let order=await orderModel.create({
    user:req.user._id,
    cartitems:cart.items,
    totalorderprice,
    address:req.user.address
})
//less product after order done
if(order){
    let bulkopth=cart.items.map((el)=>({
    updateOne: {
      filter: { _id:el.product},
      update: { $inc: { count: -el.count } }
    }
    }))
    await productModel.bulkWrite(bulkopth)
    //clear cart after done
    await cartModel.findByIdAndDelete(req.params.cartid)
}
res.status(200).json({message:"order is Done"})
})

/////////////////////////////////////////////////////////

/**get checkout stripe
 * method : get
 * route: /api/v1/order/checkout/cartid
 * role: admin
 */
let checkOutSecion=AsyncHandler(async(req,res,next)=>{
    console.log("running")
    let taxies=100
    let cart=await cartModel.findOne({_id: req.params.cartid,user: req.user._id})
          //if cart not found
       if(!cart){
            return next(new Handel_ERROR_GLOBAL_APP("cart not fount",400))
       }
       //if cart found
       //cart price
       let cartPrice=cart.totalpriceafterdiscount?cart.totalpriceafterdiscount:cart.totalprice
       //total price after add taxies
       let totalorderprice=cartPrice+taxies
     //create seation
     let session = await stripe.checkout.sessions.create({
       line_items: [
         {
           price_data: {
             currency: "egp",
             product_data: {
               name: `Order for ${req.user.name}`,
             },
             unit_amount: Math.round(totalorderprice * 100),
           },
           quantity: 1,
         },
       ],
         mode: "payment",
         success_url: `${req.protocol}://${req.get("host")}/order`,
         cancel_url: `${req.protocol}://${req.get("host")}/cart`,
         customer_email: req.user.email,
         client_reference_id: req.params.cartid,
         metadata: {
           cartid: req.params.cartid,
           userid: req.user._id.toString(),
  },
});
     //send setion
     res.status(200).json(session)
})
export let webhookCheckout = AsyncHandler(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    //fake url beta
    event = stripe.webhooks.constructEvent(  req.body, sig, process.env.WEBHOOK_SECRET);
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    // Cart ID
    const cartId = session.client_reference_id;
    // User ID
    const userId = session.metadata.userid;
    // Get user
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }
    // Get cart
    const cart = await cartModel.findOne({
      _id: cartId,
      user: userId,
    });
    if (!cart) {
      return res.status(200).json({
        received: true,
        message: "Cart already processed or not found",
      });
    }
    // Cart price
    const cartPrice = cart.totalpriceafterdiscount
      ? cart.totalpriceafterdiscount
      : cart.totalprice;
    // Taxes
    const taxies = 120;
    // Total order price
    const totalorderprice = cartPrice + taxies;
    // Create order
    const order = await orderModel.create({
      user: userId,
      cartitems: cart.items,
      totalorderprice,
      address: user.address,
      paymentMethod: "card",
      ispay: true,
      payat: new Date(),
    });
    // Decrease products quantity
    if (order) {
      const bulkOptions = cart.items.map((item) => ({
        updateOne: {
          filter: {
            _id: item.product,
          },
          update: {
            $inc: {
              count: -item.count,
            },
          },
        },
      }));
      await productModel.bulkWrite(bulkOptions);
      // Delete cart
      await cartModel.findByIdAndDelete(cartId);
    }
  }
  res.status(200).json({ received: true, });
});
//
/**all order
 * method : get
 * route: /api/v1/order
 * role:admin
*/
let getOrders=AsyncHandler(async(req,res,next)=>{
    let orders=await orderModel.find()
    if(!orders){
        return next(new Handel_ERROR_GLOBAL_APP("order not fount",400))
    }
     res.status(200).json(orders)
    })
/**spesfic order
 * method : get
 * route: /api/v1/order/orderid
 * role:admin
*/
let spesficOrder=AsyncHandler(async(req,res,next)=>{
    let {cartid}=req.params
    let order=await orderModel.findById(cartid)
    if(!order){
        return next(new Handel_ERROR_GLOBAL_APP("order not fount",400))
    }
     res.status(200).json(order)
    })

//
/**get user order
 * method : get
 * route: /api/v1/order/me
 * role:user logged in
*/
let userOrders=AsyncHandler(async(req,res,next)=>{
    let orders=await orderModel.find({user:req.user._id})
    if(!orders){
        return next(new Handel_ERROR_GLOBAL_APP("order not fount",400))
    }
    res.status(200).json(orders)
})
//
// delete user order
// method: DELETE
// route: /api/v1/order/me/:orderid
// role: user logged in

let deleteUserOrder = AsyncHandler(async (req, res, next) => {
    let { orderid } = req.params;
    let order = await orderModel.findOneAndDelete({
        _id: orderid,
        user: req.user._id
    });
    if (!order) {
        return next(   new Handel_ERROR_GLOBAL_APP("order not found", 404) );
    }

    res.status(200).json({
        message: "Order deleted successfully"
    });})
// delete spesfic order
// method: DELETE
// route: /api/v1/order/:orderid
// role: admin

let deleteSpesficOrder = AsyncHandler(async (req, res, next) => {
    let order = await orderModel.findOneAndDelete({
        _id: req.params.orderid
    });
    if (!order) {
        return next(   new Handel_ERROR_GLOBAL_APP("order not found", 404) );
    }

    res.status(200).json({
        message: "Order deleted successfully",

    });
});
// update order pay
// method: put
// route: /api/v1/order/:id/pay
// role: admin

let updateOrdertopay = AsyncHandler(async (req, res, next) => {
    let order = await orderModel.findById(req.params.id);
    if (!order) {
        return next(   new Handel_ERROR_GLOBAL_APP("order not found", 404) );
    }
    order.ispay=true,
    order.payat=Date.now()
    await order.save()
    res.status(200).json({
        message: "Order updated pay to successfully",

    });
});
// update order delevary
// method: put
// route: /api/v1/order/:id/delivary
// role: admin

let updateOrdertodelivary = AsyncHandler(async (req, res, next) => {
    let order = await orderModel.findById(req.params.id);
    if (!order) {
        return next(   new Handel_ERROR_GLOBAL_APP("order not found", 404) );
    }
    order.isdelivary=true,
    order.delivaryat=Date.now()
    await order.save()
    res.status(200).json({
        message: "Order updated delivary to successfully",

    });
});
 export {getOrders,createCashOrder,spesficOrder,userOrders,updateOrdertodelivary,deleteUserOrder,deleteSpesficOrder,updateOrdertopay,checkOutSecion}
