import  {check}  from "express-validator"
import {msgValidator} from "./errorMsgexpressValidator.js"
import { brandModel } from "../../models/brandModel.js"
/**specific brand  */
let specificbrandVlidator=[
    check("id").isMongoId().withMessage("brand is not found"),
   msgValidator
]
/**create brand */
let createbrandVlidator=[
    check("name").notEmpty().withMessage("name is empty")
     .isLength({min:4}).withMessage("brand is small letter")
     .custom(async(doc)=>{
            let brand=await brandModel.findOne({name:doc})
            if(brand){throw new Error("brand is already hear")}
            return true
        }),
    msgValidator
]
/**update brand */
let updatebrandVlidator=[
    check("id").isMongoId().withMessage("brand is not found"),
    check('name').isLength({min:5}).withMessage("short name"),
   msgValidator
]
/**delete brand */
let deletebrandbyVlidator=[
    check("id").isMongoId().withMessage("brand is not found"),
   msgValidator
]
export{specificbrandVlidator,createbrandVlidator,deletebrandbyVlidator,updatebrandVlidator}
 //end tasks
