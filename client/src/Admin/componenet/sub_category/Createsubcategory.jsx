import { useEffect, useState } from 'react';
import { UploadCloud, Save } from 'lucide-react';
import { get_category } from '../../../store/category/category_api';
import { useDispatch, useSelector } from 'react-redux';
import { create_subcategory, get_subcategory } from '../../../store/sub_category/sub_category_api';

export default function CreateSubcategory() {
  const dispatch = useDispatch();

  const { categorys, loading } = useSelector((e) => e.category_slice);
  const { loading: subLoading ,error} = useSelector((e) => e.subcategory_slice);

  const [form, setForm] = useState({
    name: '',
    category: '',
    img: null,
    file: null,
  });

  useEffect(() => {
    dispatch(get_category());
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append('name', form.name);
    formdata.append('category', form.category);

    if (form.file) {
      formdata.append('img', form.file);
    }
    dispatch(create_subcategory(formdata));
  };

  if (loading?.when_get) {
    return <p>loading ....</p>;
  }
  return (
    <div className=" bg-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-bold mb-6">Create Subcategory</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* NAME */}
          <input name="name" placeholder="Name" onChange={handleChange} className="w-full border p-3 rounded-xl" />

          {/* CATEGORY */}
          <select name="category" onChange={handleChange} className="w-full border p-3 rounded-xl">
            <option value="">Select Category</option>

            {categorys?.data?.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* IMAGE */}
          <div>
            <label className="block font-semibold mb-3">Subcategory Image</label>

            <label className="border-2 border-dashed border-blue-400 rounded-2xl p-6 sm:p-10 flex items-center justify-center cursor-pointer hover:bg-slate-50 transition">
              {form.img ? (
                <img src={form.img} alt="preview" className="w-48 h-48 object-cover rounded-2xl border shadow" />
              ) : (
                <div className="text-center">
                  <UploadCloud size={50} className="text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-lg">Upload Subcategory Image</h3>
                  <p className="text-gray-500 mt-2">PNG, JPG, WEBP</p>
                </div>
              )}

              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) =>
                  setForm({
                    ...form,
                    file: e.target.files[0],
                    img: URL.createObjectURL(e.target.files[0]),
                  })
                }
              />
            </label>
          </div>
          <p>{error.when_create?error.when_create.message:'' }</p>
          <p className='text-red-600 capitalize'>{error.when_create?error.when_create.name:'' }</p>
          {/* BUTTON */}
          <button disabled={subLoading?.when_create} className="w-full bg-blue-600 text-white py-3 rounded-xl flex items-center justify-center gap-2">
            <Save size={18} />
            Create
          </button>
        </form>
      </div>
    </div>
  );
}
