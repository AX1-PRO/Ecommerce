import express from "express"
import { createcouponValidator } from "../middelwares/express_validator/couponValidator.js"
import { create_coupon,get_all_coupons,get_specific_coupon,update_coupon,delete_coupon } from "../services/couponService.js"
import { protect_route,allowed_to } from "../services/authService.js"
let coupon_route=express.Router()
//normal prosses
coupon_route.use(protect_route,allowed_to("admin"))
coupon_route.route('/')
//coupon create
.post(createcouponValidator,create_coupon)
//ALL - coupon
.get(get_all_coupons)
//with id
coupon_route.route('/:id')
//one coupon
.get(get_specific_coupon)
//update ONe
.put(update_coupon)
//Delete ONe
.delete(delete_coupon)
export{coupon_route}
