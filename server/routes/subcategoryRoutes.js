import express from "express"
import {create_sub_category,get_sub_category,get_one_sub_category,delete_one_sub_category,update_one_sub_category} from "../services/subcategoryService.js"
import {createsubcategoryValidator,deletecategoryValidator,updatesubcategoryValidator} from "../middelwares/express_validator/subcategoryValidator.js"
import { upload } from "../utils/uploads_config/singel_upload.js"
import { protect_route,allowed_to } from "../services/authService.js"
let sub_category_route=express.Router({mergeParams:true})
//normal prosses
sub_category_route.route('/')
.post(protect_route,allowed_to('admin'),upload.single('img'),createsubcategoryValidator,create_sub_category)
.get(get_sub_category)
//with id
sub_category_route.route('/:id')
.get(deletecategoryValidator,get_one_sub_category)
.put(protect_route,allowed_to('admin'),upload.single("img"),updatesubcategoryValidator,update_one_sub_category)
.delete(protect_route,allowed_to('admin'),deletecategoryValidator,delete_one_sub_category)
export{sub_category_route}
