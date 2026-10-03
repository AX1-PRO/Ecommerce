import { useEffect, useState } from 'react';
import { Search, Pencil, Trash2, Users, Shield, UserCheck, UserX,User } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { get_users,delete_user } from '../../../store/users_Admin/users_api';
import { Link } from 'react-router';

export default function AllUsers() {
    let [deleteId, setDeleteId] = useState('');
  const [search, setSearch] = useState('');
  const { users, loading_user,error_user } = useSelector((state) => state.user_slice);
  const dispatch = useDispatch();
  useEffect(() => {
 const timer = setTimeout(() => {
    dispatch(get_users({ keyword: search }));
  }, 500);
  return () => clearTimeout(timer);
  }, [dispatch,search]);

  const handleDelete = async(id) => {
   await dispatch(delete_user(id))
   await dispatch(get_users())
       setDeleteId(null);
  };
  const totalUsers = users?.length || 0;
  const admins = users?.data?.filter((user) => user.role === 'admin').length || 0;
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800">Users Management</h1>

          <p className="text-gray-500 mt-2">Manage all registered users from one place.</p>
        </div>

        {/* STATS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-3xl shadow-sm border p-6">
            <div className="flex justify-between items-center">
              <Users className="text-blue-600" size={35} />
              <span className="text-4xl font-bold">{totalUsers}</span>
            </div>

            <p className="mt-6 text-gray-500">Total</p>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border p-6">
            <div className="flex justify-between items-center">
              <Shield className="text-purple-600" size={35} />

              <span className="text-4xl font-bold">{admins}</span>
            </div>

            <p className="mt-6 text-gray-500">Admins</p>
          </div>


        </div>

        {/* SEARCH */}

        <div className="bg-white rounded-3xl shadow-sm border p-5 mb-8">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email or phone..."
              className="w-full border rounded-2xl py-4 pl-14 pr-5 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* TABLE */}

        <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr className="text-left text-sm uppercase text-gray-500">
                  <th className="px-6 py-5">User</th>

                  <th className="px-6 py-5">Phone</th>

                  <th className="px-6 py-5">Role</th>

                  <th className="px-6 py-5">Password</th>

                  <th className="px-6 py-5">Joined</th>

                  <th className="px-6 py-5 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading_user.when_getall ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-gray-500">
                      Loading users...
                    </td>
                  </tr>
                ) : users.length > 0 ? (
                  users?.data?.map((user) => (
                    <tr key={user._id} className="border-t hover:bg-slate-50 transition-all duration-200">
                      {/* USER */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          {
                            user.img_cover?(<img src={user?.imageUrl} alt={user.name} className="w-14 h-14 rounded-full object-cover border-2 border-blue-100" />):<div className='bg-indigo-100 w-12 h-12 rounded-full flex justify-center items-center text-blue-500 capitalize'>{user.name[0]}</div>
                          }
                          <div>
                            <h3 className="font-semibold text-slate-800">{user.name}</h3>

                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* PHONE */}
                      <td className="px-6 text-gray-600">{user.phone}</td>

                      {/* ROLE */}
                      <td className="px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{user.role}</span>
                      </td>

                      {/* PASSWORD */}
                      <td className="px-6">
                        {user.password_changed_date ? (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Changed</span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">Never</span>
                        )}
                      </td>

                      {/* DATE */}
                      <td className="px-6 text-gray-500 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>

                      {/* ACTIONS */}
                      <td className="px-6">
                        <div className="flex justify-center gap-3">
                          <Link to={`Edituser/${user._id}`}  className="w-10 h-10 flex justify-center items-center rounded-xl bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 transition-all duration-300">
                            <Pencil size={18}  />
                          </Link>

                          <button onClick={() => setDeleteId(user._id)} className="w-10  flex justify-center items-center h-10 rounded-xl bg-red-50 hover:bg-red-600 hover:text-white text-red-600 transition-all duration-300">
                            <Trash2 size={18}  />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-16">
                      <div className="flex flex-col items-center">
                        <Users size={55} className="text-gray-300 mb-3" />

                        <h3 className="text-xl font-semibold text-gray-700">No Users Found</h3>

                        <p className="text-gray-500 mt-2">There are no users matching your search.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
        {deleteId && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-lg">
              <h2 className="text-lg font-bold mb-2">Delete Category</h2>

              <p className="text-gray-500 text-sm mb-6">Are you sure you want to delete this category?</p>

              <div className="flex justify-end gap-3">
                <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">
                  Cancel
                </button>

                <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white">
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
