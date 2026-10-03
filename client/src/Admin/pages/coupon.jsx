import { NavLink, Outlet } from 'react-router';
import { Tag, Plus, ListFilter } from 'lucide-react';

export default function Category() {
  const tabClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 shrink-0 select-none ${
      isActive ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
    }`;

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      {/* ================= HEADER SECTION ================= */}
      <div className="mb-6 flex flex-col gap-3 border-b border-slate-200/60 pb-6 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <Tag size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">coupons</h1>
            <p className="text-xs font-medium text-slate-500 sm:text-sm">Manage, create, coupons.</p>
          </div>
        </div>
      </div>

      {/* ================= NAVIGATION TABS ================= */}
      <div className="mb-6 sm:mb-8">
        <div className="no-scrollbar inline-flex max-w-full items-center gap-1.5 overflow-x-auto rounded-2xl border border-slate-200/50 bg-slate-100 p-1.5">
          <NavLink to="" end className={tabClass}>
            <ListFilter size={16} />
            <span>All Coupons</span>
          </NavLink>

          <NavLink to="Createcoupon" className={tabClass}>
            <Plus size={16} />
            <span>Create Coupons</span>
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
