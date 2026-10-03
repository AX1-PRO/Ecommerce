import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Save, ArrowLeft, Camera } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { one_user, updata_user } from '../../../store/users_Admin/users_api';
export default function EditUser() {
  const { user, loading_user, error_user } = useSelector((state) => state.user_slice);
  const dispatch = useDispatch();
  const { id } = useParams();

  const [userinp, setUserinp] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    img_cover: '',
    imageUrl: ''
  });
  const [preview, setPreview] = useState('');
  useEffect(() => {
    dispatch(one_user(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (user) {
      setUserinp({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'user',
        img_cover: user.img_cover || '',
        imageUrl: user.imageUrl
      });

      setPreview(user.imageUrl || '');
    }
  }, [user]);

  const handleChange = (e) => {
    setUserinp({
      ...userinp,
      [e.target.name]: e.target.value
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setUserinp({
      ...userinp,
      img_cover: file
    });
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', userinp.name);
    formData.append('role', userinp.role);
    if (userinp.phone) {
  formData.append("phone", userinp.phone);
}
    formData.append('img_cover', userinp.img_cover);
    await dispatch(updata_user({ id, formData }));
    // axios.put(`/users/${id}`, formData)
  };
  if (loading_user.when_getone) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="animate-pulse text-lg font-semibold text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800">Edit User</h1>

          <p className="mt-2 text-slate-500">Update user profile information.</p>
        </div>

        {/* Card */}
        <form onSubmit={handleSubmit} className="space-y-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="group relative">
              <img src={preview || null} alt="" className="h-36 w-36 rounded-full border-4 border-blue-500 object-cover shadow-xl" />
              <label className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center rounded-full bg-black/40 opacity-0 transition duration-300 group-hover:opacity-100">
                <Camera size={28} className="text-white" />

                <span className="mt-2 text-sm text-white">Change Photo</span>

                <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
              </label>
            </div>

            <p className="mt-4 text-sm text-gray-500">Click on the image to upload a new one.</p>
          </div>

          {/* Name */}
          <div>
            <label className="mb-2 block font-semibold text-slate-700">Full Name</label>

            <input
              type="text"
              name="name"
              value={userinp.name}
              onChange={handleChange}
              placeholder="Enter full name"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:ring-2 focus:ring-blue-500"
            />
            <p className="capitalize text-red-500">{error_user.when_update?.name ? error_user.when_update?.name : ''}</p>
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block font-semibold text-slate-700">Email</label>

            <input
              disabled
              type="email"
              name="email"

              value={userinp.email}
              placeholder="Enter email"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none blur-[1px] transition focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="mb-2 block font-semibold text-slate-700">Phone</label>
            <input
              onChange={handleChange}
              type="text"
              name="phone"
              value={userinp.phone}
              placeholder="Enter phone"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:ring-2 focus:ring-blue-500"
            />
            <p className="capitalize text-red-500">{error_user.when_update?.phone ? error_user.when_update?.phone : ''}</p>
          </div>

          {/* Role */}
          <div>
            <label className="mb-2 block font-semibold text-slate-700">Role</label>

            <select name="role" value={userinp.role} onChange={handleChange} className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:ring-2 focus:ring-blue-500">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Buttons */}
          <p className="capitalize text-green-500">{error_user.when_update?.message ? error_user.when_update?.message : ''}</p>
          <div className="flex items-center justify-between pt-4">
            <button type="button" onClick={() => window.history.back()} className="flex items-center gap-2 rounded-xl border border-slate-300 px-6 py-3 transition hover:bg-slate-100">
              <ArrowLeft size={18} />
              Back
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-3 text-white shadow-lg transition hover:from-blue-700 hover:to-indigo-700"
            >
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
