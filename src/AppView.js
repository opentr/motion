import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { View, BackHandler, Text, Platform, Image } from "react-native";
import { Provider } from "react-redux";

import styles from "./styles/styles";
import config from "./config/config";

import Map from "./components/Map/index";
import Sidebar from "./components/Sidebar/index";
import OrderVehicle from "./components/OrderVehicle/index";

const appVersion = "v0.0.8";

//var DeviceInfo = require("react-native-device-info");
// let versionNumber = ""; //DeviceInfo.getVersion();

class AppView extends PureComponent {
  componentDidMount() {
    // add listener for Android
    BackHandler.addEventListener("hardwareBackPress", () => {
      if (this.props.currStepNo === 0) {
        // exit the app, since we do not have prev step in the app
        return false;
      } else {
        // go to previous step
        this.props.onPrevStep();
        // do not exit the app
        return true;
      }
    });
  }

  render() {
    // wait for local storage data to load, like user if he is logged in and other options
    if (!this.props.rehydrate.done) return null;

    const { user } = this.props;

    // if data is loaded proceed with rendering
    return (
      <View style={styles.app}>
        <Map />
        <OrderVehicle />
        <Text
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            color: "white",
            paddingLeft: 3,
            paddingRight: 3,
            backgroundColor: "rgba(0,0,0,.5)"
          }}
        >
          {appVersion}
        </Text>
        {user.loggedIn && (
          <Sidebar
            style={{ position: "absolute", top: 0, left: 0 }}
            user={user}
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  currStepNo: state.ordering.currStepNo,
  rehydrate: state.rehydrate,
  user: state.user
});

import { onPrevStep } from "./store/orderingReducer";
const mapDispatchToProps = {
  onPrevStep
};

export default connect(mapStateToProps, mapDispatchToProps)(AppView);
