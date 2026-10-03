import express from 'express'
import morgan from "morgan"
import dotenv from 'dotenv'
import cors from "cors"
import compression from 'compression'
import cooki_parser from "cookie-parser"
import { rateLimit } from 'express-rate-limit'
import mount_routes from "./routes/index.js"
import {webhookCheckout} from "./services/orderServices.js"
dotenv.config()
/**----------handel url file------------- */
import path from "path"
import { fileURLToPath } from "url"
let __filename=fileURLToPath(import.meta.url)
let __dirname=path.dirname(__filename)
/**---------------- */
let app=express()
/**services db */
import db from "./config/Mongo_db.js"
db()
/**error handel */
import { Handel_ERROR_GLOBAL_APP } from './utils/Handel_ERROR_GLOBAL_APP.js'
import { globalError } from './middelwares/ERRORS/errormiddelware.js'
/**MIDDELWAREs */
app.use(morgan("dev"))
app.set("query parser", "extended")
app.use(cors({origin:process.env.WEBURL,credentials:true}))
app.use(compression())
app.use(cooki_parser())
app.use(express.json({limit:"40kb"}))
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 50, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    message:"you skipped limet requstes fuke you"
})
//checkout stripe
app.post('/api/v1/order/webhook',express.raw({ type: 'application/json' }),webhookCheckout);
app.use(limiter)
app.use(express.static(path.join(__dirname,'uploads_files')))
let port=process.env.PORT||8000
//all routes mount
mount_routes(app)
/**middleware handel error (page not found) */
app.use((req,res,next)=>{
    next(new Handel_ERROR_GLOBAL_APP("cant find this page",404))
})
//create server
let server=app.listen(port,()=>{console.log(`Listening | ${process.env.WEBURL}/api/v1`)})
/**global handel error inside */
app.use(globalError)
/**global handel error out side express like db*/
process.on('unhandledRejection',(err)=>{
    console.error({ERROR:err})
    server.close(()=>{
        process.exit(1)
    })
})
