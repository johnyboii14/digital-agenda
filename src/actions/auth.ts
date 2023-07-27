import { createAsyncThunk } from '@reduxjs/toolkit';

import { type ADMIN_USER } from '../@types';

import ADMIN_USERS from '../constants/adminUsers';
import { ADMIN_USERS_DISPLAY_NAME } from '../constants';

export const SIGN_IN = 'SIGN_IN';
export const signIn = createAsyncThunk(
  SIGN_IN,
  async (data: ADMIN_USER, { rejectWithValue }) => {
    try {
      const { username, password } = data;
      if (username === '' && username.length < 3) {
        return false;
      }

      if (password.length === 0 && password.length < 3) {
        return false;
      }

      const userIndex = ADMIN_USERS.findIndex(
        (user) => user.username.toLocaleLowerCase() === username.toLowerCase()
      );
      if (userIndex > -1) {
        if (
          ADMIN_USERS[userIndex].password.toLowerCase() ===
          password.toLowerCase()
        ) {
          const loginName = ADMIN_USERS[userIndex].username;
          const displayName = ADMIN_USERS_DISPLAY_NAME[loginName];
          if (displayName !== undefined || displayName !== null) {
            localStorage.setItem('username', displayName);
          } else {
            localStorage.setItem('username', loginName);
          }
          return true;
        }

        return false;
      }

      return false;
    } catch (err) {
      return rejectWithValue({ data: false });
    }
  }
);

export const SIGN_OUT = 'SIGN_OUT';
export const signOut = (): void => {
  localStorage.removeItem('username');
};
