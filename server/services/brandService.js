import {brandModel} from "../models/brandModel.js"
import slugify from "slugify"
import AsyncHandler from "express-async-handler"
import {Handel_ERROR_GLOBAL_APP} from "../utils/Handel_ERROR_GLOBAL_APP.js"
import { Create_img,Delete_img } from "../utils/uploads_config/handel_file_imges.js"
/**create new brand
 * method  :  post
 * route : /api/v1/brand/
 *  role : admin
 */
let create_brand=AsyncHandler(async(req,res)=>{
      //handel create img with multer
      let handel_create_img=await Create_img(req,"brand")
      req.body.img=handel_create_img
      //------------//
      let {name,img}=req.body
      let new_brand=await brandModel.create({name,slug:slugify(name),img})
      res.status(201).json({message:"brand created"})
})
/**get all brand
 * method : get
 * route : /api/v1/brand/
*/
let get_all_brands=AsyncHandler(async(req,res)=>{
      let brands=await brandModel.find()
      res.status(200).json({length:brands.length,data:brands})
})
/**get specfic brand
 * method : get
 * route : /api/v1/brand/id
 */
let get_specific_brand=AsyncHandler(async(req,res,next)=>{
      let {id}=req.params
      let brand=await brandModel.findById(id)
      if(!brand){
            return next(new Handel_ERROR_GLOBAL_APP("brand is  not found",400))
      }
            res.status(201).json(brand)

})
/**update specfic brand
 * method : put
 * route: /api/v1/brand/id
 * body:id,name
 * * role : admin
 */
let update_brand=AsyncHandler(async(req,res,next)=>{
      let {id}=req.params
      let {name}=req.body
      let existing=await brandModel.findById(id)
      if(!existing){
            return next(new Handel_ERROR_GLOBAL_APP(" brand  not found",400))
      }
      //  create img with multer
      let img;
      if(req.file){
            let handel_create_img=await Create_img(req,"brand")
            req.body.img=handel_create_img
            img=req.body.img
      }
            //
      let nextName = name || existing.name
      let nextimg= img||existing.img
      let update=await brandModel.findByIdAndUpdate(id,{name: nextName, slug: slugify(nextName),img:nextimg},{new:true})
     if (update) {

              if (img && existing.img) {
                  await Delete_img(existing.img, "brand");
              }
                 res.status(200).json({message: "Brand updated successfully"});
     }
           if(!update){
                 return next(new Handel_ERROR_GLOBAL_APP("updated faild ",404))
           }
})
/**delete specfic brand
 * method : delete
 * route : /api/v1/brand/id
 * role : admin
 */
let delete_brand=AsyncHandler(async(req,res,next)=>{
      let {id}=req.params
      //check
      let brand=await brandModel.findByIdAndDelete(id)
      if(!brand){
            return next(new Handel_ERROR_GLOBAL_APP("not found item or cant delete",404))
      }else{
            await Delete_img(brand.img,"brand")
            res.json({message:"deleted Done"})
      }
})
//export services
export{create_brand,get_all_brands,get_specific_brand,update_brand,delete_brand}

