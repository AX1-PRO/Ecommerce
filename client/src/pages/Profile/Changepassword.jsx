import { useState } from "react";
import {useNavigate,useLocation} from 'react-router'
import { Lock, Eye, EyeOff } from "lucide-react";
import { updata_password_user_Login } from "../../api/profile/change_password._user_login";
function NewPassword() {
  let navigate=useNavigate()
  const [showoldpassword, setShowoldpassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =useState(false);
  const [formData, setFormData] = useState({ password: "", confirmPassword: "",oldpassword:''});
  let [state,setstate]=useState({loading:false,message:""})
  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value, });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if(showPassword.length==showConfirmPassword.length){
      try{
        let fetchdata=await updata_password_user_Login({oldpassword:formData.oldpassword,new_password:formData.password})
        setstate({...state,message:fetchdata.message})
      }catch(err){
        console.error(err)
      }
    }

  };
  return (
    <div className="min-h-[calc(100vh-100px)] flex items-center justify-center bg-gray-100 px-4 ">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold"> Create New Password </h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4" >
          {/**Old Password */}
          <div>
            <label className="block text-sm font-medium mb-2">  old Password </label>
            <div className="flex items-center border rounded-lg px-3">
              <Lock size={18}  className="text-gray-400 shrink-0" />
              <input type={  showoldpassword ? "text" : "password"} name="oldpassword" placeholder="old password" value={formData.oldpassword} onChange={handleChange} className="w-full p-3 outline-none" required />
              <button type="button"  onClick={() =>  setShowoldpassword(!showoldpassword)   }  >
                {showoldpassword ? (  <EyeOff size={18} />) : ( <Eye size={18} /> )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium mb-2">  New Password </label>
            <div className="flex items-center border rounded-lg px-3">
              <Lock size={18}  className="text-gray-400 shrink-0" />
              <input type={  showPassword ? "text" : "password"} name="password" placeholder="Enter new password" value={formData.password} onChange={handleChange} className="w-full p-3 outline-none" required />
              <button type="button"  onClick={() =>  setShowPassword(!showPassword)   }  >
                {showPassword ? (  <EyeOff size={18} />) : ( <Eye size={18} /> )}
              </button>
            </div>
          </div>
          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium mb-2">Confirm New Password </label>
            <div className="flex items-center border rounded-lg px-3">
              <Lock size={18} className="text-gray-400 shrink-0" />
              <input  type={  showConfirmPassword  ? "text"  : "password" } name="confirmPassword"  placeholder="Confirm new password" value={formData.confirmPassword} onChange={handleChange}  className="w-full p-3 outline-none" required />
              <button type="button" onClick={() =>  setShowConfirmPassword( !showConfirmPassword ) } > {showConfirmPassword ? ( <EyeOff size={18} /> ) : ( <Eye size={18} /> )} </button>
            </div>
          </div>
          {/* Match Message */}
          {formData.confirmPassword && ( <p className={`text-sm ${  formData.password ===   formData.confirmPassword   ? "text-green-600"   : "text-red-600"   }`} > {formData.password === formData.confirmPassword ? "Passwords match ✓": "Passwords do not match"} </p> )}
          {/* Submit */}
          <button  type="submit"  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium" > Update Password </button>
          <p className=" capitalize">{state.message="password updated Done"?state.message:''}</p>
        </form>
      </div>
    </div>
  );
}
export default NewPassword;
