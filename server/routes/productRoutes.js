import express from "express";
import {createproductValidator,specificproductValidator,updateproductValidator,deleteproductValidator} from "../middelwares/express_validator/productValidator.js"
import {create_product,get_products,get_specfic_product,delete_product,update_product,delete_product_img,add_product_img} from "../services/productService.js"
import {upload} from "../utils/uploads_config/singel_upload.js"
import { protect_route,allowed_to } from "../services/authService.js";
let product_route=express.Router()
//normal prosses
product_route.route('/')
.post(protect_route,allowed_to('admin'),upload.fields([{name:"img_cover",maxCount:1},{name:"imgs",maxCount:3}]),createproductValidator,create_product)
.get(get_products)
//with id
product_route.route('/:id')
.get(specificproductValidator,get_specfic_product)
.delete(protect_route,allowed_to('admin'),deleteproductValidator,delete_product)
.put(protect_route,allowed_to('admin'),upload.single("img_cover"),updateproductValidator,update_product)
product_route.route('/:id/:imgname')
.delete(protect_route,allowed_to('admin'),delete_product_img)
product_route.route('/:id/addimg')
.put(protect_route,allowed_to('admin'),upload.single("img"),add_product_img)
export  {product_route}
