import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios/axios_instance";
import errorHandler from "../../utils/Error_handeling";
/// create brand
export const create_brand = createAsyncThunk("create_brand",
  async (postData, { rejectWithValue }) => {
    try {
      const res = await api.post("/brands/", postData, { withCredentials: true,});
      return res.data;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);
//update brand
export const updata_brand = createAsyncThunk("update_brand",
  async ({id,data}, { rejectWithValue }) => {
    try {
      const res = await api.put(`/brands/${id}`,data,{withCredentials:true});
      return res.data;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);
export const get_brand = createAsyncThunk("get_brand",
  async (_,{ rejectWithValue }) => {
    try {
      const res = await api.get("/brands/");
      return res.data;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);
export const delete_brand = createAsyncThunk("delete_brand",
  async (id,{ rejectWithValue }) => {
    try {
      const res = await api.delete(`/brands/${id}`,{withCredentials:true});
      return res.data;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);
export const one_brand = createAsyncThunk("one_brand",
  async (id,{ rejectWithValue }) => {
    try {
      const res = await api.get(`/brands/${id}`,);
      return res.data;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);