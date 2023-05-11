import { ActionReducerMapBuilder, createSlice } from "@reduxjs/toolkit";
import { signIn } from "../actions/auth";
import { REDUX_STATUS } from "../@types";

interface AUTH_INITIAL_STATE {
  status: REDUX_STATUS;
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
