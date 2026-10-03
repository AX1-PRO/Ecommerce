import  {check,body}  from "express-validator"
import {msgValidator} from "./errorMsgexpressValidator.js"
import { userModel } from "../../models/userModel.js"
import bcrypt from "bcryptjs"
/**one user  */
let specificuserValidator=[
    check("id").isMongoId().withMessage("user is not found"),
    msgValidator
]
/**create user */
let createuserValidator=[
    body("email").notEmpty().withMessage("email is empty")
    .custom(async(doc)=>{
        let user=await userModel.findOne({name:doc})
        if(user){throw new Error("already email is hear")}
        return true
    }),
    body("password").notEmpty().withMessage("password is empty")
    .custom((pass,{req})=>{
        if(pass!=req.body.password_confirm){
            throw new Error("password is not equal confirm password")
        }
        return true
    }),
    body("password_confirm").notEmpty().withMessage("password confirm is empty"),
    body("name").notEmpty().withMessage("name is empty"),
    check("phone").optional().isMobilePhone('ar-EG').withMessage("JUST EGYPT NUMBER"),
    msgValidator
]
/**update user */
let updateuserValidator=[
    check("id").isMongoId().withMessage("user is not found"),
    check("phone").optional().isMobilePhone('ar-EG').withMessage("JUST EGYPT NUMBER"),
   msgValidator
]
/**delete user */
let deleteuserValidator=[
    check("id").isMongoId().withMessage("user is not found"),
   msgValidator
]
//when change pass
let changepasswordValidator=[
    check("id").isMongoId().withMessage("user is not found"),
    check("password").notEmpty().withMessage(" old password is empty"),
    check("confirm_newpassword").notEmpty().withMessage(" confirm password is empty")
    ,check("new_password").notEmpty().withMessage("the new password is empty")
    .custom(async(val,{req})=>{
       let existing=await userModel.findById(req.params.id)
       if(!existing){
        throw new Error("user is not found")
    }
    else{
        let unhash_old=await bcrypt.compare(req.body.password,existing.password)
        if(!unhash_old){
            throw new Error("old password is faild")
        }
        if(val!=req.body.confirm_newpassword){
            throw new Error("new password != confirm new password")
        }
       }
    })
    ,
    msgValidator
]
    export{specificuserValidator,createuserValidator,updateuserValidator,deleteuserValidator,changepasswordValidator}
    //end tasks
