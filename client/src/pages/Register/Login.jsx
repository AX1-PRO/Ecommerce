import { Mail, Lock, ShoppingBag } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch,useSelector } from "react-redux";
import { login,getMe } from "../../store/auth/atuh.api.js"
function Login() {
  let disp=useDispatch()
    let navigate = useNavigate();
  //selector
 const { loading, error } = useSelector(
  (state) => state.auth_slice
);
  let [form_data,setform_data]=useState({email:'',password:''})
  let handelsubmit=async(e)=>{
     e.preventDefault();
     if(form_data.email!=''&&form_data.password!=''){
       const result = await disp(login(form_data));

    if (login.fulfilled.match(result)) {
        await disp(getMe());
      navigate("/", { replace: true });
    }
     }
  }
  return (
   <div className="min-h-[calc(100vh-70px)] flex items-center justify-center bg-gray-100 px-4 py-6">
  <div className="bg-white w-full max-w-md p-5 sm:p-8 rounded-2xl shadow-lg">
    {/* Logo */}
    <div className="flex flex-col items-center mb-6">
      <h1 className="text-2xl sm:text-3xl font-bold"> Log-in </h1>
    </div>
    {/**Form */}
    <form className="space-y-4" onSubmit={handelsubmit}>
      {/* Email */}
      <div>
        <label className="block text-sm font-medium mb-2"> Email </label>
        <div className="flex items-center border rounded-lg px-3">
          <Mail size={18} className="text-gray-400 shrink-0" />
          <input type="email" value={form_data.email} onChange={(e)=>{setform_data({...form_data,email:e.target.value})}} placeholder="Enter your email"  className="w-full p-3 outline-none text-sm sm:text-base"/>
        </div>
      </div>
      {/* Password */}
      <div>
        <label className="block text-sm font-medium mb-2"> Password </label>
        <div className="flex items-center border rounded-lg px-3">
          <Lock size={18} className="text-gray-400 shrink-0" />
          <input type="password" value={form_data.password} onChange={(e)=>{setform_data({...form_data,password:e.target.value})}}  placeholder="Enter your password" className="w-full p-3 outline-none text-sm sm:text-base" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-red-500">{error.login?error.login:''}</p>
        <Link to='/Forgetpassword' className="text-sm text-blue-600 hover:underline" > Forgot Password? </Link>
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium" > {loading.login?'loading..':'Login'}</button>
    </form>

    <p className="text-center text-sm mt-6 text-gray-600">Don't have an account?{" "}
      <Link to="/Register" className="text-blue-600 font-medium hover:underline">Sign Up </Link>
    </p>
  </div>
</div>
  );
}
export default Login;