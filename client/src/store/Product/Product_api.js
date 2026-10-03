import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios/axios_instance";
import errorHandler from "../../utils/Error_handeling";
/// create category
export const create_product = createAsyncThunk("create_product",
  async (formdata, { rejectWithValue }) => {
    try {
      const res = await api.post("/products/", formdata, { withCredentials: true,});
      return res.data;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);

export const get_products = createAsyncThunk(
  'get_Products',
  async (filters={}, { rejectWithValue }) => {
    try {
      const params = {};

      if (filters.category) params.category = filters.category;
      if (filters.brand) params.brand = filters.brand;
      if (filters.subcategory) params.subcategory = filters.subcategory;

      if (filters.minPrice || filters.maxPrice) {
        params.price = {};
        if (filters.minPrice) params.price.gte = filters.minPrice;
        if (filters.maxPrice) params.price.lte = filters.maxPrice;
      }

      if (filters.keyword) params.keyword = filters.keyword;
      if (filters.sort) params.sort = filters.sort;
      if (filters.fields) params.fields = filters.fields;

      params.page = filters.page || 1;
      params.limit = filters.limit || 10;

      const  {data}  = await api.get('/products/', { params });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Something went wrong'
      );
    }
  }
);
export const one_product = createAsyncThunk("one_product",
  async (id,{ rejectWithValue }) => {
    try {
      const res = await api.get(`/products/${id}`,);
      return res.data;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);
export const delete_product = createAsyncThunk("delete_product",
  async (id,{ rejectWithValue }) => {
    try {
      const res = await api.delete(`/products/${id}`,{withCredentials:true});
      return res.data;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);
export const updata_product = createAsyncThunk("update_product",
  async ({id,data}, { rejectWithValue }) => {
    try {
      const res = await api.put(`/products/${id}`,data,{withCredentials:true});
      return res.data;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);
