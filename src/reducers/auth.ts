import { ActionReducerMapBuilder, createSlice } from "@reduxjs/toolkit";
import { signIn } from "../actions/auth";

interface AUTH_INITIAL_STATE {
  status: "idle" | "pending" | "succeeded" | "failed";
  error: any;
  isAuthorized: boolean;
}

const initialState: AUTH_INITIAL_STATE = {
  status: "idle",
  error: null,
  isAuthorized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers(builder: ActionReducerMapBuilder<AUTH_INITIAL_STATE>) {
    builder.addCase(signIn.fulfilled, (_state, _action) => ({
      isAuthorized: true,
      error: null,
      status: "succeeded",
    }));
  },
});

export default authSlice.reducer;
