import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios/axios_instance";
import errorHandler from "../../utils/Error_handeling";
/// create user
export const create_user = createAsyncThunk("create_user",
  async (postData, { rejectWithValue }) => {
    try {
      const res = await api.post("/user", postData, { withCredentials: true,});
      return res.data;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);
export const get_users = createAsyncThunk("get_users",
  async (params,{ rejectWithValue }) => {
    try {
      const res = await api.get("/user",{params,withCredentials:true});
      return res.data;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);
export const delete_user = createAsyncThunk("delete_user",
  async (id,{ rejectWithValue }) => {
    try {
      const res = await api.delete(`/user/${id}`,{withCredentials:true});
      return res.data;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);
export const one_user = createAsyncThunk("one_user",
  async (id,{ rejectWithValue }) => {
    try {
      const res = await api.get(`/user/${id}`,{withCredentials:true});
      return res.data;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);
//
export const updata_user = createAsyncThunk("update_user",
  async ({id,formData}, { rejectWithValue }) => {
    try {
      const res = await api.put(`/user/${id}`,formData,{withCredentials:true});
      return res.data;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);
