export interface EVENT {
  id: number;
  event_description: string;
  event_type: string;
  event_show: string;
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

export type SortKey = "date" | "boolean" | "string" | "numeric" | "";

export interface HeaderHash {
  [key: string]: SortKey;
}
