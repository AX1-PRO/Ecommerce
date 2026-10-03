import { useEffect, useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, ShieldCheck, Truck, Sparkles, CheckCircle2 } from 'lucide-react';
import { useSelector, useDispatch } from "react-redux";
import { delete_all_cart, delete_cart, get_all_cart, updata_cart,applayCoupon } from "../../store/Cart/cart_api";
import { Link } from 'react-router';
export default function CartPage() {
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((el) => el.cart_slice);

  useEffect(() => {
    dispatch(get_all_cart());
  }, [dispatch]);

  const [couponCode, setCouponCode] = useState('');
  const [discountRate, setDiscountRate] = useState(0);
  const [couponError, setCouponError] = useState('');

  const FREE_SHIPPING_THRESHOLD = 800;

  // Cart items safely extracted
  const items = cart?.items || [];

  // Total prices and calculations
  const subtotal = cart?.totalprice;
  const totalItemsCount = items.length;
  const discountAmount = subtotal * discountRate;
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || items.length === 0 ? 0 : 50;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);
  const progressToFreeShipping = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  // Handlers Quantity
  const updateQuantity = async(itemId,target,count) => {
     let newCount = count;
     if (target === "min") { newCount = count - 1; }
     if (target === "add") { newCount = count + 1; }
     if (newCount < 1) return;
     await dispatch(updata_cart({ itemid: itemId, product_count: newCount })).unwrap();
     dispatch(get_all_cart());
  };
  const removeItem =async (id) => {
 await  dispatch(delete_cart(id)).unwrap();
    dispatch(get_all_cart());
  };

  const handleClearCart =async () => {
   await dispatch(delete_all_cart()).unwrap();
    dispatch(get_all_cart());

  };
//update couantity
  const handleApplyCoupon = async(e) => {
     e.preventDefault();
      let res=await dispatch(applayCoupon({coupon:couponCode}))
      dispatch(get_all_cart())
  };
  if (loading.when_getall) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50/50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }
  return (
    <div className=" bg-slate-50/50 px-4 py-8 text-slate-800 sm:px-6 lg:px-8" dir="ltr">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between border-b border-slate-200 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-sm">
              <ShoppingBag size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">Shopping Cart</h1>
              <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">You have <span className=' capitalize text-blue-900 text-3xl inline'>{totalItemsCount}</span> items in your cart</p>
            </div>
          </div>

          {items.length > 0 && (
            <button
              onClick={handleClearCart}
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 active:scale-95"
            >
              <Trash2 size={16} />
              <span>Clear Cart</span>
            </button>
          )}
        </div>

        {items.length === 0 ? (
          /* Empty State */
          <div className="my-12 flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="relative mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
              <ShoppingBag size={40} className="stroke-1" />
              <Sparkles size={18} className="absolute right-2 top-2 animate-pulse text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Your cart is empty</h3>
            <p className="mt-1 max-w-sm text-sm text-slate-400">Looks like you haven't added anything to your cart yet. Discover our latest collections!</p>
            <a
              href="/products"
              className="mt-6 flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 active:scale-95"
            >
              <span>Continue Shopping</span>
              <ArrowRight size={18} />
            </a>
          </div>
        ) : (
          /* Content Layout */
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
            {/* Cart Items List */}
            <div className="space-y-4 lg:col-span-8">
              {/* Free Shipping Progress */}
              <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-700 sm:text-sm">
                  <Truck size={18} className="text-indigo-600" />
                  {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                    <span className="flex items-center gap-1 font-bold text-emerald-600">
                      <CheckCircle2 size={16} /> Congratulations! You got FREE Shipping!
                    </span>
                  ) : (
                    <span>
                      Add <strong className="text-indigo-600">${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)}</strong> more for Free Shipping!
                    </span>
                  )}
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full bg-indigo-600 transition-all duration-500 ease-out" style={{ width: `${progressToFreeShipping}%` }} />
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-slate-100 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
                {items.map((item) => {
                  const product = item.product || {};
                  return (
                    <div key={item._id || product._id} className="flex flex-col items-center justify-between gap-4 p-4 transition hover:bg-slate-50/50 sm:flex-row sm:p-5">
                      {/* Image & Title */}
                      <div className="flex w-full items-center gap-4 sm:w-auto">
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
                          <img
                            src={product.img_cover_url}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">{product.category?.name || product.category || 'Product'}</span>
                          <h3 className="line-clamp-1 text-sm font-bold text-slate-900">{product.title || product.name}</h3>
                          {item.color && (
                            <p className="flex items-center gap-1 text-xs text-slate-500">
                              Color: <span className="inline-block h-3 w-3 rounded-full border border-slate-300" style={{ backgroundColor: item.color }} />
                            </p>
                          )}
                          <p className="text-xs font-semibold text-slate-500">${item.price} each</p>
                        </div>
                      </div>

                      {/* Quantity Controls & Total */}
                      <div className="flex w-full items-center justify-between gap-6 border-t border-slate-100 pt-2 sm:w-auto sm:justify-end sm:border-t-0 sm:pt-0">
                        {/* Counter */}
                        <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
                          <button
                            onClick={() => updateQuantity(item._id, "min",item.count)}
                            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 active:scale-90"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-slate-800">{item.count}</span>
                          <button
                            onClick={() => updateQuantity(item._id, "add",item.count)}
                            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 active:scale-90"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* Item Total Price */}
                        <div className="text-right">
                          <span className="text-base font-black text-slate-900">${(item.price * item.count).toFixed()}</span>
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() => removeItem(item._id)}
                          title="Remove item"
                          className="cursor-pointer rounded-xl p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-500 active:scale-90"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="space-y-4 lg:sticky lg:top-8 lg:col-span-4">
              <div className="space-y-5 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <h2 className="border-b border-slate-100 pb-3 text-lg font-bold text-slate-900">Order Summary</h2>

                {/* Promo Code Form */}
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder="Promo Code (Try SAVE10)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-3 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none disabled:bg-slate-100"
                    />
                    <Tag size={16} className="absolute left-3 text-slate-400" />
                  </div>
                  <button type="submit" disabled={!couponCode} className="w-full cursor-pointer rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:bg-slate-200" >
                    Applay
                  </button>
                  {error?.when_applaycoupon?.message==="coupon not active" && <p className="text-[11px] font-semibold text-rose-500">{error?.when_applaycoupon?.message}</p>}
                  {error?.when_applaycoupon?.message==="coupon is running --_--" && <p className="text-[11px] font-semibold text-green-500">{error?.when_applaycoupon?.message}</p>}
                </form>

                {/* Pricing Summary */}
                <div className="space-y-3 pt-2 text-xs sm:text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>price</span>
                    <span className="font-bold text-slate-800">${subtotal.toFixed(2)}</span>
                  </div>

                  {cart?.totalpriceafterdiscount && (
                    <div className="flex justify-between font-medium text-emerald-600">
                      <span>Discount </span>
                      <span className="font-bold">-${cart?.totalprice-cart?.totalpriceafterdiscount}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-600">
                    <span>Shipping Fee</span>
                    <span className="font-bold text-slate-800">{shippingFee === 0 ? <span className="text-emerald-600">Free</span> : `$${shippingFee}`}</span>
                  </div>

                  <div className="flex items-baseline justify-between border-t border-slate-100 pt-3">
                    <span className="text-base font-bold text-slate-900">Total</span>
                    <span className="text-2xl font-black text-indigo-600">${cart.totalpriceafterdiscount||cart?.totalprice?.toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link to={'pay'} className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 active:scale-95">
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={18} />
                </Link>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 pt-2 text-[11px] font-medium text-slate-400">
                  <ShieldCheck size={16} className="text-emerald-500" />
                  <span>100% Secure & Encrypted Checkout</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
