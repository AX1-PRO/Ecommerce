import express from "express";
import {loginVlidator,signupVlidator,verifyresetcodeVlidator,resetpasswordVlidator,forgetpasswordVlidator} from "../middelwares/express_validator/authValidator.js";
import { sign_up,log_in,forget_password,verify_reset_code,reset_password } from "../services/authService.js";
let auth_route=express.Router()
auth_route.route('/signup')
.post(signupVlidator,sign_up)
auth_route.route('/login')
.post(loginVlidator,log_in)
auth_route.route('/forgetpassword')
.post(forgetpasswordVlidator,forget_password)
auth_route.route('/verifyresetcode')
.post(verifyresetcodeVlidator,verify_reset_code)
auth_route.route('/resetpassword')
.post(resetpasswordVlidator,reset_password)
export{auth_route}
