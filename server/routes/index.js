import { category_route } from '../routes/categoryRoutes.js'
import {sub_category_route} from '../routes/subcategoryRoutes.js'
import {brand_route} from "../routes/brandRoutes.js"
import {product_route} from "../routes/productRoutes.js"
import {user_route} from "../routes/userRoutes.js"
import { auth_route } from '../routes/authRoutes.js'
import { review_route } from '../routes/ReviewRoutes.js'
import { favorit_route } from '../routes/favoritRoutes.js'
import { coupon_route } from '../routes/couponRoutes.js'
import { cart_route } from './cartRoutes.js'
import {order_routes} from './orderRoutes.js'
//mount
let mount_routes=(app)=>{
app.use("/api/v1/categorys",category_route)
app.use("/api/v1/subcategorys",sub_category_route)
app.use("/api/v1/brands",brand_route)
app.use("/api/v1/products",product_route)
app.use("/api/v1/user",user_route)
app.use("/api/v1/auth",auth_route)
app.use("/api/v1/review",review_route)
app.use("/api/v1/favorits",favorit_route)
app.use("/api/v1/coupon",coupon_route)
app.use("/api/v1/cart",cart_route)
app.use("/api/v1/order",order_routes)
}
export default mount_routes
