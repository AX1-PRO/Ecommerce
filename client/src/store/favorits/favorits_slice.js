import { createSlice } from '@reduxjs/toolkit';
import { create_fav,delete_fav,get_favorits } from './favorits_api';
let initialState = {
  loading_favorits: {
    when_create: false,
    when_getall: false,
    when_delete: false,
  },
  favorites : [],
  error_favorits: {
    when_create: null,
    when_getall: null,
    when_delete: null,
  },

};
export let favorits_slice = createSlice({
  name: 'fav',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //create fav
    builder
      .addCase(create_fav.pending, (state) => {
        ((state.loading_favorits.when_create = true),
         (state.error_favorits.when_create = null));
      })
      .addCase(create_fav.fulfilled, (state, action) => {
        ((state.loading_favorits.when_create = false),
        (state.error_favorits.when_create = action.payload));
      })
      .addCase(create_fav.rejected, (state, action) => {
        state.loading_favorits.when_create = false;
        state.error_favorits.when_create = action.payload || 'Something went wrong';
      })
      //get all fav
      .addCase(get_favorits.pending, (state) => {
        state.loading_favorits.when_getall = true;
        state.error_favorits.when_getall = null;
      })
      .addCase(get_favorits.fulfilled, (state, action) => {
        state.loading_favorits.when_getall = false;
        state.favorites  = action.payload;
      })
      .addCase(get_favorits.rejected, (state, action) => {
        state.loading_favorits.when_getall = false;
        state.error_favorits.when_getall = action.payload;
      })
      //delete fav
      .addCase(delete_fav.pending, (state) => {
        state.loading_favorits.when_delete = true;
        state.loading_favorits.when_delete = null;
      })
      .addCase(delete_fav.fulfilled, (state, action) => {
        state.loading_favorits.when_delete = false;
        state.error_favorits.when_delete = action.payload;
      })
      .addCase(delete_fav.rejected, (state, action) => {
        state.loading_favorits.when_delete = false;
        state.error_favorits.when_delete = action.payload || 'Failed to delete user';
      })

  }
});
export default favorits_slice.reducer;
