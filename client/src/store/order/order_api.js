import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios/axios_instance.js"
import errorHandler from "../../utils/Error_handeling.js";
/// create order
export const createOrderCash = createAsyncThunk("create_cash_order",
  async (cartid, { rejectWithValue }) => {
    try {
      const res = await api.post(`/order/${cartid}`, {}, { withCredentials: true,});
      return res.data;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);
//get_user_orders
export const get_user_orders = createAsyncThunk("get_user_orders",
  async (_,{ rejectWithValue }) => {
    try {
      const res = await api.get("/order/me/",{withCredentials:true});
      return res.data;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);
//delete order user
export const delete_user_order = createAsyncThunk("delete_user_order",
  async (orderid,{ rejectWithValue }) => {
    try {
      const res = await api.delete(`/order/me/${orderid}`,{withCredentials:true});
      return res.data;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);
//get checkout strapi
export const get_checkout_strip = createAsyncThunk("get_checkout",
  async (cartid,{ rejectWithValue }) => {
    try {
      const res = await api.get(`/order/checkout/${cartid}`,{withCredentials:true});
      return res.data;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);
//get all order admin
export const get_all_orders = createAsyncThunk("get_orders",
  async (_,{ rejectWithValue }) => {
    try {
      const res = await api.get("/order/",{withCredentials:true});
      return res.data;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);
//delete order admin
export const delete_admin_order = createAsyncThunk("delete_admin_order",
  async (orderid,{ rejectWithValue }) => {
    try {
      const res = await api.delete(`/order/${orderid}`,{withCredentials:true});
      return res.data;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);
//update order ispay admin
export const update_order_ispay = createAsyncThunk("update_order_ispay",
  async (id,{ rejectWithValue }) => {
    try {
      const res = await api.put(`/order/${id}/pay`,{},{withCredentials:true});
      return res.data;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);
//update order isdelivary admin
export const update_order_isdelivary = createAsyncThunk("update_order_isdelivary",
  async (id,{ rejectWithValue }) => {
    try {
      const res = await api.put(`/order/${id}/delivary`,{},{withCredentials:true});
      return res.data;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);
