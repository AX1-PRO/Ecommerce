import {validationResult} from "express-validator"
let msgValidator=(req,res,next)=>{
            let errors=validationResult(req)
            if(!errors.isEmpty()){
              return  res.status(400).json(errors)
            }else{
                next()
            }}
export{msgValidator}
