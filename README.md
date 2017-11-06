#  Motion - Open Source Mobile App in React Native based on OpenTransport API


## How to Setup

### **Step 1:** git clone this repo:

### **Step 2:** cd to the cloned repo:

### **Step 3:** Install the Application with `npm install`

### **Step 4:** Add your OpenTransport and Google API keys at `src/config/config.js`

### **Step 5:** Edit sources of node modules specified here

**iOS react-native-maps fix** 

This is a fix for some markers staying in top left corner of a screen. To fix the issue edit 
`node_modules/react-native-maps/lib/ios/AirMaps/AIRMapMarker.m`

```
// comment out this line
// CGPoint center = (CGPoint){ self.center.x, self.center.y - dy };

// and add this line
CGPoint center = (CGPoint){ self.center.x -100, self.center.y - dy };
```

**Android fix for logging out of Facebook**

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
    * Run Genymotion or Android Studio Phone Emulator
    * run `react-native run-android`


## Configuration

You can configure the app by modifying the values of config object located in `config/config.js` file.

| API config               ||
|----------|:-------------|
|OpenTransport|
|key       | your OpenTransport API key |
|url       | OpenTransport API url |
|apiPrefix | OpenTransport API prefix, used for API versioning |
|searchRadius | radius for which vehicles will be searched |
|refreshInterval | how often vehicles position and info will be updated |
|refreshBooking | how often booked vehicle location will be updated |
|Google|
|urlTextSearch       | URL for Text Search API |
|urlReverseGeocode       |  URL for Reverse Geocode API |
|key | Your Google API key |
|radius | radius for location search with Text Search API |
|Map configuration|
|forceStartLocation       | open the app map with start location from the config |
|startLocation       | longitude and latitude of the start location  |
|geolocation       | geolocation default configuration  |
|recenterZoom       | default zoom for recentering in latitude and longitude delta  |
|Ordering configuration|
|height       | default height of the ordering panel, only used if there is a problem with individual step height |
|steps       | list of steps in the ordering process, for example you can switch from and to steps, or turn on/off time step.  |
|withAuth       | if enabled only logged in users will be able to see ordering  |
|Other config|
|showVersionNumber       | if enable it will overflow app with the version number in top right  |
|Colors|
|primary       | primary app color used for actions|   |
|secondary       | secondary app color used for secondary actions and important information|   
|alert       | alert color used for errors and issues|   
|text       | default text color|   








