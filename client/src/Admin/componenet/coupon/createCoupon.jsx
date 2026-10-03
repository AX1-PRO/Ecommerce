import React, { useState } from 'react';
import { Tag, Calendar, Percent, ArrowLeft, CheckCircle2, X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { createCoupon } from '../../../store/coupon/couponApi';
export default function CreateCouponPage() {
  let dispatch = useDispatch();
  let { loading, result } = useSelector((el) => {
    return el.sliceCoupon;
  });
  const [formData, setFormData] = useState({
    name: '',
    discount: '',
    expier: ''
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'name' ? value.toUpperCase() : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(createCoupon(formData));
    setFormData({ name: '', discount: '', expier: '' });
  };
  return (
    <div className="bg-slate-50 p-6 text-left" dir="ltr">
      {/* Header & Back Button */}
      <div className="mx-auto mb-6 flex max-w-2xl items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Create Coupon</h1>
          <p className="mt-1 text-sm text-slate-500">Add a new discount coupon for your store</p>
        </div>
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 shadow-sm transition-all hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      {/* Main Form Card */}
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:p-8">
        {/* Success Alert */}
        {result?.create?.message === 'coupon created' ? (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-700">
            <CheckCircle2 size={20} className="shrink-0" />
            <span>Coupon created successfully!</span>
          </div>
        ) : result.create == null ? null : (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-red-700">
            <X size={20} className="shrink-0" />
            <span>Coupon created Faild!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Coupon Name / Code */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Coupon Name / Code <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. SUMMER2026"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 font-mono text-sm uppercase focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <Tag size={18} className="absolute left-3 top-3 text-slate-400" />
            </div>
            <p className="mt-1 text-xs text-slate-400">Customers will enter this exact code at checkout.</p>
          </div>

          {/* Discount Value */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Discount Percentage (%) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                name="discount"
                min="1"
                max="100"
                required
                placeholder="e.g. 20"
                value={formData.discount}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <Percent size={18} className="absolute left-3 top-3 text-slate-400" />
            </div>
          </div>

          {/* Expiration Date */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Expiration Date <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                name="expier"
                required
                value={formData.expier}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <Calendar size={18} className="absolute left-3 top-3 text-slate-400" />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading.create ? 'Creating...' : 'Create Coupon'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
