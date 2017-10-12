import React, { PureComponent } from "react";
import { View } from "react-native";
import { Provider } from "react-redux";

import styles from "./styles/styles";

import Map from "./components/Map/index";
import OrderVehicle from "./components/OrderVehicle/index";

import store from "./store/";

class App extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Provider store={store}>
        <View style={styles.app}>
          <Map />
          <OrderVehicle />
        </View>
      </Provider>
    );
  }
}

export default App;
