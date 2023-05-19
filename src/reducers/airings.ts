import { ActionReducerMapBuilder, createSlice } from "@reduxjs/toolkit";
import {
  clearAirings,
  createAirings,
  deleteAiring,
  editAiring,
  getAdminAirings,
  getAirings,
  getAirings2,
  updateCursor,
} from "../actions/airings";
import { Airing } from "../@types";
import { BuildCircleRounded } from "@mui/icons-material";

export type ArrayofProducts = Array<Airing>;

interface AIRING_INITIAL_STATE {
  airings: Array<Airing>;
  adminAirings: Airing[];
  cursor: number;
  previousCursor: number;
  nextCursor: number;
  status: "idle" | "pending" | "succeeded" | "failed";
  error: any;
  airingTotal: number;
  rowsPerPage: number;
  numOfAiringsToday: number;
  numOfInfomericalsToday: number;
  numOfShoppingBlocksToday: number;
}

const initialState: AIRING_INITIAL_STATE = {
  cursor: 1,
  nextCursor: 1,
  previousCursor: 1,
  airings: [],
  adminAirings: [],
  status: "idle",
  error: null,
  airingTotal: 0,
  rowsPerPage: 25,
  numOfAiringsToday: 0,
  numOfInfomericalsToday: 0,
  numOfShoppingBlocksToday: 0,
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
      ...initialState,
      status: "succeeded",
      airings: action.payload.data,
      error: null,
    }));
    builder.addCase(getAirings2.fulfilled, (_state, action) => ({
      ...initialState,
      status: "succeeded",
      airings: action.payload.data,
      error: null,
    }));
    builder.addCase(getAdminAirings.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.previousCursor = state.cursor;
      state.cursor = action.payload.cursor;
      state.nextCursor = action.payload.data.nextCursor;
      state.adminAirings = action.payload.data.airings;
      state.airingTotal = action.payload.data.totalCount;
      state.numOfAiringsToday = action.payload.data.numOfAiringsToday;
      state.numOfInfomericalsToday = action.payload.data.numOfInfomericalsToday;
      state.numOfShoppingBlocksToday =
        action.payload.data.numOfShoppingBlocksToday;
      state.error = null;
    });
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
    builder.addCase(updateCursor.fulfilled, (state, action) => {
      state.cursor = action.payload;
    });
    builder.addCase(editAiring.fulfilled, (state, action) => {
      const airingToEdit: Airing = action.payload as unknown as Airing;
      const newArr = JSON.parse(
        JSON.stringify(state.airings)
      ) as unknown as Array<Airing>;
      const airingIdx = state.airings.findIndex(
        (p) => p.ID === airingToEdit.ID
      );
      newArr[airingIdx] = airingToEdit;
      state.airings = newArr;
    });
  },
});

export default airingsSlice.reducer;
