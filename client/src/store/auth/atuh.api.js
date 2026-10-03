import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios/axios_instance";
////login
export const login = createAsyncThunk(
  "login",
  async (postData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/login", postData,{withCredentials:true});
      return data;
    } catch (err) {
      return rejectWithValue(
      err?.response?.data?.message ||
      "Something went wrong"
  );
}
  }
);
///////signup
export const signup = createAsyncThunk(
  "signup",
  async (postData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/signup", postData,{withCredentials:true});
      return data;
    } catch (err) {
  return rejectWithValue(
    err?.response?.data?.message ||
    "Something went wrong"
  );
}
  }
);
//get me
export const getMe = createAsyncThunk(
  "getMe",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/user/getme",{withCredentials:true});
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to get user" }
      );
    }
  }
);
//log Out
export let Logout=createAsyncThunk(
  'logout',
  async(_,{rejectWithValue})=>{
    try{
     let res=await api.post('/user/logout',{},{withCredentials:true})
     return res.data
    
  }catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to get user" }
      );
    }}
)