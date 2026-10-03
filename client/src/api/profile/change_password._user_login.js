import errorHandler from "../../utils/Error_handeling";
import api from "../axios/axios_instance";
export const updata_password_user_Login =  async (formData) => {
    try {
      const res = await api.put('user/updatemepassword',formData,{withCredentials:true});
      return res.data;
    } catch (err) {
      return (errorHandler(err));
    }
  }
;
