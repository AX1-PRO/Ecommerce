import { createSlice } from "@reduxjs/toolkit";
import {create_cart,updata_cart,delete_cart,get_all_cart,delete_all_cart,applayCoupon} from "./cart_api"
let initialState={
loading:{
    when_create:false,
    when_getall:false,
    when_delete:false,
    when_deleteall:false,
    when_update:false,
    when_applaycoupon:false
},
error: {
  when_create: null,
  when_getall: null,
  when_delete:null,
  when_deleteall:null,
  when_update:null,
  when_applaycoupon:null
},
cart:[],
}
export let cart_slice=createSlice({
    name:"cart",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        //create cart
        builder.addCase(create_cart.pending,(state)=>{
            state.loading.when_create=true,
            state.error.when_create = null})
        .addCase(create_cart.fulfilled,(state,action)=>{
            state.loading.when_create=false,
            state.error.when_create=action.payload
        })
        .addCase(create_cart.rejected,(state,action)=>{
            state.loading.when_create=false
            state.error.when_create=action.payload||"Something went wrong";})
            //get all cart
        .addCase(get_all_cart.pending,(state)=>{
            state.loading.when_getall=true
            state.error.when_getall = null})
        .addCase(get_all_cart.fulfilled,(state,action)=>{
            state.loading.when_getall=false,
            state.cart=action.payload
        })
        .addCase(get_all_cart.rejected,(state,action)=>{
            state.loading.when_getall=false
            state.error.when_getall=action.payload||"Something went wrong";})
            //delete one
        .addCase(delete_cart.pending, (state) => {
             state.loading.when_delete = true;
             state.error.when_delete = null;})
        .addCase(delete_cart.fulfilled, (state, action) => {
            state.loading.when_delete = false;
             state.error.when_delete=action.payload
        })
        .addCase(delete_cart.rejected, (state, action) => {
            state.loading.when_delete = false;
            state.error.when_delete = action.payload|| "Failed to delete user";
        })
            //delete all cart
        .addCase(delete_all_cart.pending, (state) => {
             state.loading.when_deleteall = true;
             state.error.when_deleteall = null;})
        .addCase(delete_all_cart.fulfilled, (state, action) => {
            state.loading.when_deleteall = false;
             state.error.when_deleteall=action.payload
        })
        .addCase(delete_all_cart.rejected, (state, action) => {
            state.loading.when_deleteall = false;
            state.error.when_deleteall = action.payload|| "Failed to delete user";
        })
         //update cart
        .addCase(updata_cart.pending,(state)=>{
            state.loading.when_update=true
            state.error.when_update = null})
        .addCase(updata_cart.fulfilled,(state,action)=>{
            state.loading.when_update=false,
            state.error.when_update=action.payload
        })
        .addCase(updata_cart.rejected,(state,action)=>{
            state.loading.when_update=false
            state.error.when_update=action.payload||"Something went wrong";})
            //applaycoupon
            .addCase(applayCoupon.pending,(state)=>{
            state.loading.when_applaycoupon=true,
            state.error.when_applaycoupon = null})
        .addCase(applayCoupon.fulfilled,(state,action)=>{
            state.loading.when_applaycoupon=false,
            state.error.when_applaycoupon=action.payload
        })
        .addCase(applayCoupon.rejected,(state,action)=>{
            state.loading.when_applaycoupon=false
            state.error.when_applaycoupon=action.payload||"Something went wrong";})
    }

})
export default cart_slice.reducer
