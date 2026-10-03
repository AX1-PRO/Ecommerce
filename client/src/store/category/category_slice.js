import { createSlice } from "@reduxjs/toolkit";
import { create_category,get_category,delete_category,one_category, updata_category } from "./category_api";
let initialState={
loading:{
    when_create:false,
    when_getall:false,
    when_delete:false,
    when_getone:false,
    when_update:false,
},
error: {
  when_create: null,
  when_getall: null,
  when_delete:null,
  when_getone:null,
  when_update:null,
},
categorys:[],
category:{}
}
export let category_slice=createSlice({
    name:"category",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        //create category
        builder.addCase(create_category.pending,(state)=>{
            state.loading.when_create=true,
            state.error.when_create = null})
        .addCase(create_category.fulfilled,(state,action)=>{
            state.loading.when_create=false,
            state.error.when_create=action.payload
        })
        .addCase(create_category.rejected,(state,action)=>{
            state.loading.when_create=false
            state.error.when_create=action.payload||"Something went wrong";})
            //get category
        .addCase(get_category.pending,(state)=>{
            state.loading.when_getall=true
            state.error.when_getall = null})
        .addCase(get_category.fulfilled,(state,action)=>{
            state.loading.when_getall=false,
            state.categorys=action.payload
        })
        .addCase(get_category.rejected,(state,action)=>{
            state.loading.when_getall=false
            state.error.when_getall=action.payload||"Something went wrong";})
            //getme logging
        .addCase(delete_category.pending, (state) => {
             state.loading.when_delete = true;
             state.error.when_delete = null;})
        .addCase(delete_category.fulfilled, (state, action) => {
            state.loading.when_delete = false;
            state.error.when_delete = action.payload;})
        .addCase(delete_category.rejected, (state, action) => {
            state.loading.when_delete = false;
            state.error.when_delete = action.payload|| "Failed to delete user";
        })
        /////////
        .addCase(one_category.pending,(state)=>{
            state.loading.when_getone=true
            state.error.when_getone = null})
        .addCase(one_category.fulfilled,(state,action)=>{
            state.loading.when_getone=false,
            state.category=action.payload
        })
        .addCase(one_category.rejected,(state,action)=>{
            state.loading.when_getone=false
            state.error.when_getone=action.payload||"Something went wrong";})
        .addCase(updata_category.pending,(state)=>{
            state.loading.when_update=true
            state.error.when_update = null})
        .addCase(updata_category.fulfilled,(state,action)=>{
            state.loading.when_update=false,
            state.error.when_update=action.payload
        })
        .addCase(updata_category.rejected,(state,action)=>{
            state.loading.when_update=false
            state.error.when_update=action.payload||"Something went wrong";})
    }

})
export default category_slice.reducer
