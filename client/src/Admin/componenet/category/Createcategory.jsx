import { useState } from 'react';
import { UploadCloud, Save } from 'lucide-react';
import { create_category } from '../../../store/category/category_api';
import { useSelector, useDispatch } from 'react-redux';
export default function CreateCategory() {
  const [name, setname] = useState('');
  const [image, setImage] = useState(null); // file
  const [preview, setPreview] = useState(''); // preview url
  let { loading, error } = useSelector((e) => {
    return e.category_slice;
  });
  let dispatch = useDispatch();
  // handle image
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();
      let formdata = new FormData();
      formdata.append('name', name);
      if (image) {
        formdata.append('img', image);
      }
      await dispatch(create_category(formdata)).unwrap();
      setname('');
      setImage(null);
      setPreview('');
  };
  return (
    <div className=" bg-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Create Category</h1>
          <p className="text-gray-500 mt-2">Add a new category to your store</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-8">
          {/* Name */}
          <div>
            <label className="block font-semibold mb-2">Category Name</label>
            <input value={name} onChange={(e) => setname(e.target.value)} type="text" placeholder="Enter category name..." className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          {/* Image Upload + Preview */}
          <div>
            <label className="block font-semibold mb-3">Category Image</label>

            <label className="border-2 border-dashed border-blue-400 rounded-2xl p-6 sm:p-10 flex items-center justify-center cursor-pointer hover:bg-slate-50 transition">
              {preview ? (
                <img src={preview} alt="preview" className="w-48 h-48 object-cover rounded-2xl border shadow" />
              ) : (
                <div className="text-center">
                  <UploadCloud size={50} className="text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-lg">Upload Category Image</h3>
                  <p className="text-gray-500 mt-2">PNG, JPG, WEBP</p>
                </div>
              )}

              <input hidden type="file" accept="image/*" onChange={handleImage} />
            </label>
          </div>
         <p>{error.when_create?error.when_create.message:""}</p>
         <p className='text-red-600 capitalize'>{error.when_create?error.when_create.name:""}</p>
          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="reset"
              onClick={() => {
                setname('');
                setImage(null);
                setPreview('');
              }}
              className="px-6 py-3 rounded-xl border hover:bg-gray-100  max-md:text-sm"> Cancel
            </button>
            <button type="submit" className="flex items-center gap-2 max-md:text-sm bg-blue-600   hover:bg-blue-700 text-white px-6 py-3 rounded-xl">
              <Save size={17} />
              Create Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
