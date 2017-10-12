import { combineReducers, createStore } from "redux";

import mapReducer from "./mapReducer";
import orderingReducer from "./orderingReducer";

const reducers = combineReducers({
  map: mapReducer,
  ordering: orderingReducer
});

const store = createStore(reducers);

export default store;
