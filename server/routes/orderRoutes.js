import express from "express"
import { protect_route,allowed_to } from "../services/authService.js"
import {getOrders,createCashOrder,checkOutSecion,spesficOrder,userOrders,updateOrdertopay,updateOrdertodelivary,deleteSpesficOrder,deleteUserOrder} from "../services/orderServices.js"
import { createOrderValidator } from "../middelwares/express_validator/orderValidator.js"
let order_routes=express.Router()
order_routes.get('/',protect_route,allowed_to("admin"),getOrders)
order_routes.get("/checkout/:cartid",protect_route,allowed_to("user","admin"),checkOutSecion)
order_routes.get('/me',protect_route,allowed_to("user","admin"),userOrders)
order_routes.route('/:cartid')
.post(protect_route,allowed_to('user',"admin"),createOrderValidator,createCashOrder)
.get(protect_route,allowed_to("admin"),spesficOrder)
order_routes.delete("/me/:orderid",protect_route,allowed_to("user","admin"),deleteUserOrder)
order_routes.delete("/:orderid",protect_route,allowed_to("admin"),deleteSpesficOrder)
order_routes.put("/:id/pay",protect_route,allowed_to("admin"),updateOrdertopay)
order_routes.put("/:id/delivary",protect_route,allowed_to("admin"),updateOrdertodelivary)
export{order_routes}
