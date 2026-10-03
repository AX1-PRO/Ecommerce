import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios/axios_instance.js"
import errorHandler from "../../utils/Error_handeling.js";
/// create cart
export const create_cart = createAsyncThunk("create_cart",
  async (postData, { rejectWithValue }) => {
    try {
      const res = await api.post("/cart/", postData, { withCredentials: true,});
      return res.data;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);
//update cart
export const updata_cart = createAsyncThunk("update_cart",
  async ({itemid,product_count}, { rejectWithValue }) => {
    try {
      const res = await api.put(`/cart/${itemid}`,{product_count},{withCredentials:true});
      return res.data;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);
//get all cart
export const get_all_cart = createAsyncThunk("get_cart",
  async (_,{ rejectWithValue }) => {
    try {
      const res = await api.get("/cart",{withCredentials:true});
      return res.data;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);
//delete item in cart
export const delete_cart = createAsyncThunk("delete_cart",
  async (id,{ rejectWithValue }) => {
    try {
      const res = await api.delete(`/cart/${id}`,{withCredentials:true});
      return res.data;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);
//delete all cart
export const delete_all_cart = createAsyncThunk("delete_all_cart",
  async () => {
    try {
      const res = await api.delete(`/cart/`,{withCredentials:true});
      return res.data;
    } catch (err) {
      return errorHandler(err);
    }
  }
);
//applay coupon
export const applayCoupon = createAsyncThunk("apply-Coupon",
  async (coupon, { rejectWithValue }) => {
    try {
      const res = await api.post("/cart/applaycoupon", coupon, { withCredentials: true,});
      return res.data;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);

