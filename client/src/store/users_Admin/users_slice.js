import { createSlice } from "@reduxjs/toolkit";
import {create_user,get_users,one_user,delete_user,updata_user} from './users_api'
let initialState={
loading_user:{
    when_create:false,
    when_getall:false,
    when_delete:false,
    when_getone:false,
    when_update:false
},
error_user: {
  when_create: null,
  when_getall: null,
  when_delete:null,
  when_getone:null,
  when_update:null
},
users:[],
user:{}
}
export let user_slice=createSlice({
    name:"user",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        //create user
        builder.addCase(create_user.pending,(state)=>{
            state.loading_user.when_create=true,
            state.error_user.when_create = null})
        .addCase(create_user.fulfilled,(state,action)=>{
            state.loading_user.when_create=false,
            state.error_user.when_create=action.payload
        })
        .addCase(create_user.rejected,(state,action)=>{
            state.loading_user.when_create=false
            state.error_user.when_create=action.payload||"Something went wrong";})
            //get user
        .addCase(get_users.pending,(state)=>{
            state.loading_user.when_getall=true
            state.error_user.when_getall = null})
        .addCase(get_users.fulfilled,(state,action)=>{
            state.loading_user.when_getall=false,
            state.users=action.payload
        })
        .addCase(get_users.rejected,(state,action)=>{
            state.loading_user.when_getall=false
            state.error_user.when_getall=action.payload||"Something went wrong";})
            //getme logging
        .addCase(delete_user.pending, (state) => {
             state.loading_user.when_delete = true;
             state.error_user.when_delete = null;})
        .addCase(delete_user.fulfilled, (state, action) => {
            state.loading_user.when_delete = false;
            state.error_user.when_delete=action.payload
        })
        .addCase(delete_user.rejected, (state, action) => {
            state.loading_user.when_delete = false;
            state.error_user.when_delete = action.payload|| "Failed to delete user";
        })
        /////////
        .addCase(one_user.pending,(state)=>{
            state.loading_user.when_getone=true
            state.error_user.when_getone = null})
        .addCase(one_user.fulfilled,(state,action)=>{
            state.loading_user.when_getone=false,
            state.user=action.payload
        })
        .addCase(one_user.rejected,(state,action)=>{
            state.loading_user.when_getone=false
            state.error_user.when_getone=action.payload||"Something went wrong";})
        /////////
        .addCase(updata_user.pending,(state)=>{
            state.loading_user.when_update=true
            state.error_user.when_update = null})
        .addCase(updata_user.fulfilled,(state,action)=>{
            state.loading_user.when_update=false,
            state.error_user.when_update=action.payload
        })
        .addCase(updata_user.rejected,(state,action)=>{
            state.loading_user.when_update=false
            state.error_user.when_update=action.payload||"Something went wrong";})
    }

})
export default user_slice.reducer