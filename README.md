#  Motion - Open Source Mobile App in React Native based on OpenTransport API


## How to Setup

**Step 1:** git clone this repo:

**Step 2:** cd to the cloned repo:

**Step 3:** Install the Application with `npm install`

**Step 4:** Add your OpenTransport and Google API keys at `src/config/config.js`

**Step 5:** Edit sources of node modules specified here

**iOS react-native-maps fix** 

This is a fix for some markers staying in top left corner of a screen. To fix the issue edit 
`node_modules/react-native-maps/lib/ios/AirMaps/AIRMapMarker.m`

```
// comment out this line
// CGPoint center = (CGPoint){ self.center.x, self.center.y - dy };

// and add this line
CGPoint center = (CGPoint){ self.center.x -100, self.center.y - dy };
```

***Android fix for logging out of Facebook***

This is a fix for Facebook log out. Apply change below to make user fully log out when using Facebook login.

edit `node_modules/react-native-facebook-login/android/src/main/java/com/magus/fblogin/FacebookLoginModule.java`

replace `logout` function
```
@ReactMethod
public void logout(final Callback callback) {
    
    mTokenCallback = callback;
    
    if (AccessToken.getCurrentAccessToken() == null) {
        return; // already logged out
    }

    new GraphRequest(AccessToken.getCurrentAccessToken(), "/me/permissions/", null, HttpMethod.DELETE, new GraphRequest.Callback() {
        @Override
        public void onCompleted(GraphResponse graphResponse) {

            LoginManager.getInstance().logOut();

          

        }
    }).executeAsync();

    WritableMap map = Arguments.createMap();
    map.putString("message", "Facebook Logout executed");
    map.putString("eventName", "onLogout");
    consumeCallback(CALLBACK_TYPE_SUCCESS, map);
  
}
```



## How to Run App

1. cd to the repo
2. Run Build for either OS
  * for iOS
    * run `react-native run-ios`
  * for Android
    * Run Genymotion
    * run `react-native run-android`







