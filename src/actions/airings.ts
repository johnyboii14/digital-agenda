import axios, { type AxiosError, type AxiosResponse } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

import apiUrl from '../constants/apiUrl';
import {
  type AiringUpdateData,
  type BulkCreateAiringBody,
  type CreateAiringBody,
} from '../@types';
import {
  ADMIN_ROWS_PER_PAGE_KEY,
  ADMIN_TABLE_CURSOR_KEY,
  AIRING_TABLE_CURSOR_KEY,
  AIRING_TABLE_ROWS_PER_PAGE_KEY,
  DEFAULT_PER_PAGE,
  DEFAULT_CURSOR,
} from '../constants';

const url = `${apiUrl}/airings/`;

export const GET_AIRINGS = 'GET_AIRINGS';
export const getAirings = createAsyncThunk(GET_AIRINGS, async () => {
  const res: AxiosResponse = await axios.get(url);
  return res.data;
});

export const CREATE_AIRING = 'CREATE_AIRING';
export const createAirings = createAsyncThunk(
  CREATE_AIRING,
  async (airingData: CreateAiringBody) => {
    const res: AxiosResponse = await axios.post(url, airingData);
    return res.data;
  }
);
export const DELETE_AIRING = 'DELETE_AIRING';
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

export const clearAirings = createAsyncThunk('CLEAR_AIRINGS', async () => null);

export const GET_AIRING = 'GET_AIRING';
export const getAiring = createAsyncThunk(
  GET_AIRING,
  async (id: string | number) => {
    const res: AxiosResponse = await axios.get(`${url}/${id}`);
    return res.data;
  }
);

export const EDIT_AIRING = 'EDIT_AIRING';
export const editAiring = createAsyncThunk(
  EDIT_AIRING,
  async (airingToEdit: AiringUpdateData, { rejectWithValue }) => {
    try {
      const { ID: airingId, ...airingBody } = airingToEdit;
      await axios.put(`${url}/${airingId}`, airingBody);
      return airingBody;
    } catch (err) {
      return rejectWithValue({ data: err });
    }
  }
);

export const GET_ADMIN_AIRINGS = 'GET_ADMIN_AIRINGS';
export const getAdminAirings = createAsyncThunk(
  GET_ADMIN_AIRINGS,
  async (_, { rejectWithValue }) => {
    try {
      let cursor = localStorage.getItem(ADMIN_TABLE_CURSOR_KEY);
      let pageSize = localStorage.getItem(ADMIN_ROWS_PER_PAGE_KEY);
      if (cursor === '' || cursor === undefined || cursor === null) {
        cursor = DEFAULT_CURSOR;
      }

      if (pageSize === '' || pageSize === undefined || pageSize === null) {
        pageSize = DEFAULT_PER_PAGE;
      }

      const adminUrl = `${url}admin?cursor=${cursor}&pageSize=${pageSize}`;
      const res: AxiosResponse = await axios.get(adminUrl);
      return {
        data: res.data,
        cursor,
      };
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue({ data: error });
    }
  }
);

export const GET_TABLE_AIRINGS = 'GET_TABLE_AIRINGS';
export const getTableAirings = createAsyncThunk(
  GET_TABLE_AIRINGS,
  async (_, { rejectWithValue }) => {
    try {
      let cursor = localStorage.getItem(AIRING_TABLE_CURSOR_KEY);
      let pageSize = localStorage.getItem(AIRING_TABLE_ROWS_PER_PAGE_KEY);
      if (cursor === '' || cursor === undefined || cursor === null) {
        cursor = DEFAULT_CURSOR;
      }

      if (pageSize === '' || pageSize === undefined || pageSize === null) {
        pageSize = DEFAULT_PER_PAGE;
      }

      const adminUrl = `${url}table?cursor=${cursor}&pageSize=${pageSize}`;
      const res: AxiosResponse = await axios.get(adminUrl);
      return {
        data: res.data,
        cursor,
      };
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue({ data: error });
    }
  }
);

export const GET_DAY_AGENDA_DAY_AIRING = 'GET_AGENDA_DAY_AIRING ';
export const getDayAgendaAirings = createAsyncThunk(
  GET_DAY_AGENDA_DAY_AIRING,
  async (dayToQuery: string, { rejectWithValue }) => {
    try {
      const dayUrl = `${url}agenda/day?day=${dayToQuery}`;
      const res: AxiosResponse = await axios.get(dayUrl);
      return res.data;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue({ data: error });
    }
  }
);

export const UPDATE_ADMIN_ROWS_PER_PAGE = 'UPDATE_ADMIN_ROWS_PER_PAGE';
export const updateAdminRowsPerPage = createAsyncThunk(
  UPDATE_ADMIN_ROWS_PER_PAGE,
  async (rowsPerPage: number) => rowsPerPage
);

export const UPDATE_CURSOR = 'UPDATE_CURSOR';
export const updateCursor = createAsyncThunk(
  UPDATE_CURSOR,
  async (cursor: number) => cursor
);

export const BULK_CREATE_AIRINGS = 'BULK_CREATE_AIRINGS';
export const bulkCreateAirings = createAsyncThunk(
  BULK_CREATE_AIRINGS,
  async (airings: BulkCreateAiringBody, { rejectWithValue }) => {
    try {
      const res: AxiosResponse = await axios.post(`${url}bulk`, airings);
      return res.data;
    } catch (err) {
      return rejectWithValue({ data: err });
    }
  }
);
