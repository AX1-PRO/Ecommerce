import express from "express"
import { add_to_cart,one_cart,delete_from_cart,clear_all_cart,update_cart_item,applyCoupon} from "../services/cartSevice.js"
import { protect_route,allowed_to } from "../services/authService.js"
let cart_route=express.Router()
cart_route.route('/')
//cart create cart
.post(protect_route,allowed_to('user',"admin"),add_to_cart)
.get(protect_route,allowed_to('user',"admin"),one_cart)
.delete(protect_route,allowed_to('user',"admin"),clear_all_cart)
cart_route.route("/:itemid")
.delete(protect_route,allowed_to("user","admin"),delete_from_cart)
.put(protect_route,allowed_to("user","admin"),update_cart_item)
cart_route.post("/applaycoupon",protect_route,allowed_to("user","admin"),applyCoupon)
export{cart_route}
