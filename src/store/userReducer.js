import { FBLogin, FBLoginManager } from "react-native-facebook-login";
import { GoogleSignin } from "react-native-google-signin";
import firebase from "react-native-firebase";
import { REHYDRATE } from "redux-persist/constants";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOG_OUT = "LOG_OUT";
export const UPDATE_USER_DATA = "UPDATE_USER_DATA";

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
            GoogleSignin.hasPlayServices({ autoResolve: true }).then(() => {
              GoogleSignin.signOut();
            });
          });
        } else if (user.credential.providerId === "facebook.com") {
          FBLoginManager.logout((error, data) => {})
            .then(data => {})
            .catch(error => {
              console.log(error);
            });
        }
        dispatch({ type: LOG_OUT });
      })
      .catch(error => {
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

export function onLoginReturningUser() {
  return (dispatch, getState) => {
    const user = getState().user;
    if (user.credential) {
      firebase
        .auth()
        .signInWithCredential(user.credential)
        .then(user => {
          console.log("user firebase ", user);
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
              type: LOG_OUT
            });
          }
        });
    }
  };
}

export function onLoginFacebook() {
  return (dispatch, getState) => {
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
        });

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
                payload: { ...user._user, loggedIn: true }
              });
          });
      } else {
        console.log("Error: ", error);
      }
    });
  };
}

export function onLoginGoogle() {
  return (dispatch, getState) => {
    console.log("login with google");
    GoogleSignin.configure({}).then(() => {
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
                });
            })
            .catch(err => {
              console.log("WRONG SIGNIN", err);
            })
            .done();
        })
        .catch(err => {
          console.log("Play services error", err.code, err.message);
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
