import api from '../axios/axios_instance'
let Forget_pass = async (email) => {
  try {
    return await api.post("/auth/forgetpassword", {
      email,
    });
  } catch (err) {
    return err.response;
  }
};
let verify_code = async (resetcode) => {
  try {
    return await api.post("/auth/verifyresetcode", {
      resetcode,
    });
  } catch (err) {
    return err.response;
  }
};
let reset_pass=async(data)=>{
     try{
        let fetch=await api.post('/auth/resetpassword',data)
        return fetch
    }catch(err){
        return err.response
    }
}
export  {Forget_pass,verify_code,reset_pass}