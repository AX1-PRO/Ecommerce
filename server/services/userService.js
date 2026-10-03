import bcrypt from "bcryptjs"
import { userModel } from "../models/userModel.js"
import slugify from "slugify"
import { token_generator } from "./authService.js"
import AsyncHandler from "express-async-handler"
//global error
import {Handel_ERROR_GLOBAL_APP} from "../utils/Handel_ERROR_GLOBAL_APP.js"
//file control
import { Create_img,Delete_img } from "../utils/uploads_config/handel_file_imges.js"
////////////////////////////////////////
/**create new user
 * method  :  post
 * route : /api/v1/user/
 */
let create_User=AsyncHandler(async(req,res)=>{
      //  create img with multer
      let {name,password}=req.body
     let handel_create_img=await Create_img(req,"user")
     req.body.img_cover=handel_create_img
      //END RESIZE IMG
      let hashpassword=await bcrypt.hash(password,10)
      let newuser=await userModel.create({...req.body,password:hashpassword,slug:slugify(name)})
      res.status(200).json({message:"user created Done"})
})
/**get all user
 * method : get
 * route : /api/v1/user/
*/
let get_all_user=AsyncHandler(async(req,res)=>{
      let filter={}
      //search
      if(req.query.keyword){
       filter.$or = [
         { name: { $regex: req.query.keyword, $options: "i",}, },
         {phone: { $regex: req.query.keyword, $options: "i", },},
         {email: { $regex: req.query.keyword,$options: "i",},
    },
      ];}
      let alldata=await userModel.find(filter)
      res.status(200).json({length:alldata.length,data:alldata})
})
/**get specfic user
 * method : get
 * route : /api/v1/user/id
 */
let get_user=(target)=>AsyncHandler(async(req,res,next)=>{
      let {id}=req.params
      let cheack=await userModel.findById(id)
      if(!cheack){
            return next(new Handel_ERROR_GLOBAL_APP("user not found",400))
      }else{
            if(target==="user"){
                  res.status(201).json({
                        id:cheack._id,
                        name:cheack.name,
                        email:cheack.email,
                        phone:cheack.phone,
                        imageUrl:cheack.imageUrl,
                        role:cheack.role,
                        createdAt:cheack.createdAt.getFullYear(),
                        address:cheack.address,
                        favorits:cheack.favorits
                  })
            }else if(target==="admin"){
                  res.status(201).json(cheack)
            }
      }
})
/**update specfic user
 * method : put
 * route: /api/v1/user/id
 */
let update_user=AsyncHandler(async(req,res,next)=>{
      let {id}=req.params
      let {name,role,phone}=req.body
      //old_user
      let existing=await userModel.findById(id)
      if(!existing){
            return next(new Handel_ERROR_GLOBAL_APP("user not found ",404))
      }
      //  create img with multer
      let img_cover;
      if(req.file){

            let handel_create_img=await Create_img(req,"user")
            req.body.img_cover=handel_create_img
            img_cover=req.body.img_cover
      }
     //
      //update_user
      let nextName = name || existing.name
      let nextphone=phone ||existing.phone||null
      let nextimg=img_cover||existing.img_cover
      let nextrole=role||existing.role
      let update=await userModel.findByIdAndUpdate(
            id,
            {name: nextName,
            slug: slugify(nextName),
            img_cover:nextimg,
            phone:nextphone,
            role:nextrole
            },
            {new:true}
      )
     if (update) {
         if (img_cover && existing.img_cover) {
             await Delete_img(existing.img_cover, "user");
         }
            res.status(200).json({message: "updated Done"});
}
      if(!update){
            return next(new Handel_ERROR_GLOBAL_APP("updated faild ",404))
      }
})
/**
 * change_password
 * methot: put
 * route  /api/v1/user/changepass/:id
 */
let update_password=AsyncHandler(async(req,res,next)=>{
      let {password,new_password}=req.body
      let {id}=req.params
      let existing=await userModel.findById(id)
      if(!existing){
            return next(new Handel_ERROR_GLOBAL_APP("user not found",404))
      }
      let checkpassword=await bcrypt.compare(password,existing.password)
      if(checkpassword){
          let updated=  await userModel.findByIdAndUpdate(id,
            {password:await bcrypt.hash(new_password,10),password_changed_date:Date.now()},
            {new:true})
            res.status(200).json({message:"UPDATED password Done"})
      }
      if(!checkpassword){
            return next(new Handel_ERROR_GLOBAL_APP("password is not true",404))
      }
})
/**delete specfic user
 * method : delete
 * route : /api/v1/user/id
 */
let delete_user=AsyncHandler(async(req,res,next)=>{
      let {id}=req.params
      let itemdel=await userModel.findByIdAndDelete(id)
      if(!itemdel){
            return next(new Handel_ERROR_GLOBAL_APP("not found user or cant delete",404))
      }else{
            if(itemdel.img_cover){
                  await Delete_img(itemdel.img_cover,"user")
            }
            res.json({message:"user DELETED Done"})
      }
})
//////////////////////////////////////// LOOGED USER //////////////////////////////////////////////////////////
/** Get spesfic user logging
 * route : /api/v1/user/getme
 * method / get
 */
let get_logged_user=AsyncHandler(async(req,res,next)=>{
      req.params.id=req.user._id
      next()
})
/**update spesfic user logging (password)
 * route : /api/v1/user/updatemepassword
 * method / put
 */
let update_logged_user_password=AsyncHandler(async(req,res,next)=>{
      let checkoldpass=await bcrypt.compare(req.body.oldpassword,req.user.password)
      if(!checkoldpass){
    return next(new Handel_ERROR_GLOBAL_APP("old password is not true",404))
      }
let user=await userModel.findByIdAndUpdate(req.user._id,
      {
            password:await bcrypt.hash(req.body.new_password,10),
            password_changed_date:Date.now()
      },
      {
            new:true
      }
)
let token=token_generator(user._id)
res.cookie('ecommerce_BX1_token',token,{
    httpOnly:true,
    secure:process.env.NODE_ENV === 'production',
    sameSite:'strict',
    maxAge:10*24*60*60*1000
  })
res.status(200).json({message:"password updated Done"})
})
/**update spesfic user logging (data)
 * route : /api/v1/user/updatemedata
 * method / put
 */
let update_logged_user_data=AsyncHandler(async(req,res,next)=>{
      let img_cover;
      let {name,phone}=req.body
      if(req.file){

            let handel_create_img=await Create_img(req,"user")
            req.body.img_cover=handel_create_img
            img_cover=req.body.img_cover
      }
      let existing=await userModel.findById(req.user._id)
      let nextig_cover=img_cover||existing.img_cover
      let nextname=name||existing.name
      let nextphone=phone||existing.phone
     let user=await userModel.findByIdAndUpdate(req.user._id,
      {
            name:nextname,
            phone:nextphone,
            img_cover:nextig_cover,
            ...(img_cover && {img_cover})
      },
      {
            new:true
      }
)
  if(!user){
        return next(new Handel_ERROR_GLOBAL_APP("updated failed",404));
    }

    if(img_cover && existing.img_cover){
        await Delete_img(existing.img_cover,"user");
    }
    return res.status(200).json({
        message:"updated Done"

    });
})
/**delete spesfic user logging
 * route : /api/v1/user/deleteme
 * method / delete
 */
let delete_logged_user=AsyncHandler(async(req,res,next)=>{
let user=await userModel.findByIdAndDelete(req.user._id,)
if(user){
      if(user.img_cover){
            await Delete_img(req.user.img_cover,"user")
      }
res.send("user DELETED Done")
}
else{
     return next(new Handel_ERROR_GLOBAL_APP("not found user or cant delete",404))
}
})
//addaddress
let addAddress=AsyncHandler(async(req,res,next)=>{
      let {country,governorate,district,village,street,apartment,phone}=req.body
      let user=await userModel.findOne({_id:req.user.id})
      if(!user){
       return next(new Handel_ERROR_GLOBAL_APP("not found user",404))
      }
      else{
            let addaddress=await userModel.findByIdAndUpdate(req.user._id,{
                  $set:{address:{country,governorate,district,village,street,apartment,phone}}
            },{new:true})
            if(!addAddress){
                return next(new Handel_ERROR_GLOBAL_APP("added faild",404))
            }
            res.status(200).json({message:"Done"})
      }

})

//export services
export{create_User,get_all_user,get_user,update_user,delete_user,update_password,get_logged_user,update_logged_user_data,update_logged_user_password,delete_logged_user,addAddress}
