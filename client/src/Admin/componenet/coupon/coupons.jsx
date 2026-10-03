import React, { useEffect, useState } from 'react';
import { Search, Edit2, Trash2, Tag, Calendar, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getCoupons, deleteCoupon, updataCoupon, createCoupon } from '../../../store/coupon/couponApi';
export default function CouponsAdmin() {
  const dispatch = useDispatch();
  const { coupons, loading, result } = useSelector((state) => state.sliceCoupon);
  // =========================
  // GET ALL COUPONS
  // =========================
  useEffect(() => {
    dispatch(getCoupons());
  }, [dispatch]);
  // =========================
  // SEARCH & FILTER
  // ========================
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  // =========================
  // MODALS
  // =========================
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [couponToDelete, setCouponToDelete] = useState(null);
  // =========================
  // FORM
  // =========================
  const initialFormState = {
    name: '',
    discount: '',
    expier: ''
  };
  const [formData, setFormData] = useState(initialFormState);

  // =========================
  // SUCCESS / ERROR MESSAGE
  // ========================
  const [message, setMessage] = useState(null);
  // =========================
  // OPEN CREATE MODAL
  // =========================
  const handleOpenCreateModal = () => {
    setEditingCoupon(null);
    setFormData(initialFormState);
    setIsFormModalOpen(true);
  };
  // =========================
  // OPEN EDIT MODAL
  // =========================
  const handleOpenEditModal = (coupon) => {
    setEditingCoupon(coupon);

    setFormData({
      name: coupon.name,
      discount: coupon.discount,
      expier: coupon.expier ? new Date(coupon.expier).toISOString().split('T')[0] : ''
    });

    setIsFormModalOpen(true);
  };

  // =========================
  // SUBMIT CREATE / UPDATE
  // =========================

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    try {
      if (editingCoupon) {
        // =========================
        // UPDATE
        // =========================

        await dispatch(
          updataCoupon({
            id: editingCoupon._id,
            data: {
              name: formData.name,
              discount: Number(formData.discount),
              expier: formData.expier
            }
          })
        ).unwrap();

        setMessage({
          type: 'success',
          text: 'Coupon updated successfully!'
        });

        await dispatch(getCoupons());
      } else {
        // =========================
        // CREATE
        // =========================

        await dispatch(
          createCoupon({
            name: formData.name,
            discount: Number(formData.discount),
            expier: formData.expier
          })
        ).unwrap();

        setMessage({
          type: 'success',
          text: 'Coupon created successfully!'
        });

        await dispatch(getCoupons());
      }
      // Reset
      setFormData(initialFormState);
      setEditingCoupon(null);
      setIsFormModalOpen(false);

      // Hide message after 3 seconds
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } catch (error) {
      console.error(error);

      setMessage({
        type: 'error',
        text: error?.message || 'Something went wrong!'
      });

      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  };
  // =========================
  // DELETE MODAL
  // =========================

  const handleOpenDeleteModal = (coupon) => {
    setCouponToDelete(coupon);
    setIsDeleteModalOpen(true);
  };

  // =========================
  // DELETE COUPON
  // =========================

  const confirmDelete = async () => {
    if (!couponToDelete) return;

    try {
      await dispatch(deleteCoupon(couponToDelete._id)).unwrap();

      setMessage({
        type: 'success',
        text: 'Coupon deleted successfully!'
      });

      await dispatch(getCoupons());

      setIsDeleteModalOpen(false);
      setCouponToDelete(null);

      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } catch (error) {
      console.error(error);

      setMessage({
        type: 'error',
        text: error?.message || 'Failed to delete coupon!'
      });

      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  };

  // =========================
  // CHECK EXPIRED
  // =========================

  const isExpired = (date) => {
    if (!date) return false;

    return new Date(date) < new Date();
  };

  // =========================
  // COUPON DATA
  // =========================

  const couponList = coupons?.data || [];

  // =========================
  // FILTER
  // =========================

  const filteredCoupons = couponList.filter((coupon) => {
    const matchesSearch = coupon.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const expired = isExpired(coupon.expier);

    const matchesStatus = filterStatus === 'all' || (filterStatus === 'active' && !expired) || (filterStatus === 'expired' && expired);

    return matchesSearch && matchesStatus;
  });

  // =========================
  // COUNTS
  // =========================

  const totalCoupons = couponList.length;

  const activeCoupons = couponList.filter((coupon) => !isExpired(coupon.expier)).length;

  const expiredCoupons = couponList.filter((coupon) => isExpired(coupon.expier)).length;

  // =========================
  // JSX
  // =========================

  return (
    <div className="bg-slate-50 p-6 text-left" dir="ltr">
      {/* ================= HEADER ================= */}

      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Coupons Management</h1>

          <p className="mt-1 text-sm text-slate-500">Create, edit, and track promotional discount codes</p>
        </div>

        <button onClick={handleOpenCreateModal} className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700">
          + Create Coupon
        </button>
      </div>

      {/* ================= MESSAGE ================= */}

      {message && (
        <div
          className={`mb-6 flex items-center gap-3 rounded-xl border p-4 text-sm ${
            message.type === 'success' ? 'border-emerald-100 bg-emerald-50 text-emerald-700' : 'border-red-100 bg-red-50 text-red-700'
          }`}
        >
          {message.type === 'success' ? <CheckCircle size={20} className="shrink-0" /> : <X size={20} className="shrink-0" />}

          <span>{message.text}</span>
        </div>
      )}

      {/* ================= STATS ================= */}

      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        {/* Total */}

        <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Coupons</p>

            <h3 className="mt-1 text-2xl font-bold text-slate-800">{totalCoupons}</h3>
          </div>

          <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
            <Tag size={24} />
          </div>
        </div>

        {/* Active */}

        <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div>
            <p className="text-sm font-medium text-slate-500">Active Coupons</p>

            <h3 className="mt-1 text-2xl font-bold text-slate-800">{activeCoupons}</h3>
          </div>

          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
            <CheckCircle size={24} />
          </div>
        </div>

        {/* Expired */}

        <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div>
            <p className="text-sm font-medium text-slate-500">Expired Coupons</p>

            <h3 className="mt-1 text-2xl font-bold text-slate-800">{expiredCoupons}</h3>
          </div>

          <div className="rounded-xl bg-rose-50 p-3 text-rose-600">
            <AlertTriangle size={24} />
          </div>
        </div>
      </div>

      {/* ================= SEARCH & FILTER ================= */}

      <div className="mb-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm md:flex-row">
        {/* Search */}

        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search coupon name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />

          <Search size={18} className="absolute left-3 top-2.5 text-slate-400" />
        </div>

        {/* Filters */}

        <div className="flex w-full gap-2 md:w-auto">
          {['all', 'active', 'expired'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                filterStatus === status ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* ================= TABLE ================= */}

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 font-medium text-slate-500">
              <tr>
                <th className="p-4">Coupon Name</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Expiration Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredCoupons.map((coupon) => {
                const expired = isExpired(coupon.expier);

                return (
                  <tr key={coupon._id} className="transition-colors hover:bg-slate-50/50">
                    {/* Name */}

                    <td className="p-4 font-mono font-bold text-indigo-600">
                      <span className="rounded-md border border-indigo-100 bg-indigo-50 px-2.5 py-1">{coupon.name}</span>
                    </td>
                    <td className="p-4 font-semibold text-slate-800">{coupon.discount}%</td>
                    <td className="p-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        <span>{coupon.expier ? new Date(coupon.expier).toLocaleDateString() : '-'}</span>
                      </div>
                    </td>

                    {/* Status */}

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                          expired ? 'border border-rose-100 bg-rose-50 text-rose-700' : 'border border-emerald-100 bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {expired ? 'Expired' : 'Active'}
                      </span>
                    </td>

                    {/* Actions */}

                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Edit */}

                        <button onClick={() => handleOpenEditModal(coupon)} className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600" title="Edit Coupon">
                          <Edit2 size={16} />
                        </button>

                        {/* Delete */}

                        <button onClick={() => handleOpenDeleteModal(coupon)} className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600" title="Delete Coupon">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Empty */}

          {filteredCoupons.length === 0 && <div className="py-12 text-center text-slate-400">No coupons found matching your criteria.</div>}
        </div>
      </div>

      {/* ================= CREATE / EDIT MODAL ================= */}

      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-xl">
            {/* Close */}

            <button onClick={() => setIsFormModalOpen(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600">
              <X size={18} />
            </button>

            <h2 className="mb-4 text-lg font-bold text-slate-800">{editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}</h2>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              {/* Coupon Name */}

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Coupon Name / Code</label>

                <input
                  type="text"
                  required
                  placeholder="e.g"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value.toUpperCase()
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Discount */}

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Discount Value (%)</label>

                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  placeholder="20"
                  value={formData.discount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discount: e.target.value
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Expiration */}

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Expiration Date</label>

                <input
                  type="date"
                  required
                  value={formData.expier}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      expier: e.target.value
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Buttons */}

              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading.create || loading.update}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading.create || loading.update ? 'Saving...' : editingCoupon ? 'Save Changes' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= DELETE MODAL ================= */}

      {isDeleteModalOpen && couponToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-xl">
            {/* Icon */}

            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
              <AlertTriangle size={24} />
            </div>

            <h3 className="text-lg font-bold text-slate-800">Delete Coupon?</h3>

            <p className="mt-2 text-sm text-slate-500">
              Are you sure you want to delete <span className="font-mono font-semibold text-slate-800">{couponToDelete.name}</span>? This action cannot be undone.
            </p>

            {/* Buttons */}

            <div className="mt-6 flex items-center justify-center gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="w-full rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50">
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                disabled={loading.delete}
                className="w-full rounded-xl bg-rose-600 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading.delete ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
