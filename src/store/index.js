import { combineReducers, createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";

// reducer connected to map state
import mapReducer from "./mapReducer";
// reducer connected to ordering process state
import orderingReducer from "./orderingReducer";

// combine redux reducers
const reducers = combineReducers({
  map: mapReducer,
  ordering: orderingReducer
});

// create redux store with combined reducers and middleware
const store = createStore(reducers, {}, applyMiddleware(thunkMiddleware));

export default store;
