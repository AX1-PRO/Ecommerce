import { createSlice } from "@reduxjs/toolkit";
import { login,signup,getMe,Logout } from './atuh.api' 
let initialState={
loading:{
    login:false,
    signup:false,
    getMe:true,
    logout:false
},
error: {
  login: null,
  signup: null,
  getMe:null,
  logout:null
},
user:null
}
export let auth_slice=createSlice({
    name:"auth",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        //login
        builder.addCase(login.pending,(state)=>{
            state.loading.login=true,
            state.error.login = null})
        .addCase(login.fulfilled,(state,action)=>{
            state.loading.login=false
            state.user=action.payload
        })
        .addCase(login.rejected,(state,action)=>{
            state.loading.login=false
            state.error.login=action.payload||"Something went wrong";})
            //signup
        .addCase(signup.pending,(state)=>{
            state.loading.signup=true
            state.error.signup = null})
        .addCase(signup.fulfilled,(state,action)=>{
            state.loading.signup=false
            state.user=action.payload
        })
        .addCase(signup.rejected,(state,action)=>{
            state.loading.signup=false
            state.error.signup=action.payload||"Something went wrong";})
            //getme logging
        .addCase(getMe.pending, (state) => {
             state.loading.getMe = true;
             state.error.getMe = null;})
        .addCase(getMe.fulfilled, (state, action) => {
            state.loading.getMe = false;
            state.user = action.payload;})
        .addCase(getMe.rejected, (state, action) => {
            state.loading.getMe = false;
            state.user = null;
            state.error.getMe = action.payload|| "Failed to get user";
})
            // logg out
        .addCase(Logout.pending, (state) => {
             state.loading.logout = true;
             state.error.logout = null;})
        .addCase(Logout.fulfilled, (state, action) => {
            state.loading.logout = false;
            state.user = null})
        .addCase(Logout.rejected, (state, action) => {
            state.loading.logout = false;
            state.user = null;
            state.error.logout = action.payload|| "Failed to get user";
})

    }

})
export default auth_slice.reducer