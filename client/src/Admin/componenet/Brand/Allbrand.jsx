import { useEffect, useState, useMemo } from 'react';
import { Search, Plus, Trash2, Pencil, Loader2 } from 'lucide-react';
import { Link } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { get_brand, delete_brand } from '../../../store/brand/brand_api';

export default function Allbrand() {
  const dispatch = useDispatch();
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [search, setSearch] = useState('');

  const { brands, loading } = useSelector((e) => e.brand_slice);

  useEffect(() => {
    dispatch(get_brand());
  }, [dispatch]);

  // Safe access to brands array
  const brandList = useMemo(() => {
    if (Array.isArray(brands)) return brands;
    if (Array.isArray(brands?.data)) return brands.data;
    return [];
  }, [brands]);

  // Filter list based on search query
  const filteredBrands = useMemo(() => {
    return brandList.filter((brand) => brand.name?.toLowerCase().includes(search.toLowerCase()));
  }, [brandList, search]);

  // Handle delete item
  const handleDelete = async (id) => {
    setIsDeleting(true);
    await dispatch(delete_brand(id));
    await dispatch(get_brand());
    setIsDeleting(false);
    setDeleteId(null);
  };

  // Loading State
  if (loading?.when_get) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3 text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-sm font-medium">Loading brands...</p>
      </div>
    );
  }

  return (
    <div className=" bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl">Brands</h1>
            <p className="mt-1 text-sm text-slate-500 sm:text-base">Manage all product brands</p>
          </div>


        </div>

        {/* Search Input */}
        <div className="mb-6 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm sm:mb-8">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search brand by name..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:bg-white sm:py-3 sm:text-base"
            />
          </div>
        </div>

        {/* Empty State */}
        {filteredBrands.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <p className="font-medium text-slate-500">{search ? 'No brands found matching your search.' : 'No brands available.'}</p>
          </div>
        ) : (
          /* Grid List */
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {filteredBrands.map((cat) => (
              <div key={cat._id} className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition hover:shadow-md">
                <div className="relative h-40 w-full bg-slate-100 sm:h-44 lg:h-48">
                  <img
                    src={cat.imageUrl}
                    className="h-full w-full object-cover"
                    alt={cat.name}
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/600x400?text=No+Image';
                    }}
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                  <div>
                    <h2 className="line-clamp-1 text-lg font-bold text-slate-800 sm:text-xl">{cat.name}</h2>
                    <p className="mt-1 font-mono text-xs text-slate-400">{cat.slug}</p>
                    {cat.createdAt && <p className="mt-3 text-xs text-slate-400">Created: {new Date(cat.createdAt).toLocaleDateString()}</p>}
                  </div>

                  <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4">
                    <Link
                      to={`Editbrand/${cat._id}`}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      <Pencil size={16} className="text-slate-500" />
                      Edit
                    </Link>

                    <button
                      onClick={() => setDeleteId(cat._id)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-2xl border border-slate-100 bg-white p-6 shadow-xl">
              <h2 className="mb-1 text-lg font-bold text-slate-900">Delete Brand</h2>
              <p className="mb-6 text-sm text-slate-500">Are you sure you want to delete this brand? This action cannot be undone.</p>

              <div className="flex justify-end gap-3">
                <button disabled={isDeleting} onClick={() => setDeleteId(null)} className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200">
                  Cancel
                </button>

                <button
                  disabled={isDeleting}
                  onClick={() => handleDelete(deleteId)}
                  className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-70"
                >
                  {isDeleting && <Loader2 size={15} className="animate-spin" />}
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
