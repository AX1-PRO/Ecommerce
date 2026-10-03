import React, { useEffect, useState } from 'react';
import { CheckCircle2, Package, Truck, MapPin, Clock, XCircle } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { get_user_orders, delete_user_order } from '../../store/order/order_api.js';

export default function OrderTracking() {
  const dispatch = useDispatch();
  const { orders = [], loading_order, error_order } = useSelector((state) => state.order_slice || {});
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // =========================
  // Get Orders
  // =========================
  useEffect(() => {
    dispatch(get_user_orders());
  }, [dispatch]);

  useEffect(() => {
    if (orders?.length > 0 && !selectedOrderId) {
      setSelectedOrderId(orders[0]._id);
    }
  }, [orders, selectedOrderId]);

  // =========================
  // Selected Order
  // =========================
  const selectedOrder = orders?.find((order) => order._id === selectedOrderId) || orders[0];

  // =========================
  // Handlers
  // =========================
  const handeldeleteorder = async (idorder) => {
    const result = await dispatch(delete_user_order(idorder));

    if (delete_user_order.fulfilled.match(result)) {
      dispatch(get_user_orders());
      if (selectedOrderId === idorder) {
        setSelectedOrderId(null);
      }
    }
  };

  // =========================
  // Loading
  // =========================
  if (loading_order?.when_get_user_orders) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100" dir="ltr">
        <div className="text-center">
          <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-green-600"></div>
          <p className="text-sm text-gray-500">Loading orders...</p>
        </div>
      </div>
    );
  }

  // =========================
  // No Orders
  // =========================
  if (!orders?.length) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4" dir="ltr">
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
          <Package className="mx-auto mb-3 h-12 w-12 text-gray-400" />
          <h2 className="text-lg font-bold text-gray-800">No Orders Found</h2>
          <p className="mt-1 text-sm text-gray-500">You don't have any orders yet.</p>
        </div>
      </div>
    );
  }

  // =========================
  // Safety
  // =========================
  if (!selectedOrder) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100" dir="ltr">
        <p className="text-gray-500">Loading order...</p>
      </div>
    );
  }

  // =========================
  // Order Status
  // =========================
  const steps = [
    {
      id: 1,
      title: 'Ordered',
      date: selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : '',
      completed: true
    },
    {
      id: 2,
      title: 'Paid',
      date: selectedOrder.ispay ? 'Payment completed' : 'Payment pending',
      completed: !!selectedOrder.ispay,
      current: !selectedOrder.ispay
    },
    {
      id: 3,
      title: 'Out for delivery',
      date: selectedOrder.isdelivary ? 'Order delivered' : 'Waiting for delivery',
      completed: !!selectedOrder.isdelivary,
      current: selectedOrder.ispay && !selectedOrder.isdelivary
    },
    {
      id: 4,
      title: 'Delivered',
      date: selectedOrder.isdelivary ? 'Delivered successfully' : 'Not delivered yet',
      completed: !!selectedOrder.isdelivary
    }
  ];

  // =========================
  // Progress
  // =========================
  const completedSteps = steps.filter((step) => step.completed).length;
  const progress = ((completedSteps - 1) / (steps.length - 1)) * 100;

  // =========================
  // Address
  // =========================
  const address = selectedOrder.user?.address || selectedOrder.shippingAddress || selectedOrder.address || {};

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans md:p-8" dir="ltr">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Order Selector */}
        {orders?.length > 1 && (
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Your Orders</h2>
            <div className="flex flex-wrap gap-2">
              {orders.map((orderItem, index) => (
                <button
                  key={orderItem._id}
                  onClick={() => setSelectedOrderId(orderItem._id)}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                    selectedOrderId === orderItem._id ? 'border-amber-500 bg-amber-500 text-white shadow-sm' : 'border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Order #{index + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Header */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4 border-b pb-4">
            <div>
              <span className="block text-xs text-gray-500">Order ID</span>
              <h1 className="break-all text-xl font-bold text-gray-800">#{selectedOrder._id}</h1>
            </div>

            <div className="flex items-center gap-3 text-sm">
              {!selectedOrder.isdelivary && (
                <button
                  onClick={() => handeldeleteorder(selectedOrder._id)}
                  className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
                >
                  <XCircle className="h-4 w-4" />
                  Cancel Order
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm text-gray-600">
                Order Placed: <span className="font-semibold text-gray-800">{selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : 'N/A'}</span>
              </p>
              <p className="mt-1 text-lg font-bold text-green-700">Total: ${selectedOrder.totalorderprice || selectedOrder.totalOrderPrice || 0}</p>
            </div>

            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last update: {selectedOrder.updatedAt ? new Date(selectedOrder.updatedAt).toLocaleString() : 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-wider text-gray-500">Payment Method</p>
            <p className="mt-2 text-sm font-bold text-gray-800">{selectedOrder.paymentMethod || 'COD'}</p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-wider text-gray-500">Payment Status</p>
            <p className={`mt-2 text-sm font-bold ${selectedOrder.ispay ? 'text-green-600' : 'text-orange-500'}`}>{selectedOrder.ispay ? 'Paid' : 'Pending'}</p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-wider text-gray-500">Delivery Status</p>
            <p className={`mt-2 text-sm font-bold ${selectedOrder.isdelivary ? 'text-green-600' : 'text-orange-500'}`}>{selectedOrder.isdelivary ? 'Delivered' : 'Not Delivered'}</p>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-8 text-lg font-bold text-gray-800">Shipment Status</h2>

          <div className="relative flex w-full flex-col items-start justify-between gap-8 md:flex-row md:items-center md:gap-0">
            <div className="absolute left-0 right-0 top-1/2 z-0 hidden h-1 -translate-y-1/2 bg-gray-200 md:block">
              <div className="h-full bg-green-600 transition-all duration-500" style={{ width: `${Math.max(0, progress)}%` }} />
            </div>

            {steps.map((step) => (
              <div key={step.id} className="relative z-10 flex w-full items-center gap-4 md:w-auto md:flex-col md:gap-2">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                    step.completed
                      ? 'border-green-600 bg-green-600 text-white'
                      : step.current
                        ? 'border-green-600 bg-white text-green-600 ring-4 ring-green-100'
                        : 'border-gray-300 bg-white text-gray-400'
                  }`}
                >
                  {step.completed ? <CheckCircle2 className="h-6 w-6" /> : <span className="text-sm font-semibold">{step.id}</span>}
                </div>

                <div className="text-left md:text-center">
                  <p className={`text-sm font-bold ${step.completed || step.current ? 'text-gray-900' : 'text-gray-400'}`}>{step.title}</p>
                  <p className="mt-0.5 text-xs text-gray-500">{step.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Details & Items */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Products */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:col-span-2">
            <h3 className="text-md mb-4 flex items-center gap-2 font-bold text-gray-800">
              <Package className="h-5 w-5 text-gray-600" />
              Items in this Shipment ({selectedOrder.cartitems?.length || selectedOrder.cartItems?.length || 0})
            </h3>

            <div className="divide-y divide-gray-100">
              {(selectedOrder.cartitems || selectedOrder.cartItems || []).map((item) => (
                <div key={item._id || item.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  <img
                    src={item.product?.img_cover_url || item.product?.imageCover}
                    alt={item.product?.name || item.product?.title}
                    className="h-20 w-20 rounded-md border border-gray-100 object-cover"
                  />

                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-800">{item.product?.name || item.product?.title}</h4>
                    <p className="mt-1 text-xs text-gray-500">
                      Qty: {item.count || item.quantity} {item.color && `| Color: ${item.color}`}
                    </p>
                    <p className="mt-2 text-sm font-bold text-gray-900">${item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping & Address */}
          <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div>
              <h3 className="text-md mb-2 flex items-center gap-2 font-bold text-gray-800">
                <MapPin className="h-5 w-5 text-gray-600" />
                Delivery Address
              </h3>

              <p className="text-sm font-semibold text-gray-700">{selectedOrder.user?.name || address.name}</p>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {address.country && (
                  <>
                    {address.country}
                    <br />
                  </>
                )}
                {address.governorate && (
                  <>
                    {address.governorate}
                    <br />
                  </>
                )}
                {address.district && (
                  <>
                    {address.district}
                    <br />
                  </>
                )}
                {address.village && (
                  <>
                    {address.village}
                    <br />
                  </>
                )}
                {address.street && (
                  <>
                    {address.street}
                    <br />
                  </>
                )}
                {address.apartment}
              </p>

              <p className="mt-2 text-sm text-gray-600">Phone: {address.phone || selectedOrder.user?.phone || 'N/A'}</p>
            </div>

            <hr className="border-gray-100" />

            <div>
              <h3 className="text-md mb-2 flex items-center gap-2 font-bold text-gray-800">
                <Truck className="h-5 w-5 text-gray-600" />
                Delivery
              </h3>
              <p className="text-sm font-medium text-gray-700">{selectedOrder.isdelivary ? 'Delivered' : 'Preparing for delivery'}</p>
              <p className="mt-1 text-xs text-gray-500">Delivery fee: ${selectedOrder.taxies || 0}</p>
            </div>
          </div>
        </div>

        {/* User Information */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-gray-800">Customer Information</h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <p className="text-xs text-gray-500">Name</p>
              <p className="mt-1 text-sm font-semibold text-gray-800">{selectedOrder.user?.name || 'N/A'}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="mt-1 break-all text-sm font-semibold text-gray-800">{selectedOrder.user?.email || 'N/A'}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Phone</p>
              <p className="mt-1 text-sm font-semibold text-gray-800">0{selectedOrder.user?.phone || address.phone || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
