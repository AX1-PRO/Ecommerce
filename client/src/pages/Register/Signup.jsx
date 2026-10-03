import { useEffect, useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, ShoppingBag,} from "lucide-react";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import {signup,getMe} from '../../store/auth/atuh.api.js'
import { useDispatch, useSelector } from "react-redux";
function Register() {
 const { loading, error } = useSelector((state) => state.auth_slice);
  let dispatch=useDispatch()
  let navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({name: "",email: "",password: "",confirm_password: "",});
  const handleChange = (e) => {
    setFormData({ ...formData,[e.target.name]: e.target.value,});
  };
  const handleSubmit = async(e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      return;
    }
     const result = await dispatch(signup(formData));
  if (signup.fulfilled.match(result)) {
      await dispatch(getMe());
    navigate("/", { replace: true });
  }
  };
  return (
   <div className="min-h-[calc(100vh-70px)] flex items-center justify-center bg-gray-100 px-4 py-6">
  <div className="bg-white w-full max-w-md p-5 sm:p-8 rounded-2xl shadow-lg">
    {/* Title */}
    <div className="flex flex-col items-center mb-6">
      <h1 className="text-2xl sm:text-3xl font-bold">  Sign Up </h1>
    </div>
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium mb-2"> Full Name </label>
        <div className="flex items-center border rounded-lg px-3">
          <User size={18} className="text-gray-400 shrink-0" />
          <input type="text" name="name" placeholder="Enter your name" className="w-full p-3 outline-none text-sm sm:text-base" value={formData.name} onChange={handleChange} required/>
        </div>
      </div>
      {/* Email */}
      <div>
        <label className="block text-sm font-medium mb-2"> Email  </label>
        <div className="flex items-center border rounded-lg px-3">
          <Mail size={18} className="text-gray-400 shrink-0" />
          <input type="email" name="email" placeholder="Enter your email" className="w-full p-3 outline-none text-sm sm:text-base" value={formData.email} onChange={handleChange} required />
        </div>
      </div>
      {/* Password */}
      <div>
        <label className="block text-sm font-medium mb-2"> Password </label>
        <div className="flex items-center border rounded-lg px-3">
          <Lock size={18} className="text-gray-400 shrink-0" />
          <input  type={showPassword ? "text" : "password"}  name="password"  placeholder="Enter password"  className="w-full p-3 outline-none text-sm sm:text-base"  value={formData.password}  onChange={handleChange}  required  />
          <button   type="button"   className="shrink-0"   onClick={() => setShowPassword(!showPassword)} >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium mb-2">  Confirm Password </label>
        <div className="flex items-center border rounded-lg px-3">
          <Lock size={18} className="text-gray-400 shrink-0" />
          <input type={showConfirmPassword ? "text" : "password"} name="confirm_password" placeholder="Confirm password" className="w-full p-3 outline-none text-sm sm:text-base" value={formData.confirm_password} onChange={handleChange} required  />
          <button type="button" className="shrink-0" onClick={() => setShowConfirmPassword(!showConfirmPassword) } >  {showConfirmPassword ? (    <EyeOff size={18} />  ) : (    <Eye size={18} />  )}
          </button>
        </div>
      </div>
      {/* Password Status */}
      <div className="flex justify-between">
      {formData.confirm_password && (
        <p
          className={`text-sm ${
            formData.password === formData.confirm_password
              ? "text-green-600"
              : "text-red-600"
          }`} >
          {formData.password === formData.confirm_password
            ? "Passwords match ✓"
            : "Passwords do not match"}
        </p>
      )}
           <p className="text-red-600 text-">{error.signup?error.signup:''}</p>
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium" > {loading.signup? "Loading...":"Create Account"} </button>
    </form>
    <p className="text-center text-sm mt-6 text-gray-600">  Already have an account?{" "}
      <Link to="/Login" className="text-blue-600 font-medium hover:underline" > Login</Link>
    </p>
  </div>
</div>
  );
}
export default Register;
