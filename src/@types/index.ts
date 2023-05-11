export type REDUX_STATUS = "idle" | "pending" | "succeeded" | "failed";
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

export interface ADMIN_USER {
  username: string;
  password: string;
}

export enum SNACKBAR_STATUSES {
  "SUCCESS" = "success",
  "ERROR" = "error",
  "WARNING" = "warning",
  "INFO" = "info",
}

export type SortKey = "date" | "boolean" | "string" | "numeric" | "";

export interface HeaderHash {
  [key: string]: SortKey;
}

export type AiringType = "Infomercial" | "ShoppingBlock";

export interface Airing {
  ID: string;
  airing_id: string;
  type: AiringType;
  station: string;
  airing_time: string;
  show: string;
  item_number: string;
  item_name: string;
  price: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string;
}

export type CreateAiringBody = Omit<
  Airing,
  "ID" | "CreatedAt" | "DeletedAt" | "UpdatedAt"
>;

export type AiringFormData = CreateAiringBody;

export type AiringUpdateData = Omit<
  Airing,
  "CreatedAt" | "DeletedAt" | "UpdatedAt" | "UpdatedAt"
>;

export type BulkCreateAiringBody = {
  data: Array<CreateAiringBody>;
  user: string;
};

export interface AdminAiringParams {
  cursor: number;
  pageSize: number;
}

export interface AiringCSVData {
  AiringID: string;
  Type: string;
  Station: string;
  "Date (PST)": string;
  TimePST: string;
  SHOW: string;
  ItemNumber: string;
  Item: string;
  Price: string;
}

export interface AgendaAiring extends Airing {
  end_date: Date;
  airing_start_date: Date;
}
