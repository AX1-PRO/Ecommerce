import { NavLink, Outlet } from 'react-router';
import { Package, Plus, ListFilter } from 'lucide-react';

export default function ProductLayout() {
  const tabClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 shrink-0 select-none ${
      isActive
        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
    }`;

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">

      {/* ================= HEADER SECTION ================= */}
      <div className="mb-6 sm:mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/60 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <Package size={24} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              Products
            </h1>
            <p className="text-xs sm:text-sm font-medium text-slate-500">
              Manage inventory, prices, images, and catalog items.
            </p>
          </div>
        </div>
      </div>

      {/* ================= NAVIGATION TABS ================= */}
      <div className="mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-1.5 rounded-2xl bg-slate-100 p-1.5 border border-slate-200/50 max-w-full overflow-x-auto no-scrollbar">

          <NavLink to="" end className={tabClass}>
            <ListFilter size={16} />
            <span>All Products</span>
          </NavLink>

          <NavLink to="Createproduct" className={tabClass}>
            <Plus size={16} />
            <span>Create Product</span>
          </NavLink>

        </div>
      </div>

      {/* ================= NESTED PAGE CONTENT ================= */}
      <main className="w-full">
        <Outlet />
      </main>

    </div>
  );
}
