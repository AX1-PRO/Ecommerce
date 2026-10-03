import { useEffect, useState } from 'react';
import {  useParams } from 'react-router';
import { UploadCloud, Save, ArrowLeft } from 'lucide-react';
import { one_brand, updata_brand } from '../../../store/brand/brand_api';
import { useDispatch, useSelector } from 'react-redux';
export default function Editbrand() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { brand, loading,error } = useSelector((state) =>{return state.brand_slice});
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    file: null,
  });
  //get one brand 
  useEffect(() => {
    dispatch(one_brand(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (brand) {
      setFormData({
        name: brand.name || '',
        image: brand.imageUrl || brand.img || '',
        file: null,
      }
    );
  }
}, [brand]);
const handleNameChange = (e) => {
  setFormData((prev) => ({
    ...prev,
    name: e.target.value,
  }));
};
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      file,
      image: URL.createObjectURL(file),
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    if (formData.file) {
      data.append('img', formData.file);
    }
      await dispatch(updata_brand({ id, data })).unwrap();
  };
  if (loading.when_getone) {
    return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
  }
  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Edit brand</h1>

        <form onSubmit={handleUpdate} className="bg-white rounded-2xl shadow p-8 space-y-6">
          <div>
            <label>brand Name</label>

            <input className="w-full border rounded-xl p-3 mt-2" value={formData.name} onChange={handleNameChange} />
          </div>

          <div>
            <label className="block mb-3">brand Image</label>

            <div className="flex gap-6">
              {formData.image && <img src={formData.image} alt="" className="w-40 h-40 object-cover rounded-xl" />}

              <label className="border-2 border-dashed border-blue-400 rounded-xl p-8 cursor-pointer flex flex-col items-center justify-center hover:bg-slate-50 transition">
                <UploadCloud size={28} className="text-blue-600" />
                <span className="mt-2 p-4 text-sm text-gray-600">ADD IMG</span>
                <input hidden type="file" accept="image/*" onChange={handleImageChange} />
              </label>
            </div>
          </div>
           <p>{error.when_update?error.when_update.message:""}</p>
         <p className='text-red-600 capitalize'>{error.when_update?error.when_update.name:""}</p>
          <div className="flex justify-between">
            <button type="button" onClick={() => window.history.back()} className="border rounded-xl px-6 py-3 flex items-center gap-2">
              <ArrowLeft size={18} />
              Back
            </button>

            <button type="submit" className="bg-blue-600 text-white rounded-xl px-6 py-3 flex items-center gap-2">
              <Save size={18} />
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
