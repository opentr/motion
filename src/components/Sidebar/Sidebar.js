import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  Image,
  Animated,
  Easing,
  View,
  TouchableOpacity,
  Dimensions,
  Text
} from "react-native";

import config from "../../config/config";

class Sidebar extends PureComponent {
  static propTypes = {};

  static defaultProps = {
    ...PureComponent.defaultProps
  };

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      panelTranslateX: new Animated.Value(-200)
    };
  }

  componentDidMount() {
    // make sure ordering is shown if app is reloaded
    // this.props.onSideBar(this.state.open);

    if (this.props.user.loginOnStart) {
      this.props.onLoginReturningUser();
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.open && nextState !== this.state.open) {
      // open panel
      Animated.timing(
        this.state.panelTranslateX, // The animated value to drive
        {
          toValue: 0,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
          duration: 200
        }
      ).start();
    }
  }

  render() {
    const { user } = this.props;

    const height = Dimensions.get("window").height; //full height

    return (
      <View style={{ position: "absolute", top: 0, left: 0 }}>
        {this.state.open && (
          <Animated.View
            style={{
              backgroundColor: "white",
              width: 200,
              height: height,
              transform: [{ translateX: this.state.panelTranslateX }]
            }}
          >
            <Text
              style={{
                position: "absolute",
                top: 120,
                left: 20,
                fontSize: 30,
                color: config.colors.primary
              }}
            >
              Trips
            </Text>
            <Text
              style={{
                position: "absolute",
                top: 170,
                left: 20,
                fontSize: 30,
                color: config.colors.primary
              }}
            >
              Payment
            </Text>

            <Text
              style={{
                position: "absolute",
                bottom: 60,
                left: 20,
                fontSize: 24,
                color: config.colors.text
              }}
              onPress={() => {
                this.props.onLogout();
              }}
            >
              Logout
            </Text>
          </Animated.View>
        )}
        {user.loggedIn && (
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 10,
              left: 10
            }}
            onPress={e => {
              this.props.onSideBar(this.state.open);
              this.setState({ open: !this.state.open });
            }}
          >
            <Image
              style={{
                width: 40,
                height: 40,
                borderRadius: 24
              }}
              source={{ uri: user.photoURL }}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

export default Sidebar;
