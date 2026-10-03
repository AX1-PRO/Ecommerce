import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, X, Search } from 'lucide-react';
import { Link, Outlet, NavLink } from 'react-router';
import { get_products } from '../../store/Product/Product_api';
import { useNavigate } from 'react-router';

export default function Logged_header() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setsearch] = useState('');
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth_slice);
  const { products } = useSelector((state) => state.product_slice);
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim()) {
        dispatch(get_products({ keyword: search }));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search, dispatch]);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      navigate(`/products?keyword=${search.trim()}`);
      setsearch('');
    }
  };

  return (
    <>
      {/* Fixed Header */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b bg-white shadow-sm">
        <div className="container mx-auto px-4">
          {/* Top Bar */}
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              <Link to="/">
                <h1 className="text-2xl font-bold text-blue-600 max-md:text-xl">E-Commerce</h1>
              </Link>
            </div>

            {/* Desktop Search */}
            <div className="relative mx-8 hidden max-w-xl flex-1 md:flex">
              <div className="flex w-full items-center rounded-xl border bg-white px-4 py-2 shadow-sm">
                <Search size={18} className="text-gray-500" />

                <input
                  onKeyDown={handleSearch}
                  value={search}
                  onChange={(e) => setsearch(e.target.value)}
                  type="text"
                  placeholder="Search products..."
                  className="ml-3 w-full bg-transparent outline-none"
                />
              </div>

              {search.length >= 2 && (
                <div className="absolute left-0 top-[110%] z-50 max-h-96 w-full overflow-hidden overflow-y-auto rounded-xl border bg-white shadow-2xl">
                  {products?.data?.length ? (
                    products.data.map((el) => (
                      <Link key={el._id} to={`products/productEdit/${el._id}`} onClick={() => setsearch('')}>
                        <div className="flex cursor-pointer items-center gap-3 border-b px-4 py-3 transition-all duration-200 hover:bg-blue-600 hover:text-white">
                          <img src={el.img_cover_url || el.img_cover || '/no-image.png'} alt={el.name} className="h-12 w-12 rounded-lg object-cover" />

                          <div className="flex flex-col">
                            <span className="font-medium capitalize">{el.name}</span>
                            <span className="text-xs opacity-70">${el.price}</span>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">No products found</div>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 max-md:gap-6 mr-5">
              <Link to="/Register">
                <p type="button" className="w-full rounded-lg  bg-blue-600 px-5 py-3 font-semibold text-white transition duration-200 hover:bg-blue-700 active:scale-95">
                  Register
                </p>
              </Link>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="relative pb-4 md:hidden">
            <div className="flex items-center rounded-xl border bg-white px-4 py-2 shadow-sm">
              <Search size={18} className="text-gray-500" />

              <input
                onKeyDown={handleSearch}
                value={search}
                onChange={(e) => setsearch(e.target.value)}
                type="text"
                placeholder="Search products..."
                className="ml-3 w-full bg-transparent outline-none"
              />
            </div>

            {search && (
              <div className="absolute left-0 top-[110%] z-50 max-h-80 w-full overflow-y-auto rounded-xl border bg-white shadow-2xl">
                {products?.data?.length ? (
                  products.data.map((el) => (
                    <Link key={el._id} to={`products/productEdit/${el._id}`} onClick={() => setsearch('')}>
                      <div className="flex cursor-pointer items-center gap-3 border-b px-4 py-3 transition-all duration-200 hover:bg-blue-600 hover:text-white">
                        <img src={el.img_cover_url || el.img_cover || '/no-image.png'} alt={el.name} className="h-10 w-10 rounded-lg object-cover" />
                        <span className="font-medium capitalize">{el.name}</span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="p-4 text-center text-gray-500">No products found</p>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="animate-in fade-in absolute left-0 top-[100%] z-50 w-full px-4 md:hidden">
              <nav className="overflow-hidden rounded-2xl border border-gray-200 bg-white/95 p-3 shadow-2xl backdrop-blur">
                <NavLink
                  onClick={() => setIsOpen(false)}
                  to="/"
                  className={({ isActive }) =>
                    `flex items-center rounded-xl px-4 py-3 font-medium transition-all duration-300 ${
                      isActive ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                    }`
                  }
                >
                  Home
                </NavLink>

                <NavLink
                  onClick={() => setIsOpen(false)}
                  to="/products"
                  className={({ isActive }) =>
                    `mt-2 flex items-center rounded-xl px-4 py-3 font-medium transition-all duration-300 ${
                      isActive ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                    }`
                  }
                >
                  Products
                </NavLink>

                <NavLink
                  onClick={() => setIsOpen(false)}
                  to="/categorys"
                  className={({ isActive }) =>
                    `mt-2 flex items-center rounded-xl px-4 py-3 font-medium transition-all duration-300 ${
                      isActive ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                    }`
                  }
                >
                  Categories
                </NavLink>

                <NavLink
                  onClick={() => setIsOpen(false)}
                  to="/About"
                  className={({ isActive }) =>
                    `mt-2 flex items-center rounded-xl px-4 py-3 font-medium transition-all duration-300 ${
                      isActive ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                    }`
                  }
                >
                  About
                </NavLink>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Spacer to prevent header from covering page content */}
      <div className="h-16 md:h-16"></div>

      {/* Page Content */}
      <Outlet />
    </>
  );
}
