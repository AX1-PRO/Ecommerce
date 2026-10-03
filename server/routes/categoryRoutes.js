import express from "express"
import { specificcategoryValidator,createcategoryValidator,updatecategoryValidator,deletecategoryValidator } from "../middelwares/express_validator/categoryValidator.js"
import {create_category,get_specific_category,get_all_category,update_category,delete_category} from "../services/categoryService.js"
import { sub_category_route } from "./subcategoryRoutes.js"
import { upload } from "../utils/uploads_config/singel_upload.js"
import { protect_route,allowed_to } from "../services/authService.js"
////////////////////////
let category_route=express.Router()
//nested route /:categoryid/subcategory
category_route.use("/:categoryid/subcategory",sub_category_route)
//get product category

//normal prosses
category_route.route('/')
//create category
.post(protect_route,allowed_to("admin"),upload.single("img"),createcategoryValidator,create_category)
//GET ALL category
.get(get_all_category)
//with id
category_route.route('/:id')
//get one
.get(specificcategoryValidator,get_specific_category)
//update one
.put(protect_route,allowed_to('admin'),upload.single("img"),updatecategoryValidator,update_category)
//Delee one
.delete(protect_route,allowed_to('admin'),deletecategoryValidator,delete_category)
export{category_route}
