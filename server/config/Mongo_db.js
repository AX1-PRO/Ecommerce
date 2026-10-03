import mongoose from "mongoose"
//configration
let db=async()=>{
    try{
        await mongoose.connect(process.env.DB_URL)
        console.log("connected Succesfuli")
    }catch(err){
        console.error("Mongo connection failed", err)
        process.exitCode = 1
        throw err
    }
}
export default db
