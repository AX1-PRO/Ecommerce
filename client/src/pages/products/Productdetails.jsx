import { useEffect, useState } from 'react';
import { useParams, useNavigate,Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, Heart, Minus, Plus, Star, ArrowLeft, ShieldCheck, Truck, RotateCcw, Check } from 'lucide-react';
import { create_cart,get_all_cart} from "../../store/Cart/cart_api"
import { one_product } from '../../store/Product/Product_api';
import { create_fav } from '../../store/favorits/favorits_api';
import { getMe } from '../../store/auth/atuh.api';
import Reviews from './component/Review&comment';
export default function ProductDetails() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth_slice);
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading_product } = useSelector((state) => state.product_slice || {});
  const [image, setImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');

  // Fetch product data
  useEffect(() => {
    if (id) {
      dispatch(one_product(id));
    }
  }, [id, dispatch]);

  // Handle active image & default color selection
  useEffect(() => {
    if (product) {
      setImage(product.img_cover_url);

      const colors = product?.colors?.[0] ? product.colors[0].split(',') : [];
      if (colors.length > 0) {
        setSelectedColor(colors[0].trim());
      }
    }
  }, [product]);
  const colorProduct = product?.colors?.[0] ? product.colors[0].split(',').map((c) => c.trim()) : [];
//handel create fav
let handeladdtofav=async(id)=>{
  await dispatch(create_fav(id))
  await dispatch(getMe())
}
  // Calculate pricing based on `discount`
  const originalPrice = product?.price || 0;
  const discountAmount = product?.discount || 0;
  const finalPrice = Math.max(0, originalPrice - discountAmount);
  const discountPercentage = discountAmount > 0 ? Math.round((discountAmount / originalPrice) * 100) : 0;

  const totalPrice = (finalPrice * quantity).toFixed(2);
 //add to cart
 let handel_add_to_cart=async(productid)=>{
 await dispatch(create_cart({productid,color:selectedColor,count:quantity}))
 await dispatch(get_all_cart())
 }
  // 1. SKELETON LOADING STATE
  if (loading_product?.when_gotone) {
    return (
      <div className="min-h-screen bg-slate-50/50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 h-10 w-28 animate-pulse rounded-xl bg-slate-200" />
          <div className="grid grid-cols-1 gap-10 rounded-3xl bg-white p-6 shadow-sm lg:grid-cols-2 lg:p-10">
            <div className="space-y-4">
              <div className="h-[350px] w-full animate-pulse rounded-2xl bg-slate-200 sm:h-[450px]" />
              <div className="flex gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-20 w-20 animate-pulse rounded-xl bg-slate-200" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 w-3/4 animate-pulse rounded-lg bg-slate-200" />
              <div className="h-6 w-1/3 animate-pulse rounded-lg bg-slate-200" />
              <div className="h-10 w-1/2 animate-pulse rounded-lg bg-slate-200" />
              <div className="h-20 w-full animate-pulse rounded-lg bg-slate-200" />
              <div className="h-12 w-full animate-pulse rounded-xl bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. NOT FOUND STATE
  if (!product) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
        <p className="mt-2 text-sm text-slate-500">The product you are looking for does not exist or has been removed.</p>
        <button onClick={() => navigate('/products')} className="mt-6 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700">
          Back to Products
        </button>
      </div>
    );
  }

  const images = [product.img_cover_url, ...(product.imgs_url || [])].filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 text-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation / Back Button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 active:scale-95"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>

        {/* MAIN PRODUCT DISPLAY */}
        <div className="grid grid-cols-1 gap-10 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm lg:grid-cols-2 lg:p-10">
          {/* LEFT: GALLERY AREA */}
          <div className="flex flex-col">
            <div className="relative flex h-[350px] w-full items-center justify-center overflow-hidden rounded-2xl bg-slate-50 p-4 sm:h-[450px] lg:h-[500px]">
              <img src={image || '/empty.png'} alt={product.name} className="max-h-full max-w-full object-contain transition-transform duration-500 hover:scale-105" />

              {/* Discount Tag */}
              {discountPercentage > 0 && (
                <span className="absolute left-4 top-4 rounded-xl bg-rose-500 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-md">{discountPercentage}% OFF</span>
              )}
            </div>

            {/* Thumbnail Carousel */}
            {images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setImage(img)}
                    className={`relative shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                      image === img ? 'border-indigo-600 ring-2 ring-indigo-100' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="h-16 w-16 object-cover sm:h-20 sm:w-20" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: INFO AREA */}
          <div className="flex flex-col">
            {/* Title */}
            <h1 className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl lg:text-4xl">{product.name}</h1>

            {/* Rating & Sold */}
            <div className="mt-3 flex items-center gap-4">
              <div className="flex items-center gap-1.5 rounded-lg border border-amber-200/60 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                <span>{product.rating || '4.5'}</span>
              </div>
              <span className="text-xs font-medium text-slate-400">•</span>
              <span className="text-xs font-medium text-slate-500">{product.count_rating || 0} Reviews</span>
              <span className="text-xs font-medium text-slate-400">•</span>
              <span className="text-xs font-medium text-slate-500">{product?.sold_count || 0} Sold</span>
            </div>

            {/* Pricing Section (Updated to `discount`) */}
            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-slate-900 sm:text-4xl">${finalPrice.toFixed(2)}</span>

              {discountAmount > 0 && <span className="text-lg font-medium text-slate-400 line-through">${originalPrice.toFixed(2)}</span>}
            </div>

            {/* Description Short */}
            <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-slate-600 sm:text-base">{product.description}</p>

            <hr className="my-6 border-slate-100" />

            {/* Color Selection */}
            {colorProduct.length > 0 && (
              <div className="mb-6">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Select Color</span>
                  <span className="text-xs font-semibold capitalize text-slate-700">{selectedColor}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {colorProduct.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                      style={{ backgroundColor: color }}
                      className={`relative flex h-9 w-9 items-center justify-center rounded-full border-2 shadow-sm transition-transform hover:scale-110 ${
                        selectedColor === color ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-white'
                      }`}
                    >
                      {selectedColor === color && <Check size={14} className={color.toLowerCase() === 'white' || color.toLowerCase() === '#ffffff' ? 'text-black' : 'text-white'} />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Total Price */}
            <div className="mb-6 space-y-3">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">Quantity</span>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/50 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-white hover:shadow-sm"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-slate-800">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-white hover:shadow-sm">
                    <Plus size={16} />
                  </button>
                </div>

                <div className="text-right">
                  <span className="block text-xs font-medium text-slate-400">Subtotal</span>
                  <span className="text-xl font-bold text-indigo-600">${totalPrice}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {
                user?( <button
                disabled={product.count <= 0}
                onClick={()=>{handel_add_to_cart(product._id)}}
                className="active:scale-98 flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-600 disabled:bg-slate-300"
              >
                <ShoppingCart size={18} />
                <span>{product.count > 0 ? 'Add To Cart' : 'Out of Stock'}</span>
              </button>):( <Link to={'/Login'}
                className="active:scale-98 flex cursor-not-allowed flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-600 disabled:bg-slate-300"
              >
                <ShoppingCart size={18} />
                <span>Add To Cart</span>
              </Link>)
              }

               {
                user?(<button onClick={()=>{handeladdtofav(product._id)}} className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500 active:scale-95">
                <Heart size={20} />
              </button>):(<Link to={'/Login'} className="flex h-12 w-12 cursor-not-allowed items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500 active:scale-95">
                <Heart size={20} />
              </Link>)
               }

            </div>

            {/* Store Features / Trust Badges */}
            <div className="mt-8 grid grid-cols-3 gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex flex-col items-center text-center">
                <Truck size={20} className="mb-1 text-indigo-600" />
                <span className="text-[11px] font-semibold text-slate-700">Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center border-x border-slate-200 text-center">
                <ShieldCheck size={20} className="mb-1 text-indigo-600" />
                <span className="text-[11px] font-semibold text-slate-700">Original Guarantee</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <RotateCcw size={20} className="mb-1 text-indigo-600" />
                <span className="text-[11px] font-semibold text-slate-700">Free Returns</span>
              </div>
            </div>

            {/* Category & Brand Metadata */}
            <div className="mt-6 space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
              <p>
                Category: <strong className="font-semibold text-slate-800">{product.category?.name || 'N/A'}</strong>
              </p>
              <p>
                Brand: <strong className="font-semibold text-slate-800">{product?.brand?.name || 'N/A'}</strong>
              </p>
              <p>
                Stock Availability: <strong className="font-semibold text-emerald-600">{product.count || 0} units left</strong>
              </p>
            </div>
          </div>
        </div>

        {/* FULL DESCRIPTION TAB */}
        <div className="mt-10 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-4 text-lg font-bold text-slate-900 sm:text-xl">Product Specification & Description</h2>
          <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600 sm:text-base">{product.description}</p>
        </div>

        {/* REVIEWS SECTION */}
        <div className="mt-10 overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
          <Reviews review_count={product.count_rating} avg_review={product.avg_rating} reviews={product.reviews} product={product.id} />
        </div>
      </div>
    </div>
  );
}
