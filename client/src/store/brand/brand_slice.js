import { createSlice } from "@reduxjs/toolkit";
import { create_brand,get_brand,delete_brand,one_brand, updata_brand } from "./brand_api";
let initialState={
loading:{
    when_create:false,
    when_getall:false,
    when_delete:false,
    when_getone:false,
    when_update:false
},
error: {
  when_create: null,
  when_getall: null,
  when_delete:null,
  when_getone:null,
  when_update:null
},
brands:[],
brand:{}
}
export let brand_slice=createSlice({
    name:"brand",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        //create brand
        builder.addCase(create_brand.pending,(state)=>{
            state.loading.when_create=true,
            state.error.when_create = null})
        .addCase(create_brand.fulfilled,(state,action)=>{
            state.loading.when_create=false,
            state.error.when_create=action.payload
        })
        .addCase(create_brand.rejected,(state,action)=>{
            state.loading.when_create=false
            state.error.when_create=action.payload||"Something went wrong";})
            //get brand
        .addCase(get_brand.pending,(state)=>{
            state.loading.when_getall=true
            state.error.when_getall = null})
        .addCase(get_brand.fulfilled,(state,action)=>{
            state.loading.when_getall=false,
            state.brands=action.payload
        })
        .addCase(get_brand.rejected,(state,action)=>{
            state.loading.when_getall=false
            state.error.when_getall=action.payload||"Something went wrong";})
            //getme logging
        .addCase(delete_brand.pending, (state) => {
             state.loading.when_delete = true;
             state.error.when_delete = null;})
        .addCase(delete_brand.fulfilled, (state, action) => {
            state.loading.when_delete = false;
             state.error.when_delete=action.payload
        })
        .addCase(delete_brand.rejected, (state, action) => {
            state.loading.when_delete = false;
            state.error.when_delete = action.payload|| "Failed to delete user";
        })
        /////////
        .addCase(one_brand.pending,(state)=>{
            state.loading.when_getone=true
            state.error.when_getone = null})
        .addCase(one_brand.fulfilled,(state,action)=>{
            state.loading.when_getone=false,
            state.brand=action.payload
        })
        .addCase(one_brand.rejected,(state,action)=>{
            state.loading.when_getone=false
            state.error.when_getone=action.payload||"Something went wrong";})
        .addCase(updata_brand.pending,(state)=>{
            state.loading.when_update=true
            state.error.when_update = null})
        .addCase(updata_brand.fulfilled,(state,action)=>{
            state.loading.when_update=false,
            state.error.when_update=action.payload
        })
        .addCase(updata_brand.rejected,(state,action)=>{
            state.loading.when_update=false
            state.error.when_update=action.payload||"Something went wrong";})
    }

})
export default brand_slice.reducer