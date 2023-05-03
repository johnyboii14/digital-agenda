
import { ActionReducerMapBuilder, createSlice } from "@reduxjs/toolkit";
import {
  clearAirings,
  createAirings,
  deleteAiring,
  editAiring,
  getAirings,
} from "../actions/airings";
import { Airing } from "../@types";

export type ArrayofProducts = Array<Airing>;

interface AIRING_INITIAL_STATE {
  airings: Array<Airing>;
  status: "idle" | "pending" | "succeeded" | "failed";
  error: any;
}

const initialState: AIRING_INITIAL_STATE = {
  airings: [],
  status: "idle",
  error: null,
};

const airingsSlice = createSlice({
  name: "airings",
  initialState,
  reducers: {},

  extraReducers(builder: ActionReducerMapBuilder<AIRING_INITIAL_STATE>) {
    builder.addCase(getAirings.rejected, (_state, action) => ({
      ...initialState,
      status: "failed",
      error: action,
    }));
    builder.addCase(getAirings.fulfilled, (_state, action) => ({
      status: "succeeded",
      airings: action.payload.data,
      error: null,
    }));
    builder.addCase(createAirings.fulfilled, (state, action) => {
      const { airing } = action.payload;
      const newArr = JSON.parse(JSON.stringify(state.airings));
      newArr.push(airing);
      state.airings = newArr;
    });
    builder.addCase(deleteAiring.fulfilled, (state, action) => {
      const airingId = action.payload;
      const newArr = JSON.parse(JSON.stringify(state.airings));
      const airingIdx = state.airings.find((p) => p.ID === airingId);
      newArr.splice(airingIdx, 1);
      state.airings = newArr;
    });
    builder.addCase(clearAirings.fulfilled, (state) => ({ ...initialState }));
    builder.addCase(editAiring.fulfilled, (state, action) => {
      const airingToEdit: Airing = action.payload as unknown as Airing;
      const newArr = JSON.parse(
        JSON.stringify(state.airings)
      ) as unknown as Array<Airing>;
      const airingIdx = state.airings.findIndex((p) => p.ID === airingToEdit.ID);
      newArr[airingIdx] = airingToEdit;
      state.airings = newArr;
    });
  },
});

export default airingsSlice.reducer;
