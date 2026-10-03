import {categoryModel} from "../models/categoryModel.js"
import slugify from "slugify"
import AsyncHandler from "express-async-handler"
//global error
import {Handel_ERROR_GLOBAL_APP} from "../utils/Handel_ERROR_GLOBAL_APP.js"
//file control
import { Create_img,Delete_img } from "../utils/uploads_config/handel_file_imges.js"
////////////////////////////////////////
/**create new category
 * method  :  post
 * route : /api/v1/categorys/
 * role : admin
 */
let create_category=AsyncHandler(async(req,res)=>{
           //handel create img with multer
     let handel_create_img=await Create_img(req,"category")
     req.body.img=handel_create_img
      //END
      let {name,img}=req.body
      let new_category=await categoryModel.create({name,slug:slugify(name),img})
      res.status(201).json({message:"category created Done"})
})
/**get all category
 * method : get
 * route : /api/v1/categorys/
*/
let get_all_category=AsyncHandler(async(req,res)=>{
      let alldata=await categoryModel.find()
      res.status(200).json({ length:alldata.length,data:alldata})
})
/**get specfic category
 * method : get
 * route : /api/v1/categorys/id
 */
let get_specific_category=AsyncHandler(async(req,res,next)=>{
      let {id}=req.params
      let category=await categoryModel.findById(id)
      if(!category){
            return next(new Handel_ERROR_GLOBAL_APP("category is not found",400))
      }else{
            res.status(201).json(category)
      }
})
/**update specfic category
 * method : put
 * route: /api/v1/categorys/id
 * * role : admin
 */
let update_category=AsyncHandler(async(req,res,next)=>{
      const {id}=req.params
      let {name}=req.body
      //old_user
      let existing=await categoryModel.findById(id)
      if(!existing){
            return next(new Handel_ERROR_GLOBAL_APP("category  not found ",404))
      }
      //  create category img with multer
      let img;
      if(req.file){
            let handel_create_img=await Create_img(req,"category")
            req.body.img=handel_create_img
            img=req.body.img

      }
     //
      //update_user
      let nextName = name || existing.name
      let nextimg=img||existing.img
      let update=await categoryModel.findByIdAndUpdate(
            id,
            {name: nextName, slug: slugify(nextName),img:nextimg},
            {new:true}
      )
      if (update) {

         if (img && existing.img) {
             await Delete_img(existing.img, "category");
         }
            res.status(201).json({message: "Category updated successfully"});
}
      if(!update){
            return next(new Handel_ERROR_GLOBAL_APP("updated faild ",404))
      }
})
/**delete specfic category
 * method : delete
 * route : /api/v1/categorys/id
 * * role : admin
 */
let delete_category=AsyncHandler(async(req,res,next)=>{
      let {id}=req.params
      let existing=await categoryModel.findByIdAndDelete(id)
      if(!existing){
            return next(new Handel_ERROR_GLOBAL_APP("Category not found",400))
      }else if(existing){
          existing.img? await Delete_img(existing.img,"category"):null
           res.json({message:"DELETED Done"})
      }
})

//export services
export{create_category,get_specific_category,get_all_category,update_category,delete_category}
