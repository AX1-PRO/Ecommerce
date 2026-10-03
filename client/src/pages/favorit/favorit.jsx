import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getMe } from '../../store/auth/atuh.api';
import { create_cart,get_all_cart } from '../../store/Cart/cart_api';
import { Heart, Trash2, ShoppingCart, Eye, ArrowLeft, Star, Sparkles, Check } from 'lucide-react';
import { get_favorits, delete_fav } from '../../store/favorits/favorits_api';
import { useSelector, useDispatch } from 'react-redux';

export default function Favorites() {
  let dispatch = useDispatch();
  useEffect(() => {
    dispatch(get_favorits());
  }, [dispatch]);
  let { favorites } = useSelector((el) => {
    return el.favorits_slice;
  });
  const handleRemove = async (id) => {
    await dispatch(delete_fav(id));
    await dispatch(getMe());
  };


  const handleAddToCart = async ({ productid, color }) => {

    await dispatch(create_cart({ productid, color }));
    await dispatch(get_all_cart())
  };
  return (
    <div className="bg-slate-50/50 py-8 text-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* ================= HEADER AREA ================= */}
        <div className="mb-8 flex flex-col gap-4 border-b border-slate-200/60 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 shadow-sm">
                <Heart size={22} className="fill-rose-500" />
              </span>
              <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">My Wishlist</h1>
            </div>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              {favorites?.length > 0 ? `You have ${favorites.length} ${favorites.length === 1 ? 'item' : 'items'} saved in your wishlist` : 'Your saved favorite items will appear here'}
            </p>
          </div>


        </div>

        {/* ================= MAIN CONTENT ================= */}
        {favorites?.length === 0 ? (
          /* EMPTY STATE DESIGN */
          <div className="my-12 flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="relative mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-rose-50 text-rose-500">
              <Heart size={40} className="stroke-1 text-rose-400" />
              <Sparkles size={18} className="absolute right-2 top-2 animate-pulse text-amber-400" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">Your Wishlist is empty</h3>

            <p className="mt-2 max-w-sm text-xs leading-relaxed text-slate-500 sm:text-sm">
              Explore our collection and tap the heart icon on any product to save your absolute favorites here for later.
            </p>

            <Link
              to={`/products`}

              className="mt-6 flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700 active:scale-95"
            >
              <ArrowLeft size={18} />
              <span>Explore Products</span>
            </Link>
          </div>
        ) : (
          /* FAVORITES GRID */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favorites?.map((product) => {
              const originalPrice = product.price;
              const discountAmount = product.discount || 0;
              const finalPrice = Math.max(0, originalPrice - discountAmount);
              const discountPercentage = discountAmount > 0 ? Math.round((discountAmount / originalPrice) * 100) : 0;

              return (
                <div
                  key={product._id}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5"
                >
                  {/* Remove Button (Trash Badge Top Right) */}
                  <button
                    onClick={() => handleRemove(product._id)}
                    title="Remove from favorites"
                    aria-label="Remove item"
                    className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-400 shadow-sm backdrop-blur transition hover:bg-rose-50 hover:text-rose-500 active:scale-90"
                  >
                    <Trash2 size={16} />
                  </button>

                  {/* Image Container */}
                  <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-50">
                    <img src={product.img_cover_url} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />

                    {/* Discount Tag */}
                    {discountPercentage > 0 && <span className="absolute left-3 top-3 rounded-lg bg-rose-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">-{discountPercentage}%</span>}

                    {/* Out of Stock Overlay Badge */}
                    {product.count < 1 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px]">
                        <span className="rounded-lg bg-slate-900 px-3 py-1 text-xs font-bold text-white shadow">Out of Stock</span>
                      </div>
                    )}

                    {/* Quick View Link Button */}
                    <div className="absolute inset-x-3 bottom-3 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
                      <a
                        href={`/products/productEdit/${product._id}`}
                        className="flex h-9 w-full items-center justify-center gap-1.5 rounded-xl bg-white/95 px-3 text-xs font-semibold text-slate-700 shadow-md backdrop-blur transition hover:bg-indigo-600 hover:text-white"
                      >
                        <Eye size={14} />
                        Quick View
                      </a>
                    </div>
                  </div>

                  {/* Details Container */}
                  <div className="mt-4 flex flex-1 flex-col">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">{product.category}</span>

                      {/* Rating */}
                      <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
                        <Star size={13} className="fill-amber-400 text-amber-400" />
                        <span>{product.rating}</span>
                      </div>
                    </div>

                    <h3 className="mt-1.5 line-clamp-2 text-sm font-semibold leading-snug text-slate-800 transition-colors group-hover:text-indigo-600">{product.name}</h3>

                    {/* Price Section */}
                    <div className="mt-auto pt-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-slate-900">${finalPrice.toFixed(2)}</span>

                        {discountAmount > 0 && <span className="text-xs font-medium text-slate-400 line-through">${originalPrice.toFixed(2)}</span>}
                      </div>
                    </div>

                    {/* Add to Cart Action */}
                    <button
                      disabled={product.count < 1}
                      onClick={() =>
                        handleAddToCart({ productid: product?._id,  color: product?.colors?.[0]?.split(',')[0] })}
                      className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold shadow-sm transition active:scale-95 sm:text-sm ${
                        product.count < 1 ? 'cursor-not-allowed bg-slate-100 text-slate-400' : 'bg-slate-900 text-white hover:bg-indigo-600'
                      }`}
                    >
                      <ShoppingCart size={16} />
                      <span className={`${!product.count < 1 ? 'cursor-pointer' : ''}`}>{!product.count < 1 ? 'Add To Cart' : 'Out of Stock'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
