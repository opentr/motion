import React, { PureComponent } from "react";
import { View, Platform, Text, ActivityIndicator } from "react-native";
import PropTypes from "prop-types";
import { FBLogin, FBLoginManager } from "react-native-facebook-login";

import config from "../../config/config";
import styles from "../../styles/styles";

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
        <View style={styles.login.holder}>
          <ActivityIndicator size="large" color={config.colors.primary} />
        </View>
      );
    } else if (this.props.showButtons) {
      return (
        <View style={styles.login.holder}>
          <Text
            style={[styles.login.button]}
            onPress={() => {
              this.props.onLoginGoogle();
            }}
            numberOfLines={1}
          >
            Google
          </Text>
          <Text
            style={[styles.login.button]}
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
      <View style={[styles.login.holder, styles.login.firstStep]}>
        <Text
          style={[styles.login.button, styles.login.loginButton]}
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
