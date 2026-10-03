import { Camera, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from '../../store/auth/atuh.api';
import { updata_profile_data } from '../../api/profile/change_profile_user_Login'
export default function EditProfile() {
  let dispatch=useDispatch()
  const { user, loading: loading_auth, error } = useSelector((state) => state.auth_slice);
  const [preview, setPreview] = useState('');
  let [state_upload,setstate_upload]=useState(null)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    img_cover: null,
  });

  useEffect(() => {
    if (!user) return;
    setFormData({
      name: user.name || '',
      phone: user.phone || '',
      img_cover: null,
    });

    setPreview(user.imageUrl || '');
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };



  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      img_cover: file
    }));

    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('phone', formData.phone);
    if (formData.img_cover) {
      data.append('img_cover', formData.img_cover);
    }
     try{
       let response = await updata_profile_data(data)
       setstate_upload(response )
       await dispatch(getMe())
     }catch(err){
      setstate_upload(err)
     }
  };
  if (loading_auth.getMe) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }
  return (
    <section className="mx-auto max-w-5xl px-4 py-8">
      <div className="overflow-hidden rounded-3xl bg-white shadow-xl">
        <div className="border-b p-8">
          <h1 className="text-3xl font-bold">Edit Profile</h1>

          <p className="mt-2 text-gray-500">Update your personal information.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 p-8">
          {/* Profile Image */}

          <div className="flex justify-center">
            <div className="relative">
              <img src={preview || '/user.png'}  className="h-44 w-44 rounded-full border-4 border-gray-200 object-cover" />

              <label htmlFor="img" className="absolute bottom-2 right-2 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-black text-white transition hover:scale-110">
                <Camera size={20} />

                <input id="img" hidden type="file" accept="image/*" onChange={handleImage} />
              </label>
            </div>
          </div>
          {/* Personal Info */}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold">Full Name</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Phone</label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
              />
            </div>
          </div>
          {state_upload?.message && <div className="rounded-xl bg-green-100 p-4 text-green-600">{state_upload?.message}</div>}
          <div className="flex justify-center">
            <button type="submit" className="rounded-xl  bg-black px-10 py-3 font-semibold text-white transition hover:bg-gray-800">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
