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

class Confirmation extends PureComponent {
  static propTypes = {
    fromAddress: PropTypes.string.isRequired,
    toAddress: PropTypes.string.isRequired,
    vehicle: PropTypes.object.isRequired,
    price: PropTypes.number.isRequired,
    onConfirmBooking: PropTypes.func.isRequired
  };

  static defaultProps = {
    ...PureComponent.defaultProps
  };

  constructor(props) {
    super(props);
  }

  render() {
    console.log("COnfirmation ", this.props);
    return (
      <View
        style={{
          paddingTop: 60,
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
            color: config.colors.text,
            textAlignVertical: "center",
            textAlign: "left"
          }}
        >
          You will be picked in
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: config.colors.text,
            textAlignVertical: "center",
            textAlign: "left"
          }}
        />
      </View>
    );
  }
}

export default Confirmation;
