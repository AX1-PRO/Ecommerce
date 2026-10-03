import { useState } from 'react';
import { verify_code } from '../../api/password/Forget-password';
import errorHandler from '../../utils/Error_handeling.js';
import { useNavigate, useLocation } from 'react-router';

function Verify_Code() {
  const [code, setCode] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const email = location.state || '';
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});

    if (code.length !== 6) {
      setErrors({ message: 'Verification code must be 6 digits.' });
      return;
    }

    setLoading(true);

    const res = await verify_code(code);

    setLoading(false);

    if (res?.status === 200) {
      navigate('/Resetpassword', {
        replace: true,
        state: email,
      });
      return;
    }
    setErrors(errorHandler(res));
  };
  console.log(errors);
  return (
    <div className="min-h-[calc(100vh-100px)] flex items-center justify-center bg-gray-100 px-4 py-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Verification Code</h1>

          <p className="text-gray-500 text-sm mt-2">Enter the 6-digit code sent to your email.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="123456"
            className="w-full text-center text-2xl tracking-[10px] border rounded-lg p-4 outline-none focus:ring-2 focus:ring-blue-500"
          />

          {errors?.message && <p className="text-red-500 text-sm">{errors?.message}</p>}

          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-60">
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>
        </form>
        <p className="text-center mt-4 text-sm text-gray-500">
          Didn't receive the code?{' '}
          <button className="text-blue-600 font-medium" type="button">
            Resend
          </button>
        </p>
      </div>
    </div>
  );
}

export default Verify_Code;
