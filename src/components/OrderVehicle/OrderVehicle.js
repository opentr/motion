import React, { PureComponent } from "react";
import { View, Text, Dimensions } from "react-native";
import PropTypes from "prop-types";

import config from "../../config/config";
import styles from "../../styles/styles";

class OrderVehicle extends PureComponent {
  static propTypes = {};

  static defaultProps = {
    ...PureComponent.defaultProps
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const width = Dimensions.get("window").width; //full width
    const height = Dimensions.get("window").height * config.ordering.height; //full height

    return (
      <View
        style={{
          position: "absolute",
          bottom: 0,
          zIndex: 1000,
          backgroundColor: "white",
          width: width,
          height: height,
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <Text style={[styles.baseText, { paddingTop: 40 }]}>
          Pick me up from
        </Text>
        <Text
          style={[styles.baseText, styles.buttonText, { paddingBottom: 40 }]}
        >
          Next
        </Text>
      </View>
    );
  }
}

export default OrderVehicle;
