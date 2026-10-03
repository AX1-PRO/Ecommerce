import { createSlice } from "@reduxjs/toolkit";
import { createCoupon,getCoupons,deleteCoupon,updataCoupon } from "./couponApi";
let initialState={
loading:{
    create:false,
    getall:false,
    delete:false,
    update:false
},
result: {
  create: null,
  getall: null,
  delete:null,
  update:null
},
coupons:[],
}
export let sliceCoupon=createSlice({
    name:"coupon",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        //create coupon
        builder.addCase(createCoupon.pending,(state)=>{
            state.loading.create=true,
            state.result.create = null})
        .addCase(createCoupon.fulfilled,(state,action)=>{
            state.loading.create=false,
            state.result.create=action.payload
        })
        .addCase(createCoupon.rejected,(state,action)=>{
            state.loading.create=false
            state.result.create=action.payload||"Something went wrong";})
            //get coupons
        .addCase(getCoupons.pending,(state)=>{
            state.loading.getall=true
            state.result.getall = null})
        .addCase(getCoupons.fulfilled,(state,action)=>{
            state.loading.getall=false,
            state.coupons=action.payload
        })
        .addCase(getCoupons.rejected,(state,action)=>{
            state.loading.getall=false
            state.result.getall=action.payload||"Something went wrong";})
            //delete coupon
        .addCase(deleteCoupon.pending, (state) => {
             state.loading.delete = true;
             state.result.delete = null;})
        .addCase(deleteCoupon.fulfilled, (state, action) => {
            state.loading.delete = false;
             state.result.delete=action.payload
        })
        .addCase(deleteCoupon.rejected, (state, action) => {
            state.loading.delete = false;
            state.result.delete = action.payload|| "Failed to delete user";
        })
        //update coupon
        .addCase(updataCoupon.pending,(state)=>{
            state.loading.update=true
            state.result.update = null})
        .addCase(updataCoupon.fulfilled,(state,action)=>{
            state.loading.update=false,
            state.result.update=action.payload
        })
        .addCase(updataCoupon.rejected,(state,action)=>{
            state.loading.update=false
            state.result.update=action.payload||"Something went wrong";})
    }

})
export default sliceCoupon.reducer
