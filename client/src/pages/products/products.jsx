import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Filter, X, SlidersHorizontal, Heart, Eye, ShoppingCart, Star, RotateCcw } from 'lucide-react';
import {create_fav} from "../../store/favorits/favorits_api"
import { get_products } from '../../store/Product/Product_api';
import { get_category } from '../../store/category/category_api';
import { get_brand } from '../../store/brand/brand_api';
import {getMe} from '../../store/auth/atuh.api'
import { create_cart } from '../../store/Cart/cart_api';
import { get_all_cart } from '../../store/Cart/cart_api';
export default function Products() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth_slice);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const keyword = searchParams.get('keyword') || '';

  const { products, loading } = useSelector((state) => state.product_slice || {});
  const { categorys } = useSelector((state) => state.category_slice || {});
  const { brands } = useSelector((state) => state.brand_slice || {});

  const [openFilter, setOpenFilter] = useState(false);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    min: searchParams.get('price[gte]') || '',
    max: searchParams.get('price[lte]') || '',
    sort: searchParams.get('sort') || ''
  });

  // Load categories and brands once
  useEffect(() => {
    dispatch(get_category());
    dispatch(get_brand());
  }, [dispatch]);

  // Fetch products function
  const fetchProducts = useCallback(
    (page = 1) => {
      dispatch(
        get_products({
          page,
          keyword,
          category: filters.category,
          brand: filters.brand,
          'price[gte]': filters.min,
          'price[lte]': filters.max,
          sort: filters.sort
        })
      );
    },
    [dispatch, keyword, filters]
  );

  useEffect(() => {
    fetchProducts(1);
  }, [keyword]);

  const changeFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const applyFilter = () => {
    const params = new URLSearchParams();
    if (filters.category) params.set('category', filters.category);
    if (filters.brand) params.set('brand', filters.brand);
    if (filters.min) params.set('price[gte]', filters.min);
    if (filters.max) params.set('price[lte]', filters.max);
    if (filters.sort) params.set('sort', filters.sort);
    if (keyword) params.set('keyword', keyword);

    navigate(`/products?${params.toString()}`);
    fetchProducts(1);
    setOpenFilter(false);
  };

  const clearFilter = () => {
    const empty = {
      category: '',
      brand: '',
      min: '',
      max: '',
      sort: ''
    };

    setFilters(empty);
    navigate('/products');
    dispatch(
      get_products({
        page: 1,
        keyword: ''
      })
    );
    setOpenFilter(false);
  };

  const handlePage = (page) => {
    fetchProducts(page);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const getPages = () => {
    const current = products?.page || 1;
    const total = products?.page_count || 1;
    const pages = [];

    if (total <= 5) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push('...');
      for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
        pages.push(i);
      }
      if (current < total - 2) pages.push('...');
      pages.push(total);
    }

    return pages;
  };
 let handeladdtofav=async(id)=>{
   await dispatch(create_fav(id))
   await dispatch(getMe())
 }
 let handeltoaddtocart=async({productid,color})=>{
  await dispatch(create_cart({productid,color}))
  await dispatch(get_all_cart())
 }
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Mobile Filter Toggle */}
      <div className="mb-6 flex items-center justify-between md:hidden">
        <button onClick={() => setOpenFilter(true)} className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-slate-800">
          <SlidersHorizontal size={16} />
          Filters & Sort
        </button>
        <span className="text-sm font-medium text-slate-500">{products?.data?.length || 0} Products</span>
      </div>

      {/* Mobile Backdrop */}
      {openFilter && <div onClick={() => setOpenFilter(false)} className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden" />}

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-[280px] overflow-y-auto bg-white p-6 shadow-2xl transition-transform duration-300 sm:w-[320px] md:static md:z-0 md:w-[260px] md:shrink-0 md:overflow-visible md:rounded-2xl md:border md:border-slate-100 md:bg-white md:p-5 md:shadow-sm lg:w-[280px] ${
            openFilter ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          {/* Sidebar Header */}
          <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 text-slate-900">
              <Filter size={18} className="text-indigo-600" />
              <h2 className="text-lg font-bold">Filter Options</h2>
            </div>
            <button onClick={() => setOpenFilter(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 md:hidden">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-5">
            {/* Category Filter */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">Category</label>
              <select
                value={filters.category}
                onChange={(e) => changeFilter('category', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">All Categories</option>
                {categorys?.data?.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">Brand</label>
              <select
                value={filters.brand}
                onChange={(e) => changeFilter('brand', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">All Brands</option>
                {brands?.data?.map((brand) => (
                  <option key={brand._id} value={brand._id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">Price Range ($)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.min}
                  onChange={(e) => changeFilter('min', e.target.value)}
                  className="w-1/2 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                />
                <span className="text-slate-400">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.max}
                  onChange={(e) => changeFilter('max', e.target.value)}
                  className="w-1/2 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">Sort By</label>
              <select
                value={filters.sort}
                onChange={(e) => changeFilter('sort', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">Default Order</option>
                <option value="-price">Price: High → Low</option>
                <option value="price">Price: Low → High</option>
                <option value="-rating">Highest Rating</option>
                <option value="-createdAt">Newest Arrivals</option>
              </select>
            </div>

            {/* Filter Actions */}
            <div className="space-y-2 pt-2">
              <button onClick={applyFilter} className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-700 active:scale-95">
                Apply Filters
              </button>
              <button
                onClick={clearFilter}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 active:scale-95"
              >
                <RotateCcw size={14} />
                Reset All
              </button>
            </div>
          </div>
        </aside>

        {/* Products Grid Area */}
        <main className="flex-1">
          {/* Skeleton Loading State */}
          {loading?.when_getall ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-3 rounded-2xl border border-slate-100 bg-white p-3">
                  <div className="h-44 w-full animate-pulse rounded-xl bg-slate-200" />
                  <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />
                  <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
                  <div className="h-6 w-1/2 animate-pulse rounded bg-slate-200" />
                </div>
              ))}
            </div>
          ) : !products?.data || products.data.length === 0 ? (
            /* Empty State */
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <Filter size={28} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No Products Found</h3>
              <p className="mt-1 max-w-sm text-sm text-slate-500">We couldn't find anything matching your filters. Try clearing some options.</p>
              <button onClick={clearFilter} className="mt-4 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-700">
                Reset Filters
              </button>
            </div>
          ) : (
            /* Products Grid */
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.data.map((product) => (
                <div
                  key={product._id}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5"
                >
                  {/* Image Container */}
                  <div className="relative aspect-square overflow-hidden bg-slate-50 p-4">
                    <img
                      src={product.img_cover_url || '/empty.png'}
                      alt={product.name}
                      loading="lazy"
                      className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Discount Badge */}
                    {product.discount && (
                      <span className="absolute left-3 top-3 rounded-lg bg-rose-500 px-2 py-1 text-[10px] font-bold text-white shadow-sm">
                        -{Math.round((product.discount / product.price)*100)}%
                      </span>
                    )}

                    {/* Favorite Button */}
                    {
                      user?
                      <button onClick={()=>{handeladdtofav(product._id)}} aria-label="Add to wishlist" className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-400 shadow-sm backdrop-blur transition hover:scale-110 hover:text-rose-500">
                      <Heart size={16} />
                    </button>:
                    <Link to={'/Login'} aria-label="Add to wishlist"  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-400 shadow-sm backdrop-blur transition hover:scale-110 hover:text-rose-500"  >
                      <Heart className=' cursor-not-allowed' size={16} />
                    </Link>
                    }


                    {/* Quick Hover Actions */}
                    <div className="absolute inset-x-3 bottom-3 flex justify-center gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100">
                      <Link
                        to={`productEdit/${product._id}`}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-700 shadow-md transition hover:bg-indigo-600 hover:text-white"
                        title="View Details" >
                        <Eye size={16} />
                      </Link>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-1 flex-col p-4">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">{product.category?.name || 'Category'}</span>

                    <h3 className="mt-1 line-clamp-2 min-h-[40px] text-xs font-semibold text-slate-800 transition-colors group-hover:text-indigo-600">{product.name}</h3>

                    {/* Rating */}
                    <div className="mt-2 flex items-center gap-1.5">
                      <div className="flex items-center gap-1 rounded-md bg-amber-50 px-1.5 py-0.5 text-amber-600">
                        <Star size={12} className="fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold">{product.rating || 0}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">({product.count_rating || 0})</span>
                    </div>

                    {/* Price and Stock */}
                    <div className="mt-auto pt-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-bold text-slate-900">${product.price - product.discount}</span>
                        {product.discount && <span className="text-xs text-slate-400 line-through">${product.price}</span>}
                      </div>

                      {/* Add to Cart Button */}
                      {
                        user?( <button
                      onClick={()=>{handeltoaddtocart({productid:product._id,color:product.colors[0].split(",")[0]})}}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-600 active:scale-95">
                        <ShoppingCart size={14} />
                        Add To Cart
                      </button>):( <Link to={'/Login'}
                      className="mt-3 cursor-not-allowed flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-600 active:scale-95">
                        <ShoppingCart size={14} />
                        Add To Cart
                      </Link>)
                      }

                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading?.when_getall && products?.page_count > 1 && (
            <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
              <button
                disabled={products.page === 1}
                onClick={() => handlePage(products.page - 1)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              {getPages().map((page, index) =>
                page === '...' ? (
                  <span key={index} className="px-2 text-xs text-slate-400">
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => handlePage(page)}
                    className={`h-9 w-9 rounded-xl text-xs font-bold transition ${
                      products.page === page ? 'bg-indigo-600 text-white shadow-md' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                disabled={products.page === products.page_count}
                onClick={() => handlePage(products.page + 1)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
