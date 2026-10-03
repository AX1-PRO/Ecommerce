import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios/axios_instance";
import errorHandler from "../../utils/Error_handeling";
/// create favorits
export const create_fav = createAsyncThunk("create_fav",
  async (id, { rejectWithValue }) => {
    try {
     const res = await api.post("/favorits/", {productid:id}, {withCredentials: true});
       return res.data;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);
//get favorits
export const get_favorits = createAsyncThunk(
  'get_favorits',
  async (_,{ rejectWithValue }) => {
    try {
      let fetch=await api.get('/favorits',{withCredentials:true})
      return fetch.data
    } catch (error) {
      return rejectWithValue(errorHandler(error))
    }
  }
);
//delete fav
export const delete_fav = createAsyncThunk("delete_fav",
  async (id,{ rejectWithValue }) => {
    try {
      const res = await api.delete(`/favorits/${id}`,{withCredentials:true});
      return res.data;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);
