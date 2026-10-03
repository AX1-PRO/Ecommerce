import {couponModel} from "../models/couponModel.js"
import AsyncHandler from "express-async-handler"
import {Handel_ERROR_GLOBAL_APP} from "../utils/Handel_ERROR_GLOBAL_APP.js"
/**create new coupon
 * method  :  post
 * route : /api/v1/coupon/
 *  role : admin
 */
let create_coupon=AsyncHandler(async(req,res)=>{

      let {name,discount,expier}=req.body
      let new_coupon=await couponModel.create({name,discount,expier})
      res.status(201).json({message:"coupon created"})
})
/**get all coupon
 * method : get
 * route : /api/v1/coupon/
*/
let get_all_coupons=AsyncHandler(async(req,res)=>{
      let coupons=await couponModel.find()
      res.status(200).json({length:coupons.length,data:coupons})
})
/**get specfic coupon
 * method : get
 * route : /api/v1/coupon/id
 */
let get_specific_coupon=AsyncHandler(async(req,res,next)=>{
      let {id}=req.params
      let coupon=await couponModel.findById(id)
      if(!coupon){
            return next(new Handel_ERROR_GLOBAL_APP("coupon is  not found",400))
      }
            res.status(201).json(coupon)

})
/**update specfic coupon
 * method : put
 * route: /api/v1/coupon/id
 * body:id,name
 * * role : admin
 */
let update_coupon=AsyncHandler(async(req,res,next)=>{
      let {id}=req.params
      let {name,discount,expier}=req.body
      let existing=await couponModel.findById(id)
      if(!existing){
            return next(new Handel_ERROR_GLOBAL_APP(" coupon  not found",400))
      }
      //  create img with multer
      let nextName = name || existing.name
      let nextdiscount= discount||existing.discount
      let nextexpier=expier||existing.expier
      let update=await couponModel.findByIdAndUpdate(id,{name: nextName, discount:nextdiscount,expier:nextexpier},{new:true})
       if (update) {
         res.status(200).json({message: "coupon updated successfully"});
       }
       if(!update){
           return next(new Handel_ERROR_GLOBAL_APP("updated faild ",404))
       }
})
/**delete specfic coupon
 * method : delete
 * route : /api/v1/coupon/id
 * role : admin
 */
let delete_coupon=AsyncHandler(async(req,res,next)=>{
      let {id}=req.params
      let coupon=await couponModel.findByIdAndDelete(id)
      if(!coupon){
            return next(new Handel_ERROR_GLOBAL_APP("not found item or cant delete",404))
      }else{
            res.json({message:"deleted Done"})
      }
})
//export services
export{create_coupon,get_all_coupons,get_specific_coupon,update_coupon,delete_coupon}

