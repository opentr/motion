import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  TextInput,
  Animated,
  Easing,
  Image,
  TouchableWithoutFeedback
} from "react-native";

import config from "../../../config/config";
import styles from "../../../styles/styles";

class Traveling extends PureComponent {
  static propTypes = {
    toAddress: PropTypes.string.isRequired
  };

  static defaultProps = {
    ...PureComponent.defaultProps
  };

  constructor(props) {
    super(props);
  }

  render() {
    console.log("Traveling ", this.props);
    return (
      <View
        style={{
          paddingTop: 65,
          flex: 1,
          width: "100%",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          paddingLeft: 10,
          paddingRight: 10
        }}
      >
        <Text
          style={{
            fontSize: 16,
            height: 30,
            color: config.colors.text,
            textAlignVertical: "center",
            textAlign: "left"
          }}
        >
          You are on your way to
        </Text>
        <Text
          style={{
            fontSize: 20,
            height: 40,
            color: config.colors.secondary,
            textAlignVertical: "center",
            textAlign: "left"
          }}
          numberOfLines={1}
        >
          {this.props.toAddress}
        </Text>
      </View>
    );
  }
}

export default Traveling;
