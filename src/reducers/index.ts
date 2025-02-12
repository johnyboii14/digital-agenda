import { combineReducers } from 'redux';

import airings from './airings';
import auth from './auth';

const rootReducer = combineReducers({
	airings, auth,
});

export default rootReducer;
