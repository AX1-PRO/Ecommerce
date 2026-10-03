import express from "express"
import {create_brand,get_all_brands,get_specific_brand,update_brand,delete_brand} from "../services/brandService.js"
import {specificbrandVlidator,createbrandVlidator,deletebrandbyVlidator,updatebrandVlidator} from "../middelwares/express_validator/brandValidator.js"
import { upload } from "../utils/uploads_config/singel_upload.js"
import { protect_route,allowed_to } from "../services/authService.js"
let brand_route=express.Router()
//normal prosses
brand_route.route('/')
//brand create
.post(protect_route,allowed_to('admin'),upload.single("img"),createbrandVlidator,create_brand)
//ALL - brand
.get(get_all_brands)
//with id
brand_route.route('/:id')
//one brand
.get(specificbrandVlidator,get_specific_brand)
//update ONe
.put(protect_route,allowed_to('admin'),upload.single("img"),updatebrandVlidator,update_brand)
//Delete ONe
.delete(protect_route,allowed_to('admin'),deletebrandbyVlidator,delete_brand)
export{brand_route}
