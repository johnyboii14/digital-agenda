import axios, { AxiosResponse } from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

import apiUrl from "../constants/apiUrl";
import { EVENT, EVENT_REQUEST } from "../@types";

const url = `${apiUrl}/events`;

export const GET_EVENTS = "GET_EVENTS";
export const getEvents = createAsyncThunk(GET_EVENTS, async () => {
  const res: AxiosResponse = await axios.get(url);
  return res.data;
});

export const CREATE_EVENT = "CREATE_EVENT";
export const createEvents = createAsyncThunk(
  CREATE_EVENT,
  async (eventData: EVENT_REQUEST) => {
    const res: AxiosResponse = await axios.post(url, eventData);
    return res.data;
  }
);
export const DELETE_EVENT = "DELETE_EVENT";
export const deleteEvent = createAsyncThunk(
  DELETE_EVENT,
  async (eventId: number | string) => {
    try {
      await axios.delete(`${url}/${eventId}`);
      return eventId;
    } catch (err) {
      return false;
    }
  }
);

export const clearEvents = createAsyncThunk("CLEAR_EVENTS", async () => null);

export const GET_EVENT = "GET_EVENT";
export const getEvent = createAsyncThunk(
  GET_EVENT,
  async (id: string | number) => {
    const res: AxiosResponse = await axios.get(`${url}/${id}`);
    return res.data;
  }
);

export const EDIT_EVENT = "EDIT_EVENT";
export const editEvent = createAsyncThunk(
  EDIT_EVENT,
  async (eventToEdit: EVENT) => {
    try {
      const { id: eventId, ...eventBody } = eventToEdit;
      await axios.put(`${url}/${eventId}`, eventBody);
      return eventBody;
    } catch (err) {
      return null;
    }
  }
);
