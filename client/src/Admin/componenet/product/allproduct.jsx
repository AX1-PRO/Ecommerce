import { useEffect, useState } from 'react';
import { Search, Plus, Trash2, Edit, Package, Star, Boxes, TrendingUp, AlertTriangle, X } from 'lucide-react';
import {useSelector,useDispatch} from 'react-redux'
import {Link} from 'react-router'
import { get_products,delete_product } from '../../../store/Product/Product_api';
export default function AllProducts() {
  let dispatch=useDispatch()
  const [search, setSearch] = useState('');
  useEffect(()=>{
    dispatch(get_products({"keyword":search}))
  },[search])
  let {products,loading_product,error_product}=useSelector((e)=>{return e.product_slice})
  const [d_product, setD_product] = useState({product_id:null,product_name:null});
//delete product
  const handleDelete = async(id) => {
     dispatch(await delete_product(id))
     dispatch(await get_products({}))
    setD_product(null);
  };
  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      {/* ================= HEADER ================= */}
      <div className="mb-6 flex flex-col gap-4 border-b border-slate-200/60 pb-6 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <Package size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">Products Management</h1>
            <p className="text-xs font-medium text-slate-500 sm:text-sm">Manage your product catalog, inventory, and ratings.</p>
          </div>
        </div>


      </div>

      {/* ================= STATS CARDS ================= */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:mb-8 lg:grid-cols-4">
        <div className="flex items-center justify-between rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm sm:p-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Products</p>
            <h3 className="mt-1 text-xl font-black text-slate-900 sm:text-2xl">{products?.products_count}</h3>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Package size={20} />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm sm:p-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">In Stock</p>
            <h3 className="mt-1 text-xl font-black text-emerald-600 sm:text-2xl">2,100</h3>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Boxes size={20} />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm sm:p-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Avg Rating</p>
            <h3 className="mt-1 text-xl font-black text-amber-500 sm:text-2xl">4.9</h3>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
            <Star size={20} />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm sm:p-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Sold</p>
            <h3 className="mt-1 text-xl font-black text-blue-600 sm:text-2xl">980</h3>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <TrendingUp size={20} />
          </div>
        </div>
      </div>

      {/* ================= SEARCH BAR ONLY ================= */}
      <div className="mb-6">
        <div className="relative w-full max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by name, category, or brand..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs font-medium shadow-sm transition focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 sm:text-sm"
          />
        </div>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200/60 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="px-6 py-3.5">Image</th>
                <th className="px-6 py-3.5">Product</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Brand</th>
                <th className="px-6 py-3.5">Price</th>
                <th className="px-6 py-3.5">Stock</th>
                <th className="px-6 py-3.5">Rating</th>
                <th className="px-9 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700 sm:text-sm">
              {products?.length > 0 ? (
                products?.data?.map((product) => (
                  <tr key={product.id} className="transition duration-150 hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <img src={product.img_cover_url} alt={product.name} className="h-12 w-12 rounded-xl border border-slate-200/80 object-cover" />
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">{product.name}</td>
                    <td className="px-6 py-4 font-semibold text-slate-600">{product.category.name}</td>
                    <td className="px-6 py-4 text-slate-500">{product.brand.name}</td>
                    <td className="px-6 py-4 font-black text-indigo-600">${product.price}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full border border-emerald-200/60 bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700"> pcs</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 font-bold text-amber-500">
                        <Star size={14} className="fill-amber-400" />
                        <span>{product.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Edit Button */}
                        <Link to={`Editproduct/${product._id}`}
                          className="inline-flex items-center gap-1 rounded-lg bg-slate-100 p-2 text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600"
                          title="Edit Product"
                        >
                          <Edit size={16} />
                        </Link>

                        {/* Delete Button */}
                        <button
                          onClick={() => setD_product({product_id:product.id,product_name:product.name})}
                          className="inline-flex items-center gap-1 rounded-lg bg-rose-50 p-2 text-rose-600 transition hover:bg-rose-100"
                          title="Delete Product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center font-medium text-slate-400">
                    No products found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="grid gap-3 md:hidden">
        {products?.length > 0 ? (
          products?.data?.map((product) => (
            <div key={product.id} className="flex items-center gap-4 rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm">
              <img src={product.img_cover_url} alt={product.name} className="h-16 w-16 shrink-0 rounded-xl border border-slate-200/80 object-cover" />

              <div className="min-w-0 flex-1">
                <h3 className="truncate font-bold text-slate-900">{product.name}</h3>
                <p className="text-xs font-medium text-slate-400">
                  {product.category.name} • {product.brand.name}
                </p>
                <div className="mt-1.5 flex items-center gap-3">
                  <span className="text-sm font-black text-indigo-600">${product.price}</span>
                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700"> in stock</span>
                </div>
              </div>

              {/* Action Buttons (Mobile) */}
              <div className="flex shrink-0 flex-col gap-2">
                <Link to={`Editproduct/${product._id}`} onClick={() => handleEdit(product)} className="rounded-xl bg-slate-100 p-2 text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600" title="Edit Product">
                  <Edit size={16} />
                </Link>
                <button onClick={() => setD_product({product_id:product.id,product_name:product.name})} className="rounded-xl bg-rose-50 p-2 text-rose-600 transition hover:bg-rose-100" title="Delete Product">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-slate-200/60 bg-white p-8 text-center text-slate-400">No products found matching your search.</div>
        )}
      </div>

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {d_product?.product_id && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="animate-in fade-in zoom-in relative w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl duration-150">
            <button onClick={() => setD_product(null)} className="absolute right-4 top-4 text-slate-400 transition hover:text-slate-600">
              <X size={18} />
            </button>

            <div className="mb-3 flex items-center gap-3 text-rose-600">
              <div className="rounded-xl bg-rose-50 p-2.5">
                <AlertTriangle size={22} />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Delete Product</h2>
            </div>

            <p className="mb-6 text-xs leading-relaxed text-slate-500 sm:text-sm">
              Are you sure you want to delete <span className="font-bold text-slate-800">"{delete_product?.product_name}"</span>? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-2.5">
              <button onClick={() => setD_product(null)} className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-200 sm:text-sm">
                Cancel
              </button>

              <button
                onClick={() => handleDelete(d_product.product_id)}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-rose-600/20 transition hover:bg-rose-700 sm:text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
