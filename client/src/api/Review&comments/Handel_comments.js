import api from "../axios/axios_instance";
import errorHandler from "../../utils/Error_handeling";
//create comment
export let create_comment=async(data)=>{
    try{
        let fetch=await api.post('/review/',data,{withCredentials:true})
        return fetch.data
    }catch(err){
       return errorHandler(err)
    }
}
//deletecomment
export let delete_comment=async(id)=>{
    try{
        let fetch=await api.delete(`/review/${id}`,{withCredentials:true})
        return fetch.data
    }catch(err){
        return errorHandler(err)
    }
}
//update comment
export let update_comment=async({id,data})=>{
    try{
       let fetch=await api.put(`/review/${id}`,data,{withCredentials:true})
       return fetch.data
    }
    catch(err){
        return errorHandler(err)
    }
}
