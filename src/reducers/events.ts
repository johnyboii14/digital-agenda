import { ActionReducerMapBuilder, createSlice } from "@reduxjs/toolkit";
import {
  clearEvents,
  createEvents,
  deleteEvent,
  editEvent,
  getEvents,
} from "../actions/events";
import { EVENT } from "../@types";

interface EVENTS_INITIAL_STATE {
  events: Array<EVENT>;
  status: "idle" | "pending" | "succeeded" | "failed";
  error: any;
}

const initialState: EVENTS_INITIAL_STATE = {
  events: [],
  status: "idle",
  error: null,
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {},

  extraReducers(builder: ActionReducerMapBuilder<EVENTS_INITIAL_STATE>) {
    builder.addCase(getEvents.rejected, (_state, action) => ({
      ...initialState,
      status: "failed",
      error: action,
    }));
  },
});
