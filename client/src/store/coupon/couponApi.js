import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios/axios_instance";
import errorHandler from "../../utils/Error_handeling";
/// create coupon
export const createCoupon = createAsyncThunk("create_coupon",
  async (postData, { rejectWithValue }) => {
    try {
      const res = await api.post("/coupon/", postData, { withCredentials: true,});
      return res.data;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);
//update coupon
export const updataCoupon = createAsyncThunk("update_coupon",
  async ({id,data}, { rejectWithValue }) => {
    try {
      const res = await api.put(`/coupon/${id}`,data,{withCredentials:true});
      return res.data;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);
//all coupons
export const getCoupons = createAsyncThunk("get_coupon",
  async (_,{ rejectWithValue }) => {
    try {
      const res = await api.get("/coupon/",{withCredentials:true});
      return res.data;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);
//delete coupon
export const deleteCoupon = createAsyncThunk("delete_coupon",
  async (id,{ rejectWithValue }) => {
    try {
      const res = await api.delete(`/coupon/${id}`,{withCredentials:true});
      return res.data;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);
