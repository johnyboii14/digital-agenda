import { type ActionReducerMapBuilder, createSlice } from '@reduxjs/toolkit';
import {
	clearEvents,
	createEvents,
	deleteEvent,
	editEvent,
	getEvents,
} from '../actions/events';
import { type EVENT, type ReduxStatus } from '../@types';

export type ArrayofProducts = EVENT[];

interface EVENTS_INITIAL_STATE {
	events: EVENT[];
	status: ReduxStatus;
	error: any;
}

const initialState: EVENTS_INITIAL_STATE = {
	events: [],
	status: 'idle',
	error: null,
};

const eventsSlice = createSlice({
	name: 'events',
	initialState,
	reducers: {},

	extraReducers(builder: ActionReducerMapBuilder<EVENTS_INITIAL_STATE>) {
		builder.addCase(getEvents.rejected, (_state, action) => ({
			...initialState,
			status: 'failed',
			error: action,
		}));
		builder.addCase(getEvents.fulfilled, (_state, action) => ({
			status: 'succeeded',
			events: action.payload.data,
			error: null,
		}));
		builder.addCase(createEvents.fulfilled, (state, action) => {
			const { event } = action.payload;
			const newArr = JSON.parse(JSON.stringify(state.events));
			newArr.push(event);
			state.events = newArr;
		});
		builder.addCase(deleteEvent.fulfilled, (state, action) => {
			const eventId = action.payload;
			const newArr = JSON.parse(JSON.stringify(state.events));
			const eventIdx = state.events.find((p) => p.id === eventId);
			newArr.splice(eventIdx, 1);
			state.events = newArr;
		});
		builder.addCase(clearEvents.fulfilled, (state) => ({ ...initialState }));
		builder.addCase(editEvent.fulfilled, (state, action) => {
			const eventToEdit: EVENT = action.payload as unknown as EVENT;
			const newArr = JSON.parse(
				JSON.stringify(state.events),
			) as unknown as EVENT[];
			const eventIdx = state.events.findIndex((p) => p.id === eventToEdit.id);
			newArr[eventIdx] = eventToEdit;
			state.events = newArr;
		});
	},
});

export default eventsSlice.reducer;
