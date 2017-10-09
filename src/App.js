import React, { PureComponent } from "react";
import { View } from "react-native";
import Map from "./components/Map/Map";
import OrderVehicle from "./components/OrderVehicle/OrderVehicle";
import styles from "./styles/styles";

class App extends PureComponent {
  render() {
    return (
      <View style={styles.app}>
        <Map />
        <OrderVehicle />
      </View>
    );
  }
}

export default App;
