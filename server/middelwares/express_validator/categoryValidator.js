import  {check,body}  from "express-validator"
import {msgValidator} from "./errorMsgexpressValidator.js"
import { categoryModel } from "../../models/categoryModel.js"
/**get spesfic category  */
let specificcategoryValidator=[
    check("id").isMongoId().withMessage("category is not found"),
    msgValidator
]
/**create category */
let createcategoryValidator=[
    body("name").notEmpty().withMessage("name is empty")
    .isLength({min:4}).withMessage("category is short letter")
    .custom(async(doc)=>{
        let category=await categoryModel.findOne({name:doc})
        if(category){throw new Error("already category is Hear")}
        return true
    }),
    msgValidator
]
/**update  category*/
let updatecategoryValidator=[
    check("id").isMongoId().withMessage("category is not found"),
    check('name').isLength({min:5}).withMessage("short name"),
   msgValidator
]
/**delete  category*/

let deletecategoryValidator=[
    check("id").isMongoId().withMessage("category is not found"),
   msgValidator
]
    export{specificcategoryValidator,createcategoryValidator,updatecategoryValidator,deletecategoryValidator}
    //end tasks
