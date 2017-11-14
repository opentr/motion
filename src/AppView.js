import React, { PureComponent } from "react";
import { connect } from "react-redux";
import {
  View,
  BackHandler,
  Text,
  Platform,
  Image,
  Alert,
  Modal,
  TouchableHighlight
} from "react-native";
import { Provider } from "react-redux";

import styles from "./styles/styles";
import config from "./config/config";

import Map from "./components/Map/index";
import Sidebar from "./components/Sidebar/index";
import OrderVehicle from "./components/OrderVehicle/index";

const appVersion = "v0.1.4";

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
        {user.loggedIn && (
          <Sidebar
            style={{ position: "absolute", top: 0, left: 0, zIndex: 5 }}
            user={user}
          />
        )}
        <OrderVehicle style={{ zIndex: 10 }} />
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

        {(user.error || user.logoutResult) && (
          <Modal
            animationType="slide"
            transparent={false}
            onRequestClose={() => {}}
          >
            <View style={{ marginTop: 22 }}>
              <View>
                {user.error && <Text>Error: {user.error}</Text>}
                {user.logoutResult && (
                  <Text>Logout result: {user.logoutResult}</Text>
                )}

                <TouchableHighlight
                  onPress={() => {
                    this.props.resetErrors();
                  }}
                  style={{
                    width: "100%",
                    marginTop: 20
                  }}
                >
                  <Text
                    style={{
                      fontSize: 24,
                      textAlign: "center"
                    }}
                  >
                    Hide errors
                  </Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>
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
import { resetErrors } from "./store/userReducer";
const mapDispatchToProps = {
  onPrevStep,
  resetErrors
};

export default connect(mapStateToProps, mapDispatchToProps)(AppView);
