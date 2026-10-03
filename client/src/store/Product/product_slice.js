import { createSlice } from '@reduxjs/toolkit';
import { create_product, get_products, one_product, delete_product, updata_product } from './Product_api';
let initialState = {
  loading_product: {
    when_create: false,
    when_getall: false,
    when_delete: false,
    when_getone: false,
    when_update: false
  },
  product: {},
  error_product: {
    when_create: null,
    when_getall: null,
    when_delete: null,
    when_getone: null,
    when_update: null
  },
  products: {
    data: [],
    page: 1,
    page_count: 0,
    products_count: 0
  }
};
export let product_slice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //create product
    builder
      .addCase(create_product.pending, (state) => {
        ((state.loading_product.when_create = true), (state.error_product.when_create = null));
      })
      .addCase(create_product.fulfilled, (state, action) => {
        ((state.loading_product.when_create = false), (state.error_product.when_create = action.payload));
      })
      .addCase(create_product.rejected, (state, action) => {
        state.loading_product.when_create = false;
        state.error_product.when_create = action.payload || 'Something went wrong';
      })
      ///////// one product
      .addCase(one_product.pending, (state) => {
        state.loading_product.when_getone = true;
        state.error_product.when_getone = null;
      })
      .addCase(one_product.fulfilled, (state, action) => {
        ((state.loading_product.when_getone = false), (state.product = action.payload));
      })
      .addCase(one_product.rejected, (state, action) => {
        state.loading_product.when_getone = false;
        state.error_product.when_getone = action.payload || 'Something went wrong';
      })
      //get all products
      .addCase(get_products.pending, (state) => {
        state.loading_product.when_getall = true;
        state.error_product.when_getall = null;
      })
      .addCase(get_products.fulfilled, (state, action) => {
        state.loading_product.when_getall = false;
        state.products = action.payload;
      })
      .addCase(get_products.rejected, (state, action) => {
        state.loading_product.when_getall = false;
        state.error_product.when_getall = action.payload;
      })
      //delete product
      .addCase(delete_product.pending, (state) => {
        state.loading_product.when_delete = true;
        state.error_product.when_delete = null;
      })
      .addCase(delete_product.fulfilled, (state, action) => {
        state.loading_product.when_delete = false;
        state.error_product.when_delete = action.payload;
      })
      .addCase(delete_product.rejected, (state, action) => {
        state.loading_product.when_delete = false;
        state.error_product.when_delete = action.payload || 'Failed to delete user';
      })
      //update product
      .addCase(updata_product.pending,(state)=>{
                  state.loading_product.when_update=true
                  state.error_product.when_update = null})
              .addCase(updata_product.fulfilled,(state,action)=>{
                  state.loading_product.when_update=false,
                  state.error_product.when_update=action.payload
              })
              .addCase(updata_product.rejected,(state,action)=>{
                  state.loading_product.when_update=false
                  state.error_product.when_update=action.payload||"Something went wrong";})
  }
});
export default product_slice.reducer;
