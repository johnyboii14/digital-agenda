import { type ActionReducerMapBuilder, createSlice } from '@reduxjs/toolkit';
import {
  clearAirings,
  createAirings,
  deleteAiring,
  editAiring,
  filterTableAirings,
  getAdminAirings,
  getAirings,
  getDayAgendaAirings,
  getTableAirings,
  getTotalAirings,
} from '../actions/airings';
import { type Airing, type ReduxStatus } from '../@types';
import {
  ADMIN_NEXT_TABLE_CURSOR_KEY,
  AIRING_TABLE_NEXT_CURSOR_KEY,
} from '../constants';

export type ArrayofProducts = Airing[];

interface AIRING_INITIAL_STATE {
  airings: Airing[];
  adminAirings: Airing[];
  agendaAirings: Airing[];
  agendaCount: number;
  status: ReduxStatus;
  agendaStatus: ReduxStatus;
  error: any;
  airingTotal: number;
  pageTotal: number;
  numOfAiringsToday: number;
  numOfInfomericalsToday: number;
  numOfShoppingBlocksToday: number;
  tableAirings: Airing[];
  tableStatus: ReduxStatus;
}

const initialState: AIRING_INITIAL_STATE = {
  airings: [],
  agendaAirings: [],
  agendaCount: 0,
  agendaStatus: 'idle',
  adminAirings: [],
  status: 'idle',
  error: null,
  airingTotal: 0,
  pageTotal: 0,
  numOfAiringsToday: 0,
  numOfInfomericalsToday: 0,
  numOfShoppingBlocksToday: 0,
  tableAirings: [],
  tableStatus: 'idle',
};

const airingsSlice = createSlice({
  name: 'airings',
  initialState,
  reducers: {},

  extraReducers(builder: ActionReducerMapBuilder<AIRING_INITIAL_STATE>) {
    builder.addCase(getAirings.rejected, (_state, action) => ({
      ...initialState,
      status: 'failed',
      error: action,
    }));
    builder.addCase(getAirings.fulfilled, (_state, action) => ({
      ...initialState,
      status: 'succeeded',
      airings: action.payload.data,
      error: null,
    }));

    builder.addCase(getDayAgendaAirings.pending, (state) => {
      state.agendaStatus = 'pending';
    });

    builder.addCase(getDayAgendaAirings.fulfilled, (state, action) => {
      state.agendaStatus = 'succeeded';
      state.agendaAirings = action.payload.airings;
      state.agendaCount = action.payload.airing_count;
    });

    builder.addCase(getAdminAirings.pending, (state) => {
      state.status = 'pending';
    });

    builder.addCase(getAdminAirings.rejected, () => ({
      ...initialState,
      status: 'failed',
    }));

    builder.addCase(getAdminAirings.fulfilled, (state, action) => {
      state.status = 'succeeded';
      localStorage.setItem(
        ADMIN_NEXT_TABLE_CURSOR_KEY,
        action.payload.data.nextCursor
      );
      state.adminAirings = action.payload.data.airings;
      state.airingTotal = action.payload.data.totalCount;
      state.numOfAiringsToday = action.payload.data.numOfAiringsToday;
      state.numOfInfomericalsToday = action.payload.data.numOfInfomercialsToday;
      state.numOfShoppingBlocksToday = action.payload.data.numOfShoppingBlocksToday;
      state.error = null;
    });

    builder.addCase(getTotalAirings.fulfilled, (state, action) => {
      state.airingTotal = action.payload.total;
    });

    builder.addCase(getTableAirings.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.pageTotal = action.payload.pageTotal;
      state.tableAirings = action.payload.airings;
    });

    builder.addCase(filterTableAirings.fulfilled, (state, action) => {
      state.status = 'succeeded';
      localStorage.setItem(
        AIRING_TABLE_NEXT_CURSOR_KEY,
        action.payload.nextCursor
      );
      state.airingTotal = action.payload.totalCount;
      state.tableAirings = action.payload.airings;
    });

    builder.addCase(createAirings.fulfilled, (state, action) => {
      const { airing } = action.payload;
      state.airings = [...state.airings, airing]; // ✅ Immutable update
    });

    builder.addCase(deleteAiring.fulfilled, (state, action) => {
      const airingId = action.payload;
      state.airings = state.airings.filter((airing) => airing.ID !== airingId); // ✅ Filter for immutability
    });

    builder.addCase(clearAirings.fulfilled, () => ({
      ...initialState,
    }));

    builder.addCase(editAiring.fulfilled, (state, action) => {
      const updatedAiring = action.payload as Airing;
      state.airings = state.airings.map((airing) =>
        airing.ID === updatedAiring.ID ? { ...airing, ...updatedAiring } : airing
      ); // ✅ Immutable update using map
    });
  },
});

export default airingsSlice.reducer;
