import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios/axios_instance";
import errorHandler from "../../utils/Error_handeling";
/// create category
export const create_category = createAsyncThunk("create_category",
  async (postData, { rejectWithValue }) => {
    try {
      const res = await api.post("/categorys/", postData, { withCredentials: true,});
      return res.data;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);
//update category
export const updata_category = createAsyncThunk("update_category",
  async ({id,data}, { rejectWithValue }) => {
    try {
      const res = await api.put(`/categorys/${id}`,data,{withCredentials:true});
      return res.data;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);
export const get_category = createAsyncThunk("get_category",
  async (_,{ rejectWithValue }) => {
    try {
      const res = await api.get("/categorys/");
      return res.data;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);
export const delete_category = createAsyncThunk("delete_category",
  async (id,{ rejectWithValue }) => {
    try {
      const res = await api.delete(`/categorys/${id}`,{withCredentials:true});
      return res.data;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);
export const one_category = createAsyncThunk("one_category",
  async (id,{ rejectWithValue }) => {
    try {
      const res = await api.get(`/categorys/${id}`,);
      return res.data;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);
