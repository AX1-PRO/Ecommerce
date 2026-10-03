import errorHandler from "../../utils/Error_handeling.js";
import api from "../axios/axios_instance.js";
//create order cash
export let createOrderCash=async({cartid})=>{
    try{
        let res=await api.post(`/order/${cartid}`,{},{withCredentials:true})
        return res.data
    }
    catch(err){
        return errorHandler(err)
    }
}
//get orders user
export let getOrder=async()=>{
     try{
        let res=await api.get('/order/me/',{withCredentials:true})
        return res.data
    }
    catch(err){
        return errorHandler(err)
    }
}
