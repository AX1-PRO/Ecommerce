import { reviewModel } from "../models/ReviewsModel.js"
import AsyncHandler from "express-async-handler"
import {Handel_ERROR_GLOBAL_APP} from "../utils/Handel_ERROR_GLOBAL_APP.js"
/**create new review
 * method  :  post
 * route : /api/v1/review/
 */
let create_review=AsyncHandler(async(req,res)=>{
      let {title,rating,product}=req.body
      let new_review=await reviewModel.create({title,rating,product,user:req.user._id})
      res.status(200).json({message:"review created"})
})
/**get all review
 * method : get
 * route : /api/v1/review/
*/
let get_all_reviews=AsyncHandler(async(req,res)=>{
      let all_review=await reviewModel.find()
      res.status(200).json(all_review)
})
/**get specfic review
 * method : get
 * route : /api/v1/review/id
 */
let get_specific_review=AsyncHandler(async(req,res,next)=>{
      let {id}=req.params
      let review=await reviewModel.findById(id)
      if(!review){
            return next(new Handel_ERROR_GLOBAL_APP("review is  not found",400))
      }else{
            res.status(201).json(review)
      }
})
/**update specfic review
 * method : put
 * route: /api/v1/review/id
 * body:id,name
 */
let update_review=AsyncHandler(async(req,res,next)=>{
      let {id}=req.params
      let {title,rating}=req.body
      let existing=await reviewModel.findOne({_id: id,user: req.user._id})
      if(!existing){
            return next(new Handel_ERROR_GLOBAL_APP(" review is not found",400))
      }
      let nexttitle = title ?? existing.title
      let next_rating=rating??existing.rating
      let update=await reviewModel.findByIdAndUpdate(id,{title: nexttitle,rating:next_rating},{new:true})

      if(!update){
            return next(new Handel_ERROR_GLOBAL_APP("updated faild ",404))
      }
      res.status(200).json({message: "updated Done"});
})
/**delete specfic review
 * method : delete
 * route : /api/v1/review/id
 */
let delete_review=AsyncHandler(async(req,res,next)=>{
      let {id}=req.params
      //check
      let review=await reviewModel.findByIdAndDelete(id)
      if(!review){
            return next(new Handel_ERROR_GLOBAL_APP("not found item or cant delete",404))
      }else{
            res.json({message:"deleted Done"})
      }
})
//export services
export{create_review,get_all_reviews,get_specific_review,update_review,delete_review}

