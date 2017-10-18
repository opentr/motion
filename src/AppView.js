import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { View } from "react-native";
import { Provider } from "react-redux";

import styles from "./styles/styles";

import Map from "./components/Map/index";
import OrderVehicle from "./components/OrderVehicle/index";

class AppView extends PureComponent {
  render() {
    console.log("appview ", this.props);
    if (!this.props.rehydrate.done) return null;
    return (
      <View style={styles.app}>
        <Map />
        <OrderVehicle />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  rehydrate: state.rehydrate
});

export default connect(mapStateToProps)(AppView);
