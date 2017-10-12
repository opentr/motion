import { combineReducers, createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";

import mapReducer from "./mapReducer";
import orderingReducer from "./orderingReducer";

const reducers = combineReducers({
  map: mapReducer,
  ordering: orderingReducer
});

const store = createStore(reducers, {}, applyMiddleware(thunkMiddleware));

export default store;
