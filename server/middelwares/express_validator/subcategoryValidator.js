import { check } from "express-validator";
import {msgValidator} from "./errorMsgexpressValidator.js"
import { subcategoryModel } from "../../models/subcategoryModel.js";
//create subcategory
let createsubcategoryValidator=[
     check("name")
     .notEmpty()
     .withMessage("name is empty ")
     .custom(async(doc)=>{
             let subcategory=await subcategoryModel.findOne({name:doc})
             if(subcategory){throw new Error("already subcategory is hear")}
             return true
         })
     .isLength({min:4})
     .withMessage("subcategory is short letter")
     ,
     check("category")
     .notEmpty()
     .withMessage("category is EMPTY")
     .isMongoId()
     .withMessage("category is not found")
    ,msgValidator
]
//delete subcategory
let deletecategoryValidator=[
    check("id").isMongoId().withMessage("sub category is not found"),
   msgValidator
]
//update subcategory
let updatesubcategoryValidator=[
    check("id").isMongoId().withMessage("sub category is not found"),
    check("name")
     .notEmpty()
     .withMessage("name is empty ")
     .isLength({min:4})
     .withMessage("subcategory is short letter"),
     check('category').notEmpty().withMessage("category is empty")
    .isMongoId().withMessage("category is not found"),
    msgValidator
]
export{createsubcategoryValidator,deletecategoryValidator,updatesubcategoryValidator}
