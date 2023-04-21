export interface EVENT {
  id: number;
  event_description: string;
  event_type: string;
  item_no: string;
  station: string;
  airing_id: string;
  airtime: string | Date;
  updated_at: string | Date;
  created_at: string | Date;
  price: number;
}

export type UPDATE_EVENT_REQUEST = EVENT;

export type EVENT_REQUEST = Omit<UPDATE_EVENT_REQUEST, "id">;

export interface REACT_EVENT {
  data: EVENT;
}

export interface ADMIN_USER {
  username: string;
  password: string;
}

export enum SNACKBAR_STATUSES {
  "SUCCESS" = "success",
  "ERROR" = "error",
}
