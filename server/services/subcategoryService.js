import slugify from "slugify";
import {subcategoryModel} from "../models/subcategoryModel.js";
import AsyncHandler from "express-async-handler";
import {Handel_ERROR_GLOBAL_APP} from "../utils/Handel_ERROR_GLOBAL_APP.js"
import { Create_img,Delete_img } from "../utils/uploads_config/handel_file_imges.js";
/**create new sub-category
 * method  :  post
 * route : /api/v1/subcategorys/
 * role : admin
 */
let create_sub_category=AsyncHandler(async(req,res)=>{
     let handel_create_img=await Create_img(req,"subcategory")
     req.body.img=handel_create_img
    let {name,category,img}=req.body
    let newsubcategory=await  subcategoryModel.create({ name, slug:slugify(name),category,img})
    res.status(200).json({message:"subcategory created Done"})
})
/**get all sub-category
 * method : get
 * route : /api/v1/subcategorys/
*/
let get_sub_category=AsyncHandler(async(req,res)=>{
    //fillter
    let filter={}
    let {categoryid}=req.params
          if(categoryid){filter={category:categoryid}}
    let alldata=await subcategoryModel.find(filter).populate({ path: "category",select: "name"})
    res.status(200).json({length:alldata.length,data:alldata})
})
/**get specfic sub-category
 * method : get
 * route : /api/v1/subcategorys/id
 */let get_one_sub_category=AsyncHandler(async(req,res,next)=>{
    let {id}=req.params
    let subcategory=await subcategoryModel.findById(id)//.populate({path:"category",select:"name -_id"})
    if(!subcategory){
         return next(new Handel_ERROR_GLOBAL_APP("user not found",400))
    }else{
        res.status(200).json(subcategory)
    }
})
/**update specfic sub-category
 * method : put
 * route: /api/v1/subcategorys/id
 * role : admin
 */let update_one_sub_category=AsyncHandler(async(req,res,next)=>{
    let {name,category}=req.body
    let {id}=req.params
    let existing=await subcategoryModel.findOne({_id:id})
    if(!existing){
        return next(new Handel_ERROR_GLOBAL_APP("subcategory is not Hear",400))
    }
    //  create img
    let img;
    if(req.file){
        let handel_create_img=await Create_img(req,"subcategory")
        req.body.img=handel_create_img
        img=req.body.img
    }
    //
    //update_user
    let nextName = name || existing.name
          let nextimg=img||existing.img
          let nextcategory=category||existing.category
          let update=await subcategoryModel.findByIdAndUpdate( id, {name: nextName, slug: slugify(nextName),img:nextimg,category:nextcategory}, {new:true} )
           if (update) {
         if (img && existing.img) {
             await Delete_img(existing.img, "subcategory");
         }
            res.status(200).json({message: "updated Done"});
}
      if(!update){
            return next(new Handel_ERROR_GLOBAL_APP("updated faild ",404))
      }
    })
    /**delete sub-category
     * method : delete
     * route : /api/v1/subcategorys/id
     * role : admin
     */let delete_one_sub_category=AsyncHandler(async(req,res)=>{
        let {id}=req.params
        let existing=await subcategoryModel.findByIdAndDelete(id)
        if(!existing){
            return next(new Handel_ERROR_GLOBAL_APP("user is not Hear",400))
        }else{
             await Delete_img(existing.img,"subcategory")
            res.status(200).json({message:"DELETED Done"})
        }
    })
    //export services
    export{create_sub_category,get_sub_category,get_one_sub_category,delete_one_sub_category,update_one_sub_category}
