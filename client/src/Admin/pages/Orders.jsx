import React, { useEffect, useState } from 'react';
import { Package, Search, Filter, CheckCircle, Clock, Truck, DollarSign, Eye, User, MapPin, CreditCard, X, Trash2, AlertCircle } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { get_all_orders, delete_admin_order, update_order_ispay, update_order_isdelivary } from '../../store/order/order_api';

export default function AdminOrdersDashboard() {
  const dispatch = useDispatch();
  const { orders = [] } = useSelector((e) => e.order_slice || {});

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // حالة نافذة تأكيد الحذف
  const [orderToDelete, setOrderToDelete] = useState(null);

  useEffect(() => {
    dispatch(get_all_orders());
  }, [dispatch]);

  // تبديل حالة الدفع)
  const handleTogglePay = (id) => {
    dispatch(update_order_ispay(id));
    dispatch(get_all_orders())
  };

  // تبديل حالة التوصيل )
  const handleToggleDelivery = (id) => {
    dispatch(update_order_isdelivary(id));
    dispatch(get_all_orders())
  };

  // تأكيد وتنفيذ الحذف
  const confirmDeleteOrder = async () => {
    if (orderToDelete) {
      await dispatch(delete_admin_order(orderToDelete));
      await dispatch(get_all_orders())
      setOrderToDelete(null);
    }
  };

  // تصفية الطلبات
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterStatus === 'paid') return order.ispay;
    if (filterStatus === 'unpaid') return !order.ispay;
    if (filterStatus === 'delivered') return order.isdelivary;
    if (filterStatus === 'pending_delivery') return !order.isdelivary;
    return true;
  });

  const totalRevenue = orders.reduce((sum, o) => (o.ispay ? sum + (o.totalorderprice || 0) : sum), 0);
  const pendingDeliveries = orders.filter((o) => !o.isdelivary).length;
  const pendingPayments = orders.filter((o) => !o.ispay).length;

  return (
    <div className=" bg-gray-50 p-4 font-sans md:p-8" dir="ltr">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
              <Package className="h-7 w-7 text-indigo-600" />
              Admin Orders Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500">Manage orders, update payment & delivery statuses, and view customer details.</p>
          </div>
        </div>

        {/* Analytics Summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-gray-500">Total Orders</span>
              <Package className="h-5 w-5 text-indigo-600" />
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900">{orders.length}</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-gray-500">Total Revenue</span>
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="mt-2 text-2xl font-bold text-emerald-600">${totalRevenue}</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-gray-500">Pending Delivery</span>
              <Truck className="h-5 w-5 text-amber-500" />
            </div>
            <p className="mt-2 text-2xl font-bold text-amber-600">{pendingDeliveries}</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-gray-500">Pending Payment</span>
              <Clock className="h-5 w-5 text-rose-500" />
            </div>
            <p className="mt-2 text-2xl font-bold text-rose-600">{pendingPayments}</p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Order ID, customer name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            <Filter className="mr-1 hidden h-4 w-4 text-gray-500 sm:block" />
            {[
              { id: 'all', label: 'All Orders' },
              { id: 'unpaid', label: 'Unpaid' },
              { id: 'paid', label: 'Paid' },
              { id: 'pending_delivery', label: 'In Transit' },
              { id: 'delivered', label: 'Delivered' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  filterStatus === tab.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-700">
                <tr>
                  <th className="px-6 py-3">Order ID</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Payment Method</th>
                  <th className="px-6 py-3">Total Amount</th>
                  <th className="px-6 py-3">Payment Status</th>
                  <th className="px-6 py-3">Delivery Status</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-gray-500">
                      No matching orders found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order._id} className="transition-colors hover:bg-gray-50">
                      <td className="px-6 py-4 font-mono text-xs font-semibold text-gray-900">
                        #{order._id?.substring(order._id.length - 8)}
                        <span className="mt-0.5 block font-sans text-[10px] text-gray-400">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{order.user?.name || 'Guest User'}</div>
                        <div className="text-xs text-gray-400">{order.user?.email}</div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium uppercase text-gray-700">
                          <CreditCard className="h-3.5 w-3.5" />
                          {order.paymentMethod || 'cash'}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-bold text-gray-900">
                        ${order.totalorderprice}
                        <span className="block text-[10px] font-normal text-gray-400">(Taxes: ${order.taxies || 100})</span>
                      </td>

                      {/* Pay Status Toggle */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleTogglePay(order._id)}
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                            order.ispay ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                          }`}
                          title="Click to toggle payment status"
                        >
                          {order.ispay ? <CheckCircle className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                          {order.ispay ? 'Paid' : 'Unpaid'}
                        </button>
                      </td>

                      {/* Delivery Status Toggle */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleDelivery(order._id)}
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                            order.isdelivary ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          }`}
                          title="Click to toggle delivery status"
                        >
                          <Truck className="h-3.5 w-3.5" />
                          {order.isdelivary ? 'Delivered' : 'In Transit'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => setSelectedOrder(order)} className="rounded-lg p-1.5 text-gray-600 transition-colors hover:bg-indigo-50 hover:text-indigo-600" title="View Details">
                            <Eye className="h-5 w-5" />
                          </button>
                          <button onClick={() => setOrderToDelete(order._id)} className="rounded-lg p-1.5 text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600" title="Delete Order">
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {orderToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="h-6 w-6" />
              <h3 className="text-lg font-bold text-gray-900">Confirm Order Deletion</h3>
            </div>
            <p className="mt-3 text-sm text-gray-600">Are you sure you want to delete this order? This action cannot be undone.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setOrderToDelete(null)} className="rounded-lg bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200">
                Cancel
              </button>
              <button onClick={confirmDeleteOrder} className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700">
                Delete Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Order Overview</h3>
                <p className="font-mono text-xs text-gray-400">ID: {selectedOrder._id}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-6 space-y-6">
              {/* User & Address Info */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-800">
                    <User className="h-4 w-4 text-indigo-600" />
                    Customer Details
                  </h4>
                  <div className="space-y-1.5 text-xs text-gray-600">
                    <p>
                      <span className="font-semibold text-gray-800">Name:</span> {selectedOrder.user?.name || 'N/A'}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-800">Email:</span> {selectedOrder.user?.email || 'N/A'}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-800">Phone:</span> {selectedOrder.user?.phone || selectedOrder.address?.phone || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-800">
                    <MapPin className="h-4 w-4 text-indigo-600" />
                    Delivery Address
                  </h4>
                  <div className="space-y-1.5 text-xs text-gray-600">
                    <p>
                      <span className="font-semibold text-gray-800">City:</span> {selectedOrder.address?.city || 'N/A'}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-800">Street Details:</span> {selectedOrder.address?.details || 'N/A'}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-800">Postal Location:</span> {selectedOrder.address?.postlocation || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cart Items */}
              <div>
                <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-800">
                  <Package className="h-4 w-4 text-indigo-600" />
                  Cart Items
                </h4>
                <div className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200">
                  {selectedOrder.cartitems?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white p-3 hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product?.imageCover || item.product?.img_cover_url || 'https://via.placeholder.com/60'}
                          alt={item.product?.title || 'Product'}
                          className="h-12 w-12 rounded-lg border object-cover"
                        />
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{item.product?.title || 'Product Item'}</p>
                          <p className="text-xs text-gray-500">
                            Color: <span className="font-medium text-gray-700">{item.color || 'N/A'}</span> | Quantity: <span className="font-medium text-gray-700">{item.count}</span>
                          </p>
                        </div>
                      </div>
                      <div className="text-right text-sm font-bold text-gray-900">
                        ${item.price * item.count}
                        <span className="block text-[10px] font-normal text-gray-400">
                          (${item.price} x {item.count})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Taxes & Shipping:</span>
                  <span className="font-semibold text-gray-800">${selectedOrder.taxies || 100}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2 text-sm font-bold text-gray-900">
                  <span>Total Amount:</span>
                  <span className="text-base text-indigo-600">${selectedOrder.totalorderprice}</span>
                </div>

                <div className="grid grid-cols-1 gap-2 border-t border-gray-200 pt-3 text-[11px] text-gray-500 sm:grid-cols-2">
                  <div>
                    <span className="font-semibold text-gray-700">Paid At: </span>
                    {selectedOrder.payat ? new Date(selectedOrder.payat).toLocaleString() : 'Not Paid'}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Delivered At: </span>
                    {selectedOrder.delivaryat ? new Date(selectedOrder.delivaryat).toLocaleString() : 'Not Delivered'}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end border-t border-gray-100 pt-4">
              <button onClick={() => setSelectedOrder(null)} className="rounded-lg bg-gray-200 px-5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-300">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
