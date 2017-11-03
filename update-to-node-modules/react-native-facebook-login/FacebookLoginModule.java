 /** 
  * Replace logout method in 
  * /node_modules/react-native-facebook-login/android/src/main/java/com/magus/fblogin/FacebookLoginModule.java
  */
 
 @ReactMethod
    public void logout(final Callback callback) {
        WritableMap map = Arguments.createMap();

        mTokenCallback = callback;

        if (AccessToken.getCurrentAccessToken() == null) {
            return; // already logged out
        }

        new GraphRequest(AccessToken.getCurrentAccessToken(), "/me/permissions/", null, HttpMethod.DELETE, new GraphRequest.Callback() {
            @Override
            public void onCompleted(GraphResponse graphResponse) {

                LoginManager.getInstance().logOut();
                map.putString("message", "Facebook Logout executed");
                map.putString("eventName", "onLogout");
                consumeCallback(CALLBACK_TYPE_SUCCESS, map);

            }
        }).executeAsync();

      
    }