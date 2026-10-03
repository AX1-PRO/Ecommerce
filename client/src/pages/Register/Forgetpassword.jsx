import { Mail } from 'lucide-react';
import { useState } from 'react';
import { Forget_pass } from '../../api/password/Forget-password';
import errorHandler from '../../utils/Error_handeling.js';
import { useNavigate } from 'react-router';

function Forgetpassword() {
  const [inp, setInp] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});
    setLoading(true);

    const res = await Forget_pass(inp);

    setLoading(false);

    if (res?.status === 200) {
      navigate('/VerifyCode', {
        replace: true,
        state: inp,
      });
      return;
    }
    setErrors(errorHandler(res));
  };

  return (
    <div className="min-h-[calc(100vh-100px)] flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="text-gray-500 text-sm mt-2">Enter your email and we'll send you a password reset code.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>

            <div className="flex items-center border rounded-lg px-3">
              <Mail size={18} className="text-gray-400 shrink-0" />

              <input value={inp} onChange={(e) => setInp(e.target.value)} type="email" placeholder="Enter your email" className="w-full p-3 outline-none" required />
            </div>

            {/* Error */}
            {errors.message && <p className="text-red-500 text-sm mt-2">{errors?.message}</p>}

            {/* express-validator */}
            {errors.email && <p className="text-red-500 text-sm mt-2">{errors?.email}</p>}
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? 'Sending...' : 'Send Reset Code'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Forgetpassword;
