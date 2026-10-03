import { User, Mail, Phone, MapPin, Calendar, Edit, Lock, ShoppingBag, Shield, LogOut, CheckCircle2, Sparkles } from 'lucide-react';
import { useNavigate, Link, Outlet } from 'react-router';
import { Logout } from '../../store/auth/atuh.api';
import { useSelector,useDispatch } from 'react-redux';
import {get_user_orders} from "../../store/order/order_api.js"
import { useEffect } from 'react';
export default function Profile() {
  const { user, loading } = useSelector((state) => state.auth_slice || {});
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(get_user_orders())
  },[dispatch])
  let {orders}=useSelector((e)=>{return e.order_slice})
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await dispatch(Logout()).unwrap();
      navigate('/');
    } catch (err) {
      console.error('Logout Error:', err);
    }
  };
  // Skeleton Loading State
  if (loading.getme) {
    return (
      <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl animate-pulse space-y-6">
          <div className="h-64 rounded-3xl bg-slate-200" />
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="h-80 rounded-2xl bg-slate-200" />
            <div className="h-80 rounded-2xl bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-slate-50/50 px-4 py-8 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* ================= HEADER CARD ================= */}
        <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
          {/* Hero Cover Gradient */}
          <div className="relative h-44 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 sm:h-52">
            <div className="absolute inset-0 bg-black/10" />
          </div>

          <div className="px-6 pb-8 sm:px-8">
            {/* Avatar & Top Info */}
            <div className="-mt-16 flex flex-col items-center gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end">
                {/* Profile Image */}
                <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-md">
                  {user?.imageUrl ? (
                    <img src={user.imageUrl} alt={user?.name || 'User Profile'} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-indigo-100 text-3xl font-black text-indigo-600">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</div>
                  )}
                </div>

                {/* Name & Role */}
                <div className="text-center sm:text-left">
                  <div className="flex items-center justify-center gap-2 sm:justify-start">
                    <h1 className="text-2xl font-black text-slate-900 sm:text-xl sm:w-48 md:text-3xl md:w-auto">{user?.name || 'User'}</h1>
                    <Sparkles size={20} className="fill-amber-400 text-amber-500" />
                  </div>
                  <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-slate-500">{user?.role === 'admin' ? 'Administrator' : 'Customer Account'}</p>
                </div>
              </div>

              {/* Admin Button */}
              {user?.role === 'admin' && (
                <Link to="/admin" className="flex items-center gap-2 rounded-xl bg-slate-900 px-6  py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-600 active:scale-95">
                  <Shield size={16} />
                  <span>Admin Dashboard</span>
                </Link>
              )}
            </div>

            {/* Quick Stats Grid */}
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Link to={"OrderDetails"} className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition hover:border-indigo-100 hover:bg-white hover:shadow-sm">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <ShoppingBag size={20} />
                </div>
                <span className="text-xl font-bold text-slate-900">{orders?.length}</span>
                <span className="text-xs font-medium text-slate-500">Total Orders</span>
              </Link>

              <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition hover:border-emerald-100 hover:bg-white hover:shadow-sm">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={20} />
                </div>
                <span className="text-xl font-bold text-emerald-600">Active</span>
                <span className="text-xs font-medium text-slate-500">Account Status</span>
              </div>

              <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition hover:border-amber-100 hover:bg-white hover:shadow-sm">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Calendar size={20} />
                </div>
                <span className="text-sm font-bold text-slate-900">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
                <span className="text-xs font-medium text-slate-500">Member Since</span>
              </div>

              <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition hover:border-purple-100 hover:bg-white hover:shadow-sm">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <Lock size={20} />
                </div>
                <span className="text-sm font-bold text-slate-900">Protected</span>
                <span className="text-xs font-medium text-slate-500">Security</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= DETAILS & ACTIONS GRID ================= */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* PERSONAL INFORMATION (7 Columns) */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8 lg:col-span-7">
            <h2 className="mb-6 border-b border-slate-100 pb-4 text-lg font-bold text-slate-900">Personal Details</h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <User size={18} />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Full Name</span>
                  <p className="mt-0.5 text-sm font-bold text-slate-800">{user?.name || 'Not specified'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Mail size={18} />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</span>
                  <p className="mt-0.5 text-sm font-bold text-slate-800">{user?.email || 'Not specified'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Phone size={18} />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Phone Number</span>
                  <p className="mt-0.5 text-sm font-bold text-slate-800">{user?.phone || 'Not specified'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <MapPin size={18} />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Shipping Address</span>
                  <p>
                    {[user?.address?.country, user?.address?.governorate, user?.address?.district, user?.address?.village, user?.address?.street, user?.address?.apartment].filter(Boolean).join('، ')}
                  </p>{' '}
                </div>
              </div>
            </div>
          </div>

          {/* ACCOUNT SETTINGS & ACTIONS (5 Columns) */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8 lg:col-span-5">
            <div>
              <h2 className="mb-6 border-b border-slate-100 pb-4 text-lg font-bold text-slate-900">Account Settings</h2>

              <div className="space-y-3">
                <Link
                  to={`profileedit`}
                  className="active:scale-98 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <Edit size={16} />
                  <span>Edit Profile</span>
                </Link>
                <Link
                  to={`LocationEdit`}
                  className="active:scale-98 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <Edit size={16} />
                  <span> Location</span>
                </Link>

                <Link
                  to={`changepassword`}
                  className="active:scale-98 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <Lock size={16} />
                  <span>Change Password</span>
                </Link>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-6">
              <button
                onClick={handleLogout}
                className="active:scale-98 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-rose-50 py-3.5 text-sm font-bold text-rose-600 transition hover:bg-rose-600 hover:text-white"
              >
                <LogOut size={18} />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Outlet for Nested Routes (if any) */}
        <Outlet/>
      </div>
    </div>
  );
}
