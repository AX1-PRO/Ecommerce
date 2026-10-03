import { NavLink } from 'react-router';
import { FolderTree, Layers, Package, Tag, Users, ShoppingBag, LayoutDashboard,TagIcon } from 'lucide-react';

export default function AdminHeader() {
  const navItems = [
    { to: 'category', label: 'Categories', icon: FolderTree },
    { to: 'subcategory', label: 'Subcategories', icon: Layers },
    { to: 'products', label: 'Products', icon: Package },
    { to: 'brand', label: 'Brands', icon: Tag },
    { to: 'users', label: 'Users', icon: Users },
    { to: 'coupons', label: 'coupons', icon: TagIcon },
    { to: 'orders', label: 'orders', icon: ShoppingBag }
  ];

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 shrink-0 select-none ${
      isActive ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
        {/* Admin Badge / Logo Indicator */}
        <div className="hidden items-center gap-2 border-r border-slate-200 pr-4 text-sm font-black uppercase tracking-wide text-indigo-600 sm:flex">
          <LayoutDashboard size={18} />
          <span>Admin Console</span>
        </div>

        {/* Navigation Tabs */}
        <nav className="no-scrollbar flex-1 overflow-x-auto scroll-smooth">
          <ul className="flex items-center gap-1.5 whitespace-nowrap py-1 sm:gap-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink to={to} className={linkClass}>
                  <Icon size={16} className="shrink-0" />
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
