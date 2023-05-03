import { combineReducers } from "redux";

import airings from "./airings";
import events from "./events";

const rootReducer = combineReducers({
  airings,
  events,
});

export default rootReducer;
