import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../api";

const initialState = {
  masterDatas: [],
  status: "idle", // idle || loading || successed || failed
  error: null,
};

export const fetchMasterDatas = createAsyncThunk(
  "masterDatas/fetchMasterDatas",
  async (type, { rejectWithValue }) => {
    try {
      const response = await api.fetchMasterData("TRUCK,CARGO,UNIT,VEHICLETYPE");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data.error);
    }
  }
);

export const masterDatasSlice = createSlice({
  name: "masterDatas",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchMasterDatas.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMasterDatas.fulfilled, (state, action) => {
        state.status = "successed";
        state.masterDatas = action.payload;
      })
      .addCase(fetchMasterDatas.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default masterDatasSlice.reducer;
