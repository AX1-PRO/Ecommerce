import express from "express"
import { protect_route,allowed_to } from "../services/authService.js"
import { create_favorit,delete_favorit,get_all_fav } from "../services/favoritService.js"
let favorit_route=express.Router()
favorit_route.use(protect_route,allowed_to('user','admin'))
favorit_route.route('/')
//create fav
.post(create_favorit)
//all fav
.get(get_all_fav)
//delete fav
favorit_route.delete("/:id",delete_favorit)
export{favorit_route}
