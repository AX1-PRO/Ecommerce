import express from "express";
import { upload } from "../utils/uploads_config/singel_upload.js";
import { get_all_user,delete_user,update_user,get_user,create_User,update_password,get_logged_user,update_logged_user_password,delete_logged_user,update_logged_user_data,addAddress } from "../services/userService.js";
import { Log_out,allowed_to,protect_route } from "../services/authService.js";
import {specificuserValidator,createuserValidator,updateuserValidator,deleteuserValidator,changepasswordValidator} from "../middelwares/express_validator/userValidator.js"
let user_route=express.Router()
//get user logged in
user_route.use(protect_route)
user_route.get('/getme',get_logged_user,get_user("user"))
user_route.put('/updatemepassword',update_logged_user_password)
user_route.put('/updatemedata',upload.single('img_cover'),update_logged_user_data)
user_route.delete('/deleteme',delete_logged_user)
user_route.post("/logout",Log_out)
user_route.post('/addaddress',addAddress)
//admin accses
user_route.use(protect_route,allowed_to('admin'))
//normal prosses
user_route.route('/')
.post(upload.single("img_cover"),createuserValidator,create_User)
.get(get_all_user)
//with id
user_route.route('/:id')
.get(specificuserValidator,get_user("admin"))
.put(upload.single("img_cover"),updateuserValidator,update_user)
.delete(deleteuserValidator,delete_user)
//RESET PASSWORD
user_route.route('/changepass/:id')
.put(changepasswordValidator,update_password)
export{user_route}
