// import counterReducer from './counter';
import loggedReducer from './isLogged';
import { combineReducers } from 'redux';

// combined reducers
const allReducers = combineReducers({
    // counter: counterReducer, // name whatev we want or just write this: counterReducer
    // add other reducers to be combined
    isLogged: loggedReducer 
});

export default allReducers;