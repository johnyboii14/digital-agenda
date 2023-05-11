import { ActionReducerMapBuilder, createSlice } from "@reduxjs/toolkit";
import {
  clearAirings,
  createAirings,
  deleteAiring,
  editAiring,
  getAdminAirings,
  getAirings,
  getDayAgendaAirings,
} from "../actions/airings";
import { Airing, REDUX_STATUS } from "../@types";
import { ADMIN_NEXT_TABLE_CURSOR_KEY } from "../constants";

export type ArrayofProducts = Array<Airing>;

interface AIRING_INITIAL_STATE {
  airings: Array<Airing>;
  adminAirings: Airing[];
  agendaAirings: Airing[];
  agendaCount: number;
  status: REDUX_STATUS;
  agendaStatus: REDUX_STATUS;
  error: any;
  airingTotal: number;
  numOfAiringsToday: number;
  numOfInfomericalsToday: number;
  numOfShoppingBlocksToday: number;
}

const initialState: AIRING_INITIAL_STATE = {
  airings: [],
  agendaAirings: [],
  agendaCount: 0,
  agendaStatus: "idle",
  adminAirings: [],
  status: "idle",
  error: null,
  airingTotal: 0,
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
    builder.addCase(getDayAgendaAirings.pending, (state) => {
      state.agendaStatus = "pending";
    });
    builder.addCase(getDayAgendaAirings.fulfilled, (state, action) => {
      state.agendaStatus = "succeeded";
      state.agendaAirings = action.payload.airings;
      state.agendaCount = action.payload.airing_count;
    });
    builder.addCase(getAdminAirings.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(getAdminAirings.rejected, (state) => {
      state = initialState;
      state.status = "failed";
    });
    builder.addCase(getAdminAirings.fulfilled, (state, action) => {
      state.status = "succeeded";
      localStorage.setItem(
        ADMIN_NEXT_TABLE_CURSOR_KEY,
        action.payload.data.nextCursor
      );
      state.adminAirings = action.payload.data.airings;
      state.airingTotal = action.payload.data.totalCount;
      state.numOfAiringsToday = action.payload.data.numOfAiringsToday;
      state.numOfInfomericalsToday = action.payload.data.numOfInfomercialsToday;
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
    builder.addCase(clearAirings.fulfilled, () => ({ ...initialState }));
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
