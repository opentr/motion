import React, { PureComponent } from "react";
import { View } from "react-native";
import Map from "./components/Map/Map";
import styles from "./styles/styles";

class App extends PureComponent {
  render() {
    return (
      <View style={styles.map}>
        <Map />
      </View>
    );
  }
}

export default App;
