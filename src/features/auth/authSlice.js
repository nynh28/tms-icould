import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

// Get user from localStorage
const user = JSON.parse(localStorage.getItem("user"));
const token = JSON.parse(localStorage.getItem("token"));
const refreshToken = JSON.parse(localStorage.getItem("refreshToken"));

const initialState = {
  user: user ? user : null,
  token: token ? token : null,
  refreshToken: refreshToken ? refreshToken : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Login user
export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
  try {
    return await authService.login(user);
  } catch (error) {
    let message = "";
    // console.log(error)
    // if(error.response.data.status === 401){
    //   message = "Username or Password is incorrect"
    // }
    if(error.response.data.status === 500){
      message = "Cannot connect to server. Please try again later!"
    }else{
      message = error?.response?.data?.title || 'Username or Password is incorrect'
    }
    return thunkAPI.rejectWithValue(message);
  }
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      window.location = "/login";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
      });
  },
});

export const { reset, logout } = authSlice.actions;
export default authSlice.reducer;
