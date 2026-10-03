import AsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import {userModel} from "../models/userModel.js"
import bcrypt from "bcryptjs"
import send_email from "../utils/send_email.js";
import { Handel_ERROR_GLOBAL_APP } from "../utils/Handel_ERROR_GLOBAL_APP.js";
import token_generator from "../utils/token_generate.js";
//SiGn up
 /* method  :  post
* role /user
 * route : /api/v1/auth/signup
 */
let sign_up=AsyncHandler(async(req,res,next)=>{
    let {name,email,password}=req.body
    let user=await userModel.findOne({email:email})
    if(user){
        return next(new Handel_ERROR_GLOBAL_APP("Email already hear",400))
    }
  let create_user=await userModel.create({
    name,
    email,
    password:await bcrypt.hash(password,10)
  })
  let token=token_generator(create_user._id)
  res.cookie('ecommerce_BX1_token',token,{
    httpOnly:true,
    secure:process.env.NODE_ENV === 'production',
    sameSite:'strict',
    maxAge:10*24*60*60*1000
  })
  res.status(200).json({message:"account is created"})

})
//Login
 /* method  :  post
 * route : /api/v1/auth/login
 * role /user
 */
let log_in=AsyncHandler(async(req,res,next)=>{
    let {email,password}=req.body
    //check user hear or not
     let checker=await userModel.findOne({email:email})

      if(!checker || !(await bcrypt.compare(password,checker.password))){
             return next(new Handel_ERROR_GLOBAL_APP("email or password is not correct",400))
       }
      let token= token_generator(checker._id)
      res.cookie('ecommerce_BX1_token',token,{
    httpOnly:true,
    secure:process.env.NODE_ENV === 'production',
    sameSite:'strict',
    maxAge:10*24*60*60*1000
  })
      res.status(200).json({message:"Login Done"})
})
/////////////
//protect middelware
/////////////
let protect_route=AsyncHandler(async(req,res,next)=>{

    //check if token exist or not
    let token;
    if(req.cookies.ecommerce_BX1_token){
         token=req.cookies.ecommerce_BX1_token;
        }
        if(!token){
             return next(new Handel_ERROR_GLOBAL_APP("token is not found",400))
        }
   //check if token verifiy or not

  let decoded;
  //= jwt.verify(token,process.env.JWT_KEY)
  try {
  decoded = jwt.verify(token, process.env.JWT_KEY);
} catch (error) {
  return next(new Handel_ERROR_GLOBAL_APP("Invalid or expired token", 401));
}

  let check_user=await userModel.findById(decoded.userid)
  if(!check_user){
                 return next(new Handel_ERROR_GLOBAL_APP("user is not found",400))
  }
  //check if user change password after token edit
  if(check_user.password_changed_date){
    let handeldatepassword=Math.floor(check_user.password_changed_date.getTime()/1000,10)
    if(handeldatepassword>decoded.iat){
      return next(new Handel_ERROR_GLOBAL_APP("password changed please register or login again",400))
    }
  }

  req.user=check_user
  next()
})
//allowed to accses route
////////////////
////////////////
////////////////
///////////////
let allowed_to=(...role)=>AsyncHandler(async(req,res,next)=>{
  if(!role.includes(req.user.role)){
      return next(new Handel_ERROR_GLOBAL_APP("not allowed to accses this route",403))
  }
  next()
})

//forget password
 /* method  :  post
 * route : /api/v1/auth/forgetpassword
 */
let forget_password=AsyncHandler(async(req,res,next)=>{
  //1- check if user exist
  let {email}=req.body
  let chek_user=await userModel.findOne({email})
  let reset_code;
  if(!chek_user){
          return next(new Handel_ERROR_GLOBAL_APP("email not found",400))
  }else{
 //////////////// GENERATE RANDOM 6 Diget/////
  reset_code=(Math.floor(100000+Math.random()*900000)).toString()
   //save digit code from DB
   await userModel.updateOne({_id:chek_user.id},
    {
      password_reset_code:reset_code,
      password_reset_verified:false,
      //time expierd 10 min
      password_reset_expires:Date.now()+10*60*1000,
    })
   }
   //send digit for email
   try{
    await send_email({
    email:chek_user.email,
    subject:"confirm code is active for 10 min",
    message:`hi ${chek_user.name} \n we send your code to confirm email \n please dont tell tis code to anybody \n ${reset_code}`
   })
   }
   catch(err){
     await userModel.updateOne({_id:chek_user.id},
      {
        password_reset_code:undefined,
        password_reset_verified:undefined,
      password_reset_expires :undefined,
   })
    return next(new Handel_ERROR_GLOBAL_APP(`cant send code to email to user : ${chek_user.name}`,500))
   }
   res.status(200).json({message:" send your email is Done"})
})


//veryfiy code when reset code
/**
 * route : /api/v1/auth/verifyresetcode
 * method:post
 */
let verify_reset_code=AsyncHandler(async(req,res,next)=>{

let {resetcode}=req.body
if (!resetcode) {
    return next(new Handel_ERROR_GLOBAL_APP("Reset code is required", 400));
}
let user=await userModel.findOne({
  password_reset_code:resetcode,
  password_reset_expires :{$gt:Date.now()}
})
if(!user){
      return next(new Handel_ERROR_GLOBAL_APP(`Code is incorrect`,400))
}
user.password_reset_verified=true
await user.save()
res.status(200).json({message:" code is true"})
})

//new password after reset code
/**
 * route : /api/v1/auth/resetpassword
 * method:post
 */
let reset_password=AsyncHandler(async(req,res,next)=>{
let {newpassword,email}=req.body
let user=await userModel.findOne({email})
if(!user){
        return next(new Handel_ERROR_GLOBAL_APP(`user is not found `,400))
      }
if(!user.password_reset_verified){
          return next(new Handel_ERROR_GLOBAL_APP(`not verify account `,400))
      }
      await userModel.updateOne({_id:user.id},
    {
      password:await bcrypt.hash(newpassword,10),
      password_reset_code:undefined,
      password_reset_verified:undefined,
      password_reset_expires:undefined,
    })
    let token=token_generator(user._id)
    res.cookie('ecommerce_BX1_token',token,{
    httpOnly:true,
    secure:process.env.NODE_ENV === 'production',
    sameSite:'strict',
    maxAge:10*24*60*60*1000
  })
    res.status(200).json({message:"Reset password is Done"})
})
//logOut
//riute/ /api/v1/auth/Logout
//method /post
let Log_out=AsyncHandler(async(req,res,next)=>{
res.clearCookie("ecommerce_BX1_token",{
  httpOnly:true,
  secure:process.env.NODE_ENV === 'production',
  sameSite:'strict'
})
res.status(200).json({message:'Logged out Done'})
})
export {sign_up,log_in,protect_route,allowed_to,forget_password,verify_reset_code,reset_password,token_generator,Log_out}
