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
    fromAddress: PropTypes.string,
    toAddress: PropTypes.string,
    vehicle: PropTypes.object,
    price: PropTypes.any,
    onConfirmBooking: PropTypes.func.isRequired
  };

  static defaultProps = {
    ...PureComponent.defaultProps,
    vehicle: {}
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.isActive) this.props.openPanel("confirmation");
  }

  render() {
    //console.log("COnfirmation ", this.props);
    return (
      <View
        style={{
          marginTop: 10,
          width: "auto",
          height: "auto",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "flex-start",
          paddingLeft: 10,
          paddingRight: 10
        }}
      >
        <Text style={styles.ordering.label}>You will be picked in</Text>
        <Text style={styles.ordering.confirmationInfo} numberOfLines={1}>
          {this.props.fromAddress}
        </Text>
        <Text style={styles.ordering.label}>and drop me at</Text>
        <Text style={styles.ordering.confirmationInfo} numberOfLines={1}>
          {this.props.toAddress}
        </Text>
        <Text style={styles.ordering.label}>in</Text>
        <Text style={styles.ordering.confirmationInfo}>
          {this.props.vehicle.make || ""}
        </Text>
        <Text style={styles.ordering.label}>You will be charged</Text>
        <Text style={styles.ordering.confirmationInfo}>{this.props.price}</Text>
        <Text style={styles.ordering.label}>The card XYZ will be charged</Text>

        <Text
          style={{
            marginTop: 18,
            fontSize: 30,
            width: this.props.width,
            color: config.colors.alert,
            textAlign: "center"
          }}
          onPress={this.props.onConfirmBooking}
        >
          {this.props.actionText}
        </Text>
      </View>
    );
  }
}

export default Confirmation;
