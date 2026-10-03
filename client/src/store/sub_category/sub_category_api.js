import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios/axios_instance";
import errorHandler from "../../utils/Error_handeling";
/// create category
export const create_subcategory = createAsyncThunk("create_subcategory",
  async (postData, { rejectWithValue }) => {
    try {
      const res = await api.post("/subcategorys/", postData, { withCredentials: true,});
      return res.data;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);
//update category
export const updata_subcategory = createAsyncThunk("update_subcategory",
  async ({id,formdatt}, { rejectWithValue }) => {
    try {
      const res = await api.put(`/subcategorys/${id}`,formdatt,{withCredentials:true});
      return res.data;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);
export const get_subcategory = createAsyncThunk("get_subcategory",
  async (_,{ rejectWithValue }) => {
    try {
      const res = await api.get("/subcategorys/");
      return res.data;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);
export const delete_subcategory = createAsyncThunk("delete_subcategory",
  async (id,{ rejectWithValue }) => {
    try {
      const res = await api.delete(`/subcategorys/${id}`,{withCredentials:true});
      return res.data;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);
export const one_subcategory = createAsyncThunk("one_subcategory",
  async (id,{ rejectWithValue }) => {
    try {
      const res = await api.get(`/subcategorys/${id}`,);
      return res.data;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);