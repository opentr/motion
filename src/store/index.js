import { compose, combineReducers, createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { persistStore, autoRehydrate } from "redux-persist";
import { AsyncStorage } from "react-native";

// reducer connected to rehydrate from redux-persist
// this enables us to wait for data about user and app to load first
import rehydrateReducer from "./rehydrateReducer";
// reducer connected to map state
import mapReducer from "./mapReducer";
// reducer connected to ordering process state
import orderingReducer from "./orderingReducer";

// combine redux reducers
const reducers = combineReducers({
  rehydrate: rehydrateReducer,
  map: mapReducer,
  ordering: orderingReducer
});

// create redux store with combined reducers and middleware
const store = createStore(
  reducers,
  {},
  compose(applyMiddleware(thunkMiddleware), autoRehydrate())
);

// react-native
persistStore(store, { storage: AsyncStorage });

export default store;
