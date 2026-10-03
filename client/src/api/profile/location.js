import errorHandler from "../../utils/Error_handeling.js";
import api from "../axios/axios_instance.js";
export let addandupdatelocation=async(data)=>{
    try{
        let res=await api.post("/user/addaddress",data,{withCredentials:true})
        return res.data
    }catch(err){
        return errorHandler(err)
    }
}
