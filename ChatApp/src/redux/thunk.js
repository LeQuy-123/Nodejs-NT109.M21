import {logIn, logOut} from './authSlice';
import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {
  allUsersRoute,
  loginRoute,
  recieveMessageRoute,
  registerRoute,
} from '../utils/APIRoutes';
import {store} from '../redux/store';
export function logout() {
  return async function (dispatch, getState) {
    dispatch(logOut());
  };
}

const login = createAsyncThunk('users/fetchLogin', async (value, thunkAPI) => {
  const response = await axios.post(loginRoute, {
    username: value?.userName,
    password: value?.password,
  });
  if (response.status !== 200) {
    return thunkAPI.rejectWithValue({error: 'Server error'});
  }
  if (response.status === 200) {
    if (response.data?.status) {
      thunkAPI.dispatch(logIn(response.data));
      return thunkAPI.fulfillWithValue(response.data);
    } else {
      return thunkAPI.rejectWithValue({error: response.data?.msg});
    }
  }
});

const register = createAsyncThunk(
  'users/fetchRegister',
  async (value, thunkAPI) => {
    const response = await axios.post(registerRoute, {
      username: value?.userName,
      email: value?.email,
      password: value?.password,
    });
    console.log('🚀 ~ file: thunk.js ~ line 38 ~ response', response);
    if (response.status !== 200) {
      return thunkAPI.rejectWithValue({error: 'Server error'});
    }
    if (response.status === 200) {
      if (response.data?.status) {
        return thunkAPI.fulfillWithValue(response.data);
      } else {
        return thunkAPI.rejectWithValue({error: response.data?.msg});
      }
    }
  },
);

const getContacts = createAsyncThunk(
  'users/getContacts',
  async (value, thunkAPI) => {
    const id = store.getState().authReducer.userInfo?._id;
    const response = await axios.get(`${allUsersRoute}/${id}`);
    if (response.status !== 200) {
      return thunkAPI.rejectWithValue({error: 'Server error'});
    }
    if (response.status === 200) {
      return thunkAPI.fulfillWithValue(response.data);
    }
  },
);

const getChatList = createAsyncThunk(
  'users/getContacts',
  async (userId, thunkAPI) => {
    const id = store.getState().authReducer.userInfo?._id;
    const response = await axios.post(recieveMessageRoute, {
      from: id,
      to: userId,
    });
    if (response.status !== 200) {
      return thunkAPI.rejectWithValue({error: 'Server error'});
    }
    if (response.status === 200) {
      return thunkAPI.fulfillWithValue(response.data);
    }
  },
);
export {login, register, getContacts, getChatList};
