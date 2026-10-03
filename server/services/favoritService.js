import { userModel } from "../models/userModel.js";
import AsyncHandler from "express-async-handler";
import {Handel_ERROR_GLOBAL_APP} from "../utils/Handel_ERROR_GLOBAL_APP.js"
/**create new fav
 * method  :  post
 * route : /api/v1/favorit/
 *  * /*logged */
let create_favorit=AsyncHandler(async(req,res,next)=>{
let check_user=await userModel.findByIdAndUpdate(req.user._id,{
    $addToSet:{favorits:req.body.productid}
},{new:true})
if(!check_user){
             return next(new Handel_ERROR_GLOBAL_APP("created faild ",404))
}
res.status(200).json({message:"created Done"})
})
/**delet  fav
 * method  :  delete
 * route : /api/v1/favorit/:productid
 * /*logged */
let delete_favorit=AsyncHandler(async(req,res,next)=>{
let check_user=await userModel.findByIdAndUpdate(req.user._id,{
    $pull:{favorits:req.params.id}
},{new:true})
res.status(200).json({message:"removed Done"})
})
//get all favorits
let get_all_fav=AsyncHandler(async(req,res,next)=>{
    let data=await userModel.findById(req.user._id).populate("favorits")
    res.status(201).json(data.favorits)
})
export {create_favorit,delete_favorit,get_all_fav}

