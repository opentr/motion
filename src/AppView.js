import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { View, BackHandler, Text, Platform } from "react-native";
import { Provider } from "react-redux";

import styles from "./styles/styles";
import config from "./config/config";

import Map from "./components/Map/index";
import OrderVehicle from "./components/OrderVehicle/index";

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

    // if data is loaded proceed with rendering
    return (
      <View style={styles.app}>
        <Map />
        <OrderVehicle />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  currStepNo: state.ordering.currStepNo,
  rehydrate: state.rehydrate
});

import { onPrevStep } from "./store/orderingReducer";
const mapDispatchToProps = {
  onPrevStep
};

export default connect(mapStateToProps, mapDispatchToProps)(AppView);
