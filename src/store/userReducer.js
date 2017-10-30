import { FBLogin, FBLoginManager } from "react-native-facebook-login";
import { GoogleSignin } from "react-native-google-signin";
import firebase from "react-native-firebase";
import { REHYDRATE } from "redux-persist/constants";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";

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
  [LOGIN_SUCCESS]: (state, action) => ({ ...state, ...action.payload })
};

const initialState = {
  loggedIn: false
};
export default function rehydrateReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
