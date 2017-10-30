import React, { PureComponent } from "react";
import { View, Platform, Text, ActivityIndicator } from "react-native";
import PropTypes from "prop-types";
import { FBLogin, FBLoginManager } from "react-native-facebook-login";

import config from "../../config/config";

class Login extends PureComponent {
  static propTypes = {
    showButtons: PropTypes.bool
  };

  static defaultProps = {
    ...PureComponent.defaultProps,
    showButtons: false
  };

  constructor(props) {
    super(props);
  }
  componentDidMount() {}

  render() {
    if (this.props.showButtons && this.props.user.loadingInProgress) {
      return (
        <View
          style={{
            flexDirection: "column",
            width: "100%",
            height: "auto",
            height: 140,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <ActivityIndicator size="large" color={config.colors.primary} />
        </View>
      );
    } else if (this.props.showButtons) {
      return (
        <View
          style={{
            flexDirection: "column",
            width: "100%",
            height: "auto",
            height: 140,
            justifyContent: "center"
          }}
        >
          <Text
            style={{
              fontSize: 24,
              color: config.colors.primary,
              textAlign: "center",
              textAlignVertical: "center",
              width: this.props.width,
              paddingTop: 8,
              paddingBottom: 8
            }}
            onPress={() => {
              this.props.onLoginGoogle();
            }}
            numberOfLines={1}
          >
            Google
          </Text>
          <Text
            style={{
              fontSize: 24,
              color: config.colors.primary,
              textAlign: "center",
              textAlignVertical: "center",
              width: this.props.width,
              paddingTop: 8,
              paddingBottom: 8
            }}
            onPress={() => {
              this.props.onLoginFacebook();
            }}
            numberOfLines={1}
          >
            Facebook
          </Text>
        </View>
      );
    }
    return (
      <View
        style={{
          width: "100%",
          height: "auto",
          height: 90
        }}
      >
        <Text
          style={{
            fontSize: 24,
            color: config.colors.primary,
            textAlign: "center",
            textAlignVertical: "center",
            width: this.props.width,
            height: 90
          }}
          onPress={() => {
            this.props.onNextStep();
          }}
          numberOfLines={1}
        >
          Login
        </Text>
      </View>
    );
  }
}

export default Login;
