import  {check}  from "express-validator"
import {msgValidator} from "./errorMsgexpressValidator.js"
import {reviewModel} from '../../models/ReviewsModel.js'
/**create review */
let createreviewValidator=[
    check("title").notEmpty().withMessage("requierd title"),
    check("rating").notEmpty().withMessage("rating is empty")
    .isFloat({min:1,max:5}).withMessage("rating min 1 to 5"),
    check('product').isMongoId().withMessage("product is not heare")
    .custom(async(el,{req})=>{
      let review=await reviewModel.findOne({user:req.user._id,product:el})
      if(review){
                throw new Error("already user commented is product ")
      }
      return true
    }),
    msgValidator
]
/**update review */
let updateReviewValidator=[
    check("id").isMongoId().withMessage("review is not found")
    .custom(async(val,{req})=>{
        let review=await reviewModel.findById(val)
        if(!review){
           throw new Error("user is not  found ")
        }
        if(!review.user.equals(req.user._id)){
           throw new Error("user not allowed update")
        }
        return true
    })
    ,
   msgValidator
]
/**delete review */
let deletereviewValidator=[
    check("id").isMongoId().withMessage("review is not found")
    .custom(async(val,{req})=>{
        if(req.user.role==="user"){
            let review=await reviewModel.findById(val)
            if(!review){
           throw new Error("user is not  found ")
        }
        if(!review.user.equals(req.user._id)){
           throw new Error("user not allowed update")
        }
        }
    })
    ,
   msgValidator
]
export{createreviewValidator,updateReviewValidator,deletereviewValidator}
 //end tasks
