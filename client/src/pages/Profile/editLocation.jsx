import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Gover from "../../files/Address/all-governorate.json";
import Distrc from "../../files/Address/all-district.json";
import { addandupdatelocation } from '../../api/profile/location.js';
import { getMe } from '../../store/auth/atuh.api.js';
export default function EditLocation() {
  const { user, loading } = useSelector((state) => state.auth_slice || {});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    country: 'egypt',
    governorate: '',
    district: '',
    village: '',
    street: '',
    apartment: '',
    phone:""
  });
  useEffect(()=>{
      setFormData({
    country: 'egypt',
    governorate: user.address.governorate||'',
    district:user.address.district||'',
    village:user.address.village||'',
    street:user.address.street||'',
    apartment:user.address.apartment||'',
    phone:user.address.phone||''
      })
  },[dispatch])
let [msg,setmsg]=useState(null)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'governorate' && { district: '' })
    }));
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
    try{
     let res= await addandupdatelocation(formData)
     dispatch(getMe())
     setmsg(res.message)
    }catch(err){
      setmsg(err)
    }
  };

  const handeldistrict = Distrc.filter((el) => el.parent.name.en === formData.governorate);

  const inputStyles = "w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 transition-all duration-200 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-60";

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-100/50 sm:p-8">
      {/* Header */}
      <div className="mb-8 border-b border-gray-100 pb-5">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Edit Location Details</h2>
        <p className="mt-1 text-sm text-gray-500">Update your region and detailed address below.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Region Section */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Region & Area</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Country */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="country" className="text-sm font-medium text-gray-700">
                Country
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={inputStyles}
              >
                <option value="egypt">Egypt</option>
              </select>
            </div>

            {/* Governorate */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="governorate" className="text-sm font-medium text-gray-700">
                Governorate / State
              </label>
              <select
                id="governorate"
                name="governorate"
                value={formData.governorate}
                onChange={handleChange}
                className={inputStyles}
              >
                <option value="" disabled>
                  Select Governorate
                </option>
                {Gover.map((el) => (
                  <option key={el.id} value={el.name.en}>
                    {el.name.en}
                  </option>
                ))}
              </select>
            </div>

            {/* District */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="district" className="text-sm font-medium text-gray-700">
                District / City
              </label>
              <select
                id="district"
                name="district"
                disabled={!formData.governorate}
                value={formData.district}
                onChange={handleChange}
                className={inputStyles}
              >
                <option value="" disabled>
                  Select District
                </option>
                {handeldistrict.map((el) => (
                  <option key={el.id} value={el.name.en}>
                    {el.name.en}
                  </option>
                ))}
              </select>
            </div>

            {/* Village / Zone */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="village" className="text-sm font-medium text-gray-700">
                Village / Zone
              </label>
              <input
                id="village"
                name="village"
                type="text"
                placeholder="e.g. Al-Amria"
                value={formData.village}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>
          </div>
        </div>

        {/* Address Details Section */}
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Street Address</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Street */}
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label htmlFor="street" className="text-sm font-medium text-gray-700">
                Street Name / No.
              </label>
              <input
                id="street"
                name="street"
                type="text"
                placeholder="e.g. 123 Main Street"
                value={formData.street}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>

            {/* Apartment */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="apartment" className="text-sm font-medium text-gray-700">
                Apt / Suite / Bldg
              </label>
              <input
                id="apartment"
                name="apartment"
                type="text"
                placeholder="e.g. Apt 4B"
                value={formData.apartment}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="apartment" className="text-sm font-medium text-gray-700">
                phone
              </label>
              <input
                id="phone"
                name="phone"
                type="number"
                placeholder="000000000000"
                value={formData.phone}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>
          </div>
        </div>
        {
           msg&& <p className=' capitalize text-xl block text-center text-green-600'>{msg}</p>
        }
        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-6">
          <button
            type="button"
            className="rounded-xl px-5 py-2.5 text-sm font-medium text-gray-600 transition-all hover:bg-gray-100 active:scale-95"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95 focus:ring-4 focus:ring-blue-500/20"
          >
            Save Address
          </button>
        </div>
      </form>
    </div>
  );
}
