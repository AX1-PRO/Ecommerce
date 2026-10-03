import { useEffect, useState, useMemo } from 'react';
import { Search, Plus, Trash2, Pencil, FolderTree, AlertCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { get_category, delete_category } from '../../../store/category/category_api.js';

export default function AllCategory() {
  const dispatch = useDispatch();
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const { categorys, loading } = useSelector((state) => state.category_slice || {});

  useEffect(() => {
    dispatch(get_category());
  }, [dispatch]);

  // Extract category list safely
  const categoryList = useMemo(() => {
    if (Array.isArray(categorys?.data)) return categorys.data;
    return [];
  }, [categorys]);

  // Filter Categories by search term
  const filteredCategories = useMemo(() => {
    return categoryList.filter((cat) => cat?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || cat?.slug?.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [categoryList, searchTerm]);

  // Handle Delete Action
  const handleDelete = async (id) => {
    try {
      setIsDeleting(true);
      await dispatch(delete_category(id)).unwrap();
      await dispatch(get_category());
    } catch (err) {
      console.error('Delete category failed:', err);
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  // 1. Loading State (Skeleton Grid)
  if (loading?.when_get) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-14 w-full rounded-2xl bg-slate-200" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-72 rounded-3xl bg-slate-200" />
          ))}
        </div>
      </div>
    );
  }

  // 2. Empty State
  if (!loading?.when_get && categoryList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <FolderTree size={32} />
        </div>
        <h3 className="text-lg font-bold text-slate-900">No categories found</h3>
        <p className="mt-1 max-w-sm text-sm text-slate-500">Get started by creating your first product category to organize your shop.</p>
        <Link
          to="/admin/category/Createcategory"
          className="mt-6 flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95"
        >
          <Plus size={16} />
          <span>Add New Category</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search & Actions Bar */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:flex-row">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search categories by name or slug..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-600/10"
          />
        </div>
      </div>

      {/* Grid List */}
      {filteredCategories.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 text-center text-slate-500">No categories match your search search "{searchTerm}".</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map((cat) => (
            <div key={cat._id} className="group flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md">
              {/* Category Image */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                {cat.imageUrl ? (
                  <img src={cat.imageUrl} alt={cat.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-300">
                    <FolderTree size={48} />
                  </div>
                )}
                <div className="absolute left-3 top-3 rounded-lg bg-black/40 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md">{cat.slug || 'no-slug'}</div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-indigo-600">{cat.name}</h3>
                  <p className="mt-1 text-xs text-slate-400">Created: {cat.createdAt ? new Date(cat.createdAt).toLocaleDateString() : 'N/A'}</p>
                </div>

                {/* Actions */}
                <div className="mt-6 flex items-center justify-between gap-2 border-t border-slate-100 pt-4">
                  <Link
                    to={`Editcategory/${cat._id}`}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-50 py-2 text-xs font-bold text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <Pencil size={14} />
                    <span>Edit</span>
                  </Link>

                  <button
                    onClick={() => setDeleteId(cat._id)}
                    className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-rose-50 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-600 hover:text-white"
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl border border-slate-100 bg-white p-6 shadow-xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <AlertCircle size={24} />
            </div>

            <h3 className="text-lg font-bold text-slate-900">Delete Category</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Are you sure you want to delete this category? This action cannot be undone and may affect related subcategories and products.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                disabled={isDeleting}
                onClick={() => setDeleteId(null)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                disabled={isDeleting}
                onClick={() => handleDelete(deleteId)}
                className="flex cursor-pointer items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-rose-700 disabled:opacity-50"
              >
                {isDeleting && <Loader2 size={14} className="animate-spin" />}
                <span>{isDeleting ? 'Deleting...' : 'Confirm Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
