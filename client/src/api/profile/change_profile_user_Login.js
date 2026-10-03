import errorHandler from "../../utils/Error_handeling";
import api from "../axios/axios_instance";
export const updata_profile_data =  async (formData,) => {
    try {
      const res = await api.put('user/updatemedata',formData,{withCredentials:true});
      return res.data;
    } catch (err) {
      return (errorHandler(err));
    }
  }
;
