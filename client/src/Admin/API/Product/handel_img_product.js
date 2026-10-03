import api from "../../../api/axios/axios_instance";
import errorHandler from "../../../utils/Error_handeling";
//delete single img
let delete_single_img=async({id,imgname})=>{
    try{
        let fetch=await api.delete(`/products/${id}/${imgname}`,{withCredentials:true})
         return fetch.data
    }catch(err){
       return errorHandler(err)
    }
}
// add single img
let add_single_img=async({id,img})=>{
    try{
        let form = new FormData();
        form.append("img", img);
        let fetch=await api.put(`/products/${id}/addimg`,form,{withCredentials:true})
        return fetch.data
    }catch(err){
        errorHandler(err)
    }
}
export {delete_single_img,add_single_img}
