import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Save, UploadCloud, ArrowLeft } from 'lucide-react';
import { get_category } from '../../../store/category/category_api';
import { one_subcategory, updata_subcategory } from '../../../store/sub_category/sub_category_api';
import { useDispatch, useSelector } from 'react-redux';

export default function EditSubcategory() {
  const { categorys, loading } = useSelector((state) => state.category_slice);
  const { subcategory, loading: subLoading, error } = useSelector((state) => state.subcategory_slice);
  const { id } = useParams();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    img: '',
    file: null,
  });
  /* =======================
     FETCH DATA
  ======================= */
  useEffect(() => {
    dispatch(get_category());
    dispatch(one_subcategory(id));
  }, [dispatch, id]);

  /* =======================
     SET FORM DATA
  ======================= */
  useEffect(() => {
    if (subcategory) {
      setFormData({
        name: subcategory.name || '',
        category: subcategory.category?._id || subcategory.category || '',
        img: subcategory.imageUrl || subcategory.image || subcategory.img || '',
        file: null,
      });
    }
  }, [subcategory]);

  /* =======================
     HANDLE INPUTS
  ======================= */
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  /* =======================
     HANDLE IMAGE
  ======================= */
  const handleImage = (file) => {
    if (!file) return;
    setFormData((prev) => ({
      ...prev,
      file,
      img: URL.createObjectURL(file),
    }));
  };
  /* =======================
     UPDATE
  ======================= */
  const handelupdate = async (e) => {
    e.preventDefault();
      const formdatt = new FormData();
      formdatt.append('name', formData.name);
      formdatt.append('category', formData.category);
      if (formData.file) {
        formdatt.append('img', formData.file);
      }
      await dispatch(updata_subcategory({id, formdatt,}) ).unwrap();
  };
  /* =======================
     LOADING
  ======================= */
  if (loading.when_getall || subLoading.when_getone) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-3xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Edit Subcategory</h1>
          <p className="text-gray-500 mt-2">Update subcategory information</p>
        </div>

        {/* CARD */}
        <div className="bg-white rounded-2xl shadow p-8 space-y-6">
          {/* NAME */}
          <div>
            <label className="font-semibold">Name</label>

            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border rounded-xl mt-2 p-3" />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="font-semibold">Category</label>

            <select name="category" value={formData.category} onChange={handleChange} className="w-full border rounded-xl mt-2 p-3">
              <option value="">Select Category</option>

              {categorys?.data?.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* IMAGE */}
          <div>
            <label className="font-semibold block mb-3">Image</label>

            <div className="flex flex-col sm:flex-row gap-6">
              {/* PREVIEW */}
              <div className="relative w-40 h-40">
                {formData.img ? (
                  <img key={formData.img} src={formData.img} alt="subcategory" className="w-40 h-40 rounded-2xl object-cover border" />
                ) : (
                  <div className="w-40 h-40 border-2 border-dashed rounded-2xl flex items-center justify-center text-gray-400">No Image</div>
                )}
              </div>

              {/* UPLOAD */}
              <label className="border-2 border-dashed border-blue-400 rounded-2xl px-10 py-10 cursor-pointer flex flex-col items-center justify-center hover:bg-slate-50">
                <UploadCloud className="text-blue-600" />

                <span className="mt-2">Change Image</span>

                <input hidden type="file" accept="image/*" onChange={(e) => handleImage(e.target.files[0])} />
              </label>
            </div>
          </div>

          {/* ERRORS */}
          {error?.when_update?.message && <p className="text-green-500">{error.when_update.message}</p>}

          {error?.when_update?.name?.message && <p className="text-red-500 capitalize">{error.when_update.name.message}</p>}

          {/* BUTTONS */}
          <div className="flex justify-between pt-4">
            <button onClick={() => window.history.back()} className="px-6 py-3 border rounded-xl hover:bg-gray-100 flex items-center gap-2">
              <ArrowLeft size={18} />
              Back
            </button>

            <button onClick={handelupdate} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl">
              <Save size={18} />
              Update Subcategory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
