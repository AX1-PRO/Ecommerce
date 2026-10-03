import { check } from "express-validator";
import { msgValidator } from "./errorMsgexpressValidator.js";
//sign up
let signupVlidator=[
    check("name").notEmpty().withMessage("name is empty")
    .trim().isLength({min:6}).withMessage("name is a short letter"),
    check("email").notEmpty().withMessage("email is requird"),
    check("confirm_password").notEmpty().withMessage("confirm password is empty"),
    check("password").notEmpty().withMessage("password is empty")
    .custom((val,{req})=>{
        if(val!=req.body.confirm_password){
            throw  new Error("password is not equl confirm password")
        }
        return true
    }),
    msgValidator
]
//Login
let loginVlidator=[
    check("email").notEmpty().withMessage("email is empty")
    .isEmail().withMessage("this is not a email"),
    check("password").notEmpty().withMessage("password is empty"),
    msgValidator
]
//forget password
let forgetpasswordVlidator=[
    check('email').notEmpty().withMessage(" email is empty"),
    msgValidator
]
//verify_reset_code
let verifyresetcodeVlidator=[
    check("resetcode").notEmpty().withMessage("reset code is empty")
    .isLength({min:6}).withMessage("Reset code is to short ").
    isLength({max:6}).withMessage("Reset code is to long "),
    msgValidator
]
///reset_password
let resetpasswordVlidator=[
    check('email').notEmpty().withMessage("email Requierd"),
    check("newpassword").notEmpty().withMessage(" new password is empty")
    .isLength({min:8}).withMessage('password is short'),
    msgValidator
]
export {loginVlidator,signupVlidator,verifyresetcodeVlidator,resetpasswordVlidator,forgetpasswordVlidator}
