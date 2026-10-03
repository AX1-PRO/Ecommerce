import { useEffect, useState, useMemo } from 'react';
import { Search, Plus, Trash2, Pencil, Loader2 } from 'lucide-react';
import { Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { get_subcategory, delete_subcategory } from '../../../store/sub_category/sub_category_api';

export default function AllSubcategory() {
  const dispatch = useDispatch();
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [search, setSearch] = useState('');

  const { subcategories, loading } = useSelector((state) => state.subcategory_slice);

  useEffect(() => {
    dispatch(get_subcategory());
  }, [dispatch]);

  // Safe access to array data
  const subcategoryList = useMemo(() => {
    if (Array.isArray(subcategories)) return subcategories;
    if (Array.isArray(subcategories?.data)) return subcategories.data;
    return [];
  }, [subcategories]);

  // Filter list based on search query
  const filteredList = useMemo(() => {
    return subcategoryList.filter((item) => item.name?.toLowerCase().includes(search.toLowerCase()));
  }, [subcategoryList, search]);

  const handleDelete = async (id) => {
    setIsDeleting(true);
    await dispatch(delete_subcategory(id));
    await dispatch(get_subcategory());
    setIsDeleting(false);
    setDeleteId(null);
  };

  // 1. Loading State
  if (loading?.when_getall) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3 text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-sm font-medium">Loading subcategories...</p>
      </div>
    );
  }

  return (
    <div className=" bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Subcategories</h1>
            <p className="mt-1 text-sm text-slate-500">Manage and organize all your product subcategories</p>
          </div>


        </div>

        {/* Search Input */}
        <div className="mb-6 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search subcategory by name..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Empty State */}
        {filteredList.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <p className="font-medium text-slate-500">{search ? 'No subcategories found matching your search.' : 'No subcategories available.'}</p>
          </div>
        ) : (
          /* Grid List */
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredList.map((item) => (
              <div key={item._id} className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition hover:shadow-md">
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/600x400?text=No+Image';
                    }}
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <h2 className="line-clamp-1 text-lg font-bold text-slate-800">{item.name}</h2>
                    <p className="mt-0.5 font-mono text-xs text-slate-400">{item.slug}</p>
                    {item.category?.name && <span className="mt-3 inline-block rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">Category: {item.category.name}</span>}
                  </div>

                  <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4">
                    <Link
                      to={`Editsubcategory/${item._id}`}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      <Pencil size={15} className="text-slate-500" />
                      Edit
                    </Link>

                    <button
                      onClick={() => setDeleteId(item._id)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-2xl border border-slate-100 bg-white p-6 shadow-xl">
              <h2 className="mb-1 text-lg font-bold text-slate-900">Delete Subcategory</h2>
              <p className="mb-6 text-sm text-slate-500">Are you sure you want to delete this subcategory? This action cannot be undone.</p>

              <div className="flex items-center justify-end gap-3">
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
