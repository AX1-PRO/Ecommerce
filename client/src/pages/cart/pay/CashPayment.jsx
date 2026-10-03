import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { MapPin, CreditCard, Banknote, Plus, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { createOrderCash,get_checkout_strip } from '../../../store/order/order_api.js';
import { get_all_cart } from '../../../store/Cart/cart_api.js';
const CheckoutPage = ({ onCompleteOrder }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth_slice || {});
  const { cart } = useSelector((state) => state.cart_slice || {});
  // Payment method
  const [paymentMethod, setPaymentMethod] = useState('cod');
  // Loading  طريقة دفع
  const [loadingCash, setLoadingCash] = useState(false);
  const [loadingCard, setLoadingCard] = useState(false);

  // =========================
  // Check Address
  // =========================
  const hasAddress = user?.address && Object.values(user.address).length > 0 && Object.values(user.address).every((value) => value !== '' && value !== null && value !== undefined);

  // =========================
  // Cash On Delivery
  // =========================
  const handleCashOrder = async () => {
    if (!hasAddress || loadingCash || loadingCard) return;

    try {
      setLoadingCash(true);

      const res = await dispatch(createOrderCash(cart?._id));

      if (res.payload?.message === 'order is Done') {
        // تحديث السلة
        await dispatch(get_all_cart());
        // لو عندك onCompleteOrder
        if (onCompleteOrder) {
          onCompleteOrder();
        }
        // الانتقال بعد نجاح الطلب
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        console.log('Order failed:', res.payload);
      }
    } catch (error) {
      console.log('Cash order error:', error);
    } finally {
      setLoadingCash(false);
    }
  };

  // =========================
  // Card Payment
  // =========================
  const handelcheckouttocart = async () => {
    if (!hasAddress || loadingCash || loadingCard) return;

    try {
      setLoadingCard(true);
      console.log('Start Stripe Checkout');
      let res=await dispatch(get_checkout_strip(cart?._id))
        window.location.href = res.payload.url;

    } catch (error) {
      console.log('Card payment error:', error);
    } finally {
      setLoadingCard(false);
    }
  };

  // =========================
  // Main Button
  // =========================
  const handleCheckout = () => {
    if (paymentMethod === 'cod') {
      handleCashOrder();
    } else {
      handelcheckouttocart();
    }
  };

  // Loading الحالي
  const isLoading = loadingCash || loadingCard;

  return (
    <div className="bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* =========================
            Checkout Title
        ========================= */}
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Checkout</h1>

        {/* =========================
            Step 1: Address
        ========================= */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-indigo-600" />

              <h2 className="text-lg font-semibold text-gray-900">Shipping Address</h2>
            </div>

            {hasAddress && (
              <Link to="/profile/LocationEdit" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                Edit
              </Link>
            )}
          </div>

          {hasAddress ? (
            <div className="relative rounded-lg border-2 border-indigo-600 bg-indigo-50/30 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{user?.address?.country}</p>
                  <p className="mt-1 text-sm text-gray-600">{user?.address?.governorate}</p>
                  <p className="text-sm text-gray-600">
                    {user?.address?.district}, {user?.address?.village}
                  </p>
                  <p className="text-sm text-gray-600">
                    {user?.address?.street} {user?.address?.apartment}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">{user?.address?.phone}</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-600">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Selected
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-gray-200 px-4 py-6 text-center">
              <p className="mb-4 text-sm text-gray-500">No shipping address found for your account.</p>

              <Link to="/profile/LocationEdit" className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700">
                <Plus className="h-4 w-4" />
                Add Address
              </Link>
            </div>
          )}
        </div>

        {/* =========================
            Step 2: Payment
        ========================= */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-indigo-600" />

            <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* =========================
                Cash
            ========================= */}
            <label
              className={`flex cursor-pointer items-start gap-3 rounded-lg border-2 p-4 transition-all ${
                paymentMethod === 'cod' ? 'border-indigo-600 bg-indigo-50/20' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
                disabled={isLoading}
                className="mt-1 text-indigo-600 focus:ring-indigo-500"
              />

              <div>
                <div className="flex items-center gap-2 font-medium text-gray-900">
                  <Banknote className="h-4 w-4 text-gray-600" />
                  Cash on Delivery
                </div>

                <p className="mt-1 text-xs text-gray-500">Pay with cash when your package arrives.</p>
              </div>
            </label>

            {/* =========================
                Card
            ========================= */}
            <label
              className={`flex cursor-pointer items-start gap-3 rounded-lg border-2 p-4 transition-all ${
                paymentMethod === 'card' ? 'border-indigo-600 bg-indigo-50/20' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={() => setPaymentMethod('card')}
                disabled={isLoading}
                className="mt-1 text-indigo-600 focus:ring-indigo-500"
              />

              <div>
                <div className="flex items-center gap-2 font-medium text-gray-900">
                  <CreditCard className="h-4 w-4 text-gray-600" />
                  Credit / Debit Card
                </div>

                <p className="mt-1 text-xs text-gray-500">Pay securely online via card.</p>
              </div>
            </label>
          </div>
        </div>

        {/* =========================
            Step 3: Total
        ========================= */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
            <span className="text-lg font-semibold text-gray-700">Total</span>

            <span className="text-3xl font-bold text-gray-900">${cart?.totalpriceafterdiscount || cart?.totalprice || 0}</span>
          </div>

          {/* =========================
              Confirm Button
          ========================= */}
          <button
            type="button"
            disabled={!hasAddress || isLoading}
            onClick={handleCheckout}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3.5 text-base font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {/* Cash Loading */}
            {loadingCash ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                Processing Cash Order...
              </>
            ) : loadingCard ? (
              /* Card Loading */
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                Redirecting to Payment...
              </>
            ) : paymentMethod === 'cod' ? (
              /* Cash Button */
              <>
                Complete Order
                <CheckCircle2 className="h-5 w-5" />
              </>
            ) : (
              /* Card Button */
              <>
                Continue to Payment
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>

          {/* Security */}
          <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-500">
            <ShieldCheck className="h-4 w-4 text-gray-400" />

            <span>Encrypted & Secure Payment</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
