import { createSlice } from '@reduxjs/toolkit';
import { createOrderCash, get_user_orders,get_checkout_strip, delete_user_order, get_all_orders, delete_admin_order, update_order_ispay, update_order_isdelivary } from './order_api';
let initialState = {
  loading_order: {
    when_create: false,
    when_stripe:false,
    when_get_user_orders: false,
    when_delete_user: false,
    when_get_all: false,
    when_delete_admin: false,
    when_update_pay: false,
    when_update_delivery: false
  },

  orders: [],
  order:{},
  error_order: {
    when_create: null,
    when_stripe:null,
    when_get_user_orders: null,
    when_delete_user: null,
    when_get_all: null,
    when_delete_admin: null,
    when_update_pay: null,
    when_update_delivery: null
  }
};

export let order_slice = createSlice({
  name: 'order',
  initialState,

  reducers: {},

  extraReducers: (builder) => {
    // create order cash
    builder
      .addCase(createOrderCash.pending, (state) => {
        state.loading_order.when_create = true;
        state.error_order.when_create = null;
      })

      .addCase(createOrderCash.fulfilled, (state, action) => {
        state.loading_order.when_create = false;
        state.error_order.when_create = action.payload;
      })

      .addCase(createOrderCash.rejected, (state, action) => {
        state.loading_order.when_create = false;
        state.error_order.when_create = action.payload || 'Something went wrong';
      })

      // get user orders
      .addCase(get_user_orders.pending, (state) => {
        state.loading_order.when_get_user_orders = true;
        state.error_order.when_get_user_orders = null;
      })

      .addCase(get_user_orders.fulfilled, (state, action) => {
        state.loading_order.when_get_user_orders = false;
        state.orders = action.payload;
      })

      .addCase(get_user_orders.rejected, (state, action) => {
        state.loading_order.when_get_user_orders = false;
        state.error_order.when_get_user_orders = action.payload;
      })

      // delete user order
      .addCase(delete_user_order.pending, (state) => {
        state.loading_order.when_delete_user = true;
        state.error_order.when_delete_user = null;
      })

      .addCase(delete_user_order.fulfilled, (state, action) => {
        state.loading_order.when_delete_user = false;
        state.error_order.when_delete_user = action.payload;
      })

      .addCase(delete_user_order.rejected, (state, action) => {
        state.loading_order.when_delete_user = false;
        state.error_order.when_delete_user = action.payload || 'Failed to delete order';
      })
      // get checkout stripe
      .addCase(get_checkout_strip.pending, (state) => {
        state.loading_order.when_stripe = true;
        state.error_order.when_stripe = null;
      })

      .addCase(get_checkout_strip.fulfilled, (state, action) => {
        state.loading_order.when_stripe = false;
        state.error_order.when_stripe = action.payload;
      })

      .addCase(get_checkout_strip.rejected, (state, action) => {
        state.loading_order.when_stripe = false;
        state.error_order.when_stripe = action.payload || 'Failed to delete order';
      })

      // get all orders admin
      .addCase(get_all_orders.pending, (state) => {
        state.loading_order.when_get_all = true;
        state.error_order.when_get_all = null;
      })

      .addCase(get_all_orders.fulfilled, (state, action) => {
        state.loading_order.when_get_all = false;
        state.orders = action.payload;
      })

      .addCase(get_all_orders.rejected, (state, action) => {
        state.loading_order.when_get_all = false;
        state.error_order.when_get_all = action.payload;
      })

      // delete admin order
      .addCase(delete_admin_order.pending, (state) => {
        state.loading_order.when_delete_admin = true;
        state.error_order.when_delete_admin = null;
      })

      .addCase(delete_admin_order.fulfilled, (state, action) => {
        state.loading_order.when_delete_admin = false;
        state.error_order.when_delete_admin = action.payload;
      })

      .addCase(delete_admin_order.rejected, (state, action) => {
        state.loading_order.when_delete_admin = false;
        state.error_order.when_delete_admin = action.payload || 'Failed to delete order';
      })

      // update order is pay
      .addCase(update_order_ispay.pending, (state) => {
        state.loading_order.when_update_pay = true;
        state.error_order.when_update_pay = null;
      })

      .addCase(update_order_ispay.fulfilled, (state, action) => {
        state.loading_order.when_update_pay = false;
        state.error_order.when_update_pay = action.payload;
      })

      .addCase(update_order_ispay.rejected, (state, action) => {
        state.loading_order.when_update_pay = false;
        state.error_order.when_update_pay = action.payload;
      })

      // update order is delivery
      .addCase(update_order_isdelivary.pending, (state) => {
        state.loading_order.when_update_delivery = true;
        state.error_order.when_update_delivery = null;
      })

      .addCase(update_order_isdelivary.fulfilled, (state, action) => {
        state.loading_order.when_update_delivery = false;
        state.error_order.when_update_delivery = action.payload;
      })

      .addCase(update_order_isdelivary.rejected, (state, action) => {
        state.loading_order.when_update_delivery = false;
        state.error_order.when_update_delivery = action.payload;
      });
  }
});

export default order_slice.reducer;
