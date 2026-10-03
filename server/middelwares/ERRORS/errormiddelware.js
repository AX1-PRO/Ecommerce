let globalError=(err,req,res,next)=>{
    err.statuscode = err.statuscode || 500
    err.status = err.status || "ERROR"
    if(process.env.NODE_ENV=="dev"){
        develop_mod(err,res) 
    }else{
        production_mod(err,res)
        
    }
}
//develop mod 
let develop_mod=(err,res)=>{
   res.status(err.statuscode).json({
      status:err.status,
      error:err,
      message:err.message,
      stack:err.stack
})}
//production mod
let production_mod=(err,res)=>{
   res.status(err.statuscode).json({
      message:err.message,
})}
export{globalError}