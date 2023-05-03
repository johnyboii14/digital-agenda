import axios, { AxiosResponse } from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

import apiUrl from "../constants/apiUrl";
import { Airing, CreateAiringBody } from "../@types";

const url = `${apiUrl}/airings`;

export const GET_AIRINGS = "GET_AIRINGS";
export const getAirings = createAsyncThunk(GET_AIRINGS, async () => {
  const res: AxiosResponse = await axios.get(url);
  return res.data;
});

export const CREATE_AIRING = "CREATE_AIRING";
export const createAirings = createAsyncThunk(
  CREATE_AIRING,
  async (airingData: CreateAiringBody) => {
    const res: AxiosResponse = await axios.post(url, airingData);
    return res.data;
  }
);
export const DELETE_AIRING = "DELETE_AIRING";
export const deleteAiring = createAsyncThunk(
  DELETE_AIRING,
  async (airingId: number | string) => {
    try {
      await axios.delete(`${url}/${airingId}`);
      return airingId;
    } catch (err) {
      return false;
    }
  }
);

export const clearAirings = createAsyncThunk("CLEAR_AIRINGS", async () => null);

export const GET_AIRING = "GET_AIRING";
export const getAiring = createAsyncThunk(
  GET_AIRING,
  async (id: string | number) => {
    const res: AxiosResponse = await axios.get(`${url}/${id}`);
    return res.data;
  }
);

export const EDIT_AIRING = "EDIT_AIRING";
export const editAiring = createAsyncThunk(
  EDIT_AIRING,
  async (airingToEdit: Airing) => {
    try {
      const { ID: airingId, ...airingBody } = airingToEdit;
      await axios.put(`${url}/${airingId}`, airingBody);
      return airingBody;
    } catch (err) {
      return null;
    }
  }
);
