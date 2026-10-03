import { configureStore } from "@reduxjs/toolkit";
import  auth_slice  from "./auth/auth_slice";
import category_slice from './category/category_slice'
import subcategory_slice from './sub_category/sub_category_slice'
import brand_slice from './brand/brand_slice'
import  product_slice  from "./Product/product_slice";
import user_slice from './users_Admin/users_slice'
import  favorits_slice  from "./favorits/favorits_slice";
import cart_slice from "./Cart/cart_slice"
import sliceCoupon from './coupon/couponSlice'
import order_slice from './order/order_slice'
export let store=configureStore({
reducer:{
 auth_slice:auth_slice,
 category_slice:category_slice,
 subcategory_slice:subcategory_slice,
 brand_slice:brand_slice,
 product_slice:product_slice,
 user_slice:user_slice,
 favorits_slice:favorits_slice,
 cart_slice:cart_slice,
 sliceCoupon:sliceCoupon,
 order_slice:order_slice
}
})
