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

class SelectVehicleItem extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    index: PropTypes.number,
    onPressItem: PropTypes.func.isRequired
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
      <TouchableWithoutFeedback
        onPress={() => {
          this.props.onPressItem(this.props.index);
        }}
      >
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
              lineHeight: 24,
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
          <View
            style={{
              flexDirection: "row",
              width: 105,
              justifyContent: "center",
              alignItems: "center",
              paddingTop: 10
            }}
          >
            <Image
              source={require("../../../assets/heart.png")}
              style={{
                width: 24,
                height: 20,
                marginRight: 5
              }}
            />
            <View
              style={{
                paddingTop: 2,
                paddingBottom: 4,
                paddingLeft: 6,
                paddingRight: 6,
                backgroundColor: config.colors.secondary
              }}
            >
              <Text
                style={{
                  color: "white",
                  lineHeight: 18,
                  fontSize: 18
                }}
              >
                8.4
              </Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default SelectVehicleItem;
