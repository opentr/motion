import { REHYDRATE } from "redux-persist/constants";
// export const SIGNIN_SUCCESS = "SIGNIN_SUCCESS";
// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [REHYDRATE]: (state, action) => ({
    done: true
  })
  // [SIGNIN_SUCCESS]: (state, action) => ({ done: true })
};

// ------------------------------------ Reducer
// ------------------------------------
const initialState = {
  done: false
};
export default function rehydrateReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
