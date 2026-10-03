import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { UploadCloud, Save, Trash2, Plus, ArrowLeft, AlertCircle } from 'lucide-react';

import { useSelector, useDispatch } from 'react-redux';

import { one_product } from '../../../store/Product/Product_api';
import { get_category } from '../../../store/category/category_api';
import { get_brand } from '../../../store/brand/brand_api';
import { get_subcategory } from '../../../store/sub_category/sub_category_api';
import { updata_product } from '../../../store/Product/Product_api';
import { delete_single_img, add_single_img } from '../../API/Product/handel_img_product.js';

export default function EditProduct() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { categorys } = useSelector((state) => state.category_slice);
  const { subcategories } = useSelector((state) => state.subcategory_slice);
  const { brands } = useSelector((state) => state.brand_slice);
  const { product, loading_product } = useSelector((state) => state.product_slice);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    count: '',
    price: '',
    discount: '',
    category: '',
    subcategory: '',
    brand: '',
    img_cover: null,
    img_cover_url: '',
    imgs: [],
    imgs_url: [],
    img_cover_file: null
  });
  let [formimgs, setformimgs] = useState({
    imgs_file: [],
    imgs_files_view: []
  });
  // Get Data

  useEffect(() => {
    dispatch(one_product(id));
    dispatch(get_category());
    dispatch(get_brand());
    dispatch(get_subcategory());
  }, [id, dispatch]);

  // Set Product Data

  useEffect(() => {
    if (!product) return;

    setFormData({
      name: product.name || '',
      description: product.description || '',
      count: product.count || '',
      price: product.price || '',
      discount: product.discount || '',
      category: product.category?._id || '',
      subcategory: product.subcategory?._id || '',
      brand: product.brand?._id || '',
      img_cover_url: product.img_cover_url || '',
      img_cover: product.img_cover,
      imgs: product.imgs || [],
      imgs_url: product.imgs_url || []
    });
  }, [product]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  let handelselectitem = (target) => {
    setDeleteTarget(formData.imgs[target]);
  };
  let handeldeleteimg = async () => {
    await delete_single_img({ id, imgname: deleteTarget });
    setDeleteTarget(null);
    await dispatch(one_product(id));
  };
  //handel gallary update
  let handleGalleryUpload = async (e) => {
    await add_single_img({ id, img: e.target.files[0] });
    await dispatch(one_product(id));
  };
  if (loading_product?.when_getone) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading product...</p>
      </div>
    );
  }
  let handelproductupdate = async (e) => {
    e.preventDefault();
    let formdatasend = new FormData();
    if (formData.img_cover_file) {
      formdatasend.append('img_cover', formData.img_cover_file);
    }
    formdatasend.append('name', formData.name);
    formdatasend.append('description', formData.description);
    formdatasend.append('count', formData.count);
    formdatasend.append('discount', formData.discount);
    formdatasend.append('brand', formData.brand);
    formdatasend.append('price', formData.price);
    formdatasend.append('category', formData.category);
    formdatasend.append('subcategory', formData.subcategory);
    await dispatch(updata_product({ id, data: formdatasend }));
    await dispatch(one_product(id));
  };
  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold sm:text-4xl">Edit Product</h1>

          <p className="mt-2 text-gray-500">Update product information</p>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow sm:p-6 lg:p-8">
          {/* BASIC INFO */}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {['name', 'count', 'price', 'discount'].map((field) => (
              <div key={field}>
                <label className="font-semibold capitalize">{field}</label>
                <input type={field === 'name' ? 'text' : 'number'} name={field} value={formData[field]} onChange={handleChange} className="mt-2 w-full rounded-xl border p-3" />
              </div>
            ))}

            {/* CATEGORY */}

            <div>
              <label className="font-semibold">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="mt-2 w-full rounded-xl border p-3">
                <option value="">Select Category</option>

                {categorys?.data?.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* SUBCATEGORY */}

            <div>
              <label className="font-semibold">Subcategory</label>

              <select name="subcategory" value={formData.subcategory} onChange={handleChange} className="mt-2 w-full rounded-xl border p-3">
                <option>Select Subcategory</option>

                {subcategories?.data?.map((sub) => (
                  <option
                    key={sub._id}

                    value={sub._id}
                  >
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            {/* BRAND */}

            <div>
              <label className="font-semibold">Brand</label>

              <select
                name="brand"

                value={formData.brand}

                onChange={handleChange}

                className="mt-2 w-full rounded-xl border p-3"
              >
                <option value="">Select Brand</option>

                {brands?.data?.map((brand) => (
                  <option
                    key={brand._id}

                    value={brand._id}
                  >
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* DESCRIPTION */}

          <div className="mt-6">
            <label className="font-semibold">Description</label>

            <textarea
              rows="4"

              name="description"

              value={formData.description}

              onChange={handleChange}

              className="mt-2 w-full rounded-xl border p-3"
            />
          </div>

          {/* COVER IMAGE */}

          <div className="mt-10">
            <h2 className="mb-4 text-xl font-semibold">Cover Image</h2>

            <div className="flex flex-col gap-6 sm:flex-row">
              <img src={formData.img_cover_url || '/no-image.png'} className="h-48 w-48 rounded-2xl border object-cover" />
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-400 px-8 py-10">
                <UploadCloud size={35} className="text-blue-600" />
                <p>Change Cover</p>

                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    setFormData((prev) => ({
                      ...prev,
                      img_cover_url: URL.createObjectURL(file),
                      img_cover_file: file
                    }));
                  }}
                />
              </label>
            </div>
          </div>

          {/* GALLERY */}

          <div className="mt-12">
            <div className="mb-6 flex justify-between">
              <h2 className="text-xl font-semibold">Gallery Images</h2>

              <label className="flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white">
                <Plus size={18} />
                Add Images
                <input hidden type="file" accept="image/*" onChange={handleGalleryUpload} />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {formData.imgs_url.map((img, index) => (
                <div key={index} className="relative">
                  <img src={img} className="h-32 w-full rounded-xl border object-cover" />

                  <button
                    type="button"
                    onClick={() => handelselectitem(index)}

                    className="absolute right-2 top-2 rounded-full bg-red-600 p-2 text-white"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* BUTTONS */}

          <div className="mt-10 flex justify-end gap-3">
            <button
              onClick={() => window.history.back()}

              className="flex items-center gap-2 rounded-xl border px-6 py-3"
            >
              <ArrowLeft size={18} />
            </button>

            <button
              onClick={handelproductupdate}

              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-white"
            >
              <Save size={18} />
              Update Product
            </button>
          </div>
        </div>
      </div>

      {/* DELETE MODAL */}

      {deleteTarget != null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl">
            <AlertCircle className="mb-4 text-red-600" />

            <h3 className="text-lg font-bold">Delete Image</h3>

            <p className="mt-2 text-sm text-gray-500">Are you sure you want to delete this image?</p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setDeleteTarget(null);
                }}

                className="rounded-xl border px-4 py-2"
              >
                Cancel
              </button>

              <button onClick={handeldeleteimg} className="rounded-xl bg-red-600 px-4 py-2 text-white">
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
