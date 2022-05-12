import {createSlice} from '@reduxjs/toolkit';

export const authReducer = createSlice({
  name: 'auth',
  initialState: {
    token: 0,
    userInfo: {},
    isLogin: false,
  },
  reducers: {
    logIn: (state, action) => {
      state.userInfo = action?.payload?.user;
      state.isLogin = true;
    },
    logOut: (state, action) => {
      state.userInfo = {};
      state.isLogin = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const {logIn, logOut} = authReducer.actions;

export default authReducer.reducer;
