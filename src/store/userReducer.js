import { FBLogin, FBLoginManager } from "react-native-facebook-login";
import { GoogleSignin } from "react-native-google-signin";
import firebase from "react-native-firebase";
import { REHYDRATE } from "redux-persist/constants";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOG_OUT = "LOG_OUT";
export const UPDATE_USER_DATA = "UPDATE_USER_DATA";

export function onLoginReturningUser() {
  return (dispatch, getState) => {
    const user = getState().user;

    if (user.credential) {
      dispatch({
        type: UPDATE_USER_DATA,
        payload: { loadingInProgress: true }
      });

      firebase
        .auth()
        .signInWithCredential(user.credential)
        .then(user => {
          if (user._authObj.authenticated) {
            dispatch({
              type: LOGIN_SUCCESS,
              payload: {
                ...user._user,
                loggedIn: true,
                loadingInProgress: false
              }
            });
          } else {
            dispatch({
              type: UPDATE_USER_DATA,
              payload: {
                error: "login returning user not authenticated: " + error,
                loadingInProgress: false
              }
            });
            dispatch({
              type: LOG_OUT
            });
          }
        })
        .catch(error => {
          dispatch({
            type: UPDATE_USER_DATA,
            payload: {
              error: "login returning user: " + error,
              loadingInProgress: false
            }
          });
          dispatch({
            type: LOG_OUT
          });
        });
    }
  };
}

export function resetErrors() {
  return {
    type: UPDATE_USER_DATA,
    payload: { error: undefined, logoutResult: undefined }
  };
}

export function onLogout() {
  return (dispatch, getState) => {
    console.log("on log out");
    const user = getState().user;

    const result = firebase
      .auth()
      .signOut()
      .then(() => {
        if (user.credential.providerId === "google.com") {
          GoogleSignin.configure({}).then(() => {
            GoogleSignin.hasPlayServices({ autoResolve: true })
              .then(() => {
                GoogleSignin.signOut().then(result => {
                  dispatch({
                    type: UPDATE_USER_DATA,
                    payload: {
                      logoutResult: "google logout: " + result
                    }
                  });
                  dispatch({ type: LOG_OUT });
                });
              })
              .catch(error => {
                dispatch({
                  type: UPDATE_USER_DATA,
                  payload: {
                    error: "error google logout: " + error,
                    loadingInProgress: false
                  }
                });
              });
          });
        } else if (user.credential.providerId === "facebook.com") {
          FBLoginManager.logout((error, data) => {
            if (error) {
              dispatch({
                type: UPDATE_USER_DATA,
                payload: {
                  error: "fb logout error: " + error,
                  loadingInProgress: false
                }
              });
            } else {
              dispatch({
                type: UPDATE_USER_DATA,
                payload: {
                  logoutResult: "fb logout data: " + error,
                  loadingInProgress: false
                }
              });
              dispatch({ type: LOG_OUT });
            }
          });
        }
      })
      .catch(error => {
        dispatch({
          type: UPDATE_USER_DATA,
          payload: {
            error: "logout error: " + error,
            loadingInProgress: false
          }
        });
        dispatch({ type: LOG_OUT });
      });

    // if (user.providerData[0].providerId === "google.com") {
    //   GoogleSignin.configure({}).then(() => {
    //     GoogleSignin.hasPlayServices({ autoResolve: true }).then(() => {
    //       GoogleSignin.signOut().then(result => {
    //         console.log("sign out ", result);
    //       });
    //     });
    //   });
    // }
  };
}

export function onLoginFacebook() {
  return (dispatch, getState) => {
    dispatch({
      type: UPDATE_USER_DATA,
      payload: { loadingInProgress: true }
    });
    console.log("login with facebook");
    FBLoginManager.loginWithPermissions(["email", "public_profile"], function(
      error,
      data
    ) {
      if (!error) {
        console.log("Login data: ", data);
        FBLoginManager.getCredentials(function(error, data) {
          if (!error) {
            console.log("credentials ", data);
          }

          const credential = firebase.auth.FacebookAuthProvider.credential(
            data.credentials.token
          );

          console.log("credential firebase", credential);

          dispatch({
            type: UPDATE_USER_DATA,
            payload: { credential: credential, loadingInProgress: true }
          });

          firebase
            .auth()
            .signInWithCredential(credential)
            .then(user => {
              console.log("user firebase ", user);
              if (user._authObj.authenticated)
                dispatch({
                  type: LOGIN_SUCCESS,
                  payload: {
                    ...user._user,
                    loggedIn: true,
                    loadingInProgress: false
                  }
                });
            })
            .catch(error => {
              dispatch({
                type: UPDATE_USER_DATA,
                payload: {
                  error: "fb login firebase auth error: " + error,
                  loadingInProgress: false
                }
              });
            });
        });
      } else {
        console.log("Error: ", error);
        dispatch({
          type: UPDATE_USER_DATA,
          payload: {
            error: "fb login error: " + error,
            loadingInProgress: false
          }
        });
      }
    });
  };
}

export function onLoginGoogle() {
  return (dispatch, getState) => {
    dispatch({
      type: UPDATE_USER_DATA,
      payload: { loadingInProgress: true }
    });

    console.log("login with google");
    GoogleSignin.configure({})
      .then(() => {
        GoogleSignin.hasPlayServices({ autoResolve: true })
          .then(() => {
            GoogleSignin.signIn()
              .then(user => {
                console.log(user);

                const credential = firebase.auth.GoogleAuthProvider.credential(
                  user.idToken,
                  user.accessToken
                );

                dispatch({
                  type: UPDATE_USER_DATA,
                  payload: { credential: credential, loadingInProgress: true }
                });

                firebase
                  .auth()
                  .signInWithCredential(credential)
                  .then(user => {
                    console.log("user firebase ", user);
                    if (user._authObj.authenticated)
                      dispatch({
                        type: LOGIN_SUCCESS,
                        payload: {
                          ...user._user,
                          loggedIn: true,
                          loadingInProgress: false
                        }
                      });
                  })
                  .catch(error => {
                    dispatch({
                      type: UPDATE_USER_DATA,
                      payload: {
                        error: "google login firebase signin error: " + error,
                        loadingInProgress: false
                      }
                    });
                  });
              })
              .catch(err => {
                console.log("WRONG SIGNIN", err);
                dispatch({
                  type: UPDATE_USER_DATA,
                  payload: {
                    error: "google signin error: " + err,
                    loadingInProgress: false
                  }
                });
              })
              .done();
          })
          .catch(err => {
            console.log("Play services error", err.code, err.message);
          });
      })
      .catch(error => {
        dispatch({
          type: UPDATE_USER_DATA,
          payload: {
            error: "google configure error: " + error,
            loadingInProgress: false
          }
        });
      });
  };
}

const ACTION_HANDLERS = {
  [UPDATE_USER_DATA]: (state, action) => ({
    ...state,
    ...action.payload
  }),
  [LOG_OUT]: (state, action) => ({
    loggedIn: false
  }),
  [LOGIN_SUCCESS]: (state, action) => ({ ...state, ...action.payload }),
  [REHYDRATE]: (state, action) => {
    let incoming = action.payload.user;
    if (incoming) {
      incoming.loadingInProgress = false;

      if (incoming.credential && incoming.loggedIn) {
        incoming.loginOnStart = true;
      }

      return {
        ...state,
        ...incoming
      };
    }
    return state;
  }
};

const initialState = {
  loggedIn: false
};
export default function userReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
