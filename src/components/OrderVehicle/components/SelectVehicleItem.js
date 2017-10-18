import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  TextInput,
  Animated,
  Easing,
  Image,
  FlatList
} from "react-native";

import config from "../../../config/config";
import styles from "../../../styles/styles";

class SelectVehicleItem extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired
  };

  static defaultProps = {
    ...PureComponent.defaultProps
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { type } = this.props.data;
    return (
      <View
        style={{
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          paddingLeft: 10,
          paddingRight: 10
        }}
      >
        <Text
          style={{
            height: 40,
            fontSize: 15,
            width: 85,
            color: config.colors.primary,
            textAlignVertical: "center",
            textAlign: "center"
          }}
        >
          {type}
        </Text>
        <Image
          source={require("../../../assets/vehicle.jpg")}
          style={{ maxWidth: 100, height: 60 }}
        />
        <Text
          style={{
            fontSize: 15,
            lineHeight: 26,
            width: 85,
            color: config.colors.text,
            textAlignVertical: "center",
            textAlign: "center"
          }}
        >
          in 5 min
        </Text>
        <Text
          style={{
            fontSize: 20,
            lineHeight: 30,
            width: 85,
            color: config.colors.text,
            textAlignVertical: "center",
            textAlign: "center",
            fontWeight: "bold"
          }}
        >
          £15.30
        </Text>
      </View>
    );
  }
}

export default SelectVehicleItem;
