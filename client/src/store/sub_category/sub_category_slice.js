import { createSlice } from "@reduxjs/toolkit";
import { create_subcategory,updata_subcategory,delete_subcategory,one_subcategory, get_subcategory } from "./sub_category_api";
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
subcategories:[],
subcategory:{}
}
export let subcategory_slice=createSlice({
    name:"subcategories",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        //create category
        builder.addCase(create_subcategory.pending,(state)=>{
            state.loading.when_create=true,
            state.error.when_create = null})
        .addCase(create_subcategory.fulfilled,(state,action)=>{
            state.loading.when_create=false,
            state.error.when_create=action.payload
        })
        .addCase(create_subcategory.rejected,(state,action)=>{
            state.loading.when_create=false
            state.error.when_create=action.payload||"Something went wrong";})
            //get category
        .addCase(get_subcategory.pending,(state)=>{
            state.loading.when_getall=true
            state.error.when_getall = null})
        .addCase(get_subcategory.fulfilled,(state,action)=>{
            state.loading.when_getall=false,
            state.subcategories=action.payload
        })
        .addCase(get_subcategory.rejected,(state,action)=>{
            state.loading.when_getall=false
            state.error.when_getall=action.payload||"Something went wrong";})
            //getme logging
        .addCase(delete_subcategory.pending, (state) => {
             state.loading.when_delete = true;
             state.error.when_delete = null;})
        .addCase(delete_subcategory.fulfilled, (state, action) => {
            state.loading.when_delete = false;;
            state.error.when_delete = action.payload;})
        .addCase(delete_subcategory.rejected, (state, action) => {
            state.loading.when_delete = false;
            state.error.when_delete = action.payload|| "Failed to delete user";
        })
        /////////
        .addCase(one_subcategory.pending,(state)=>{
            state.loading.when_getone=true
            state.error.when_getone = null})
        .addCase(one_subcategory.fulfilled,(state,action)=>{
            state.loading.when_getone=false,
            state.subcategory=action.payload
        })
        .addCase(one_subcategory.rejected,(state,action)=>{
            state.loading.when_getone=false
            state.error.when_getone=action.payload||"Something went wrong";})
        /////////
        .addCase(updata_subcategory.pending,(state)=>{
            state.loading.when_update=true
            state.error.when_update = null})
        .addCase(updata_subcategory.fulfilled,(state,action)=>{
            state.loading.when_update=false,
            state.error.when_update=action.payload
        })
        .addCase(updata_subcategory.rejected,(state,action)=>{
            state.loading.when_update=false
            state.error.when_update=action.payload||"Something went wrong";})
    }

})
export default subcategory_slice.reducer