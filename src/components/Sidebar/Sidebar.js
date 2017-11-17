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
import styles from "../../styles/styles";

class Sidebar extends PureComponent {
  static propTypes = {};

  static defaultProps = {
    ...PureComponent.defaultProps
  };

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      panelTranslateX: new Animated.Value(-200),
      panelOpacity: new Animated.Value(this.props.orderingInProgress ? 0 : 1)
    };
  }

  componentDidMount() {
    // make sure ordering is shown if app is reloaded
    // this.props.onSideBar(this.state.open);

    if (this.props.user.loginOnStart) {
      this.props.onLoginReturningUser();
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log("sidebar cmwp", nextProps, this.props);
    if (
      nextProps.inputOpen !== this.props.inputOpen ||
      nextProps.orderingInProgress !== this.props.orderingInProgress
    ) {
      Animated.timing(
        this.state.panelOpacity, // The animated value to drive
        {
          toValue: nextProps.inputOpen || nextProps.orderingInProgress ? 0 : 1,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
          duration: 150
        }
      ).start();
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
          duration: 150
        }
      ).start();
    }
  }

  render() {
    const { user } = this.props;

    const height = Dimensions.get("window").height; //full height

    return (
      <View
        style={[
          styles.sidebar.holder,
          {
            width: this.state.open ? 200 : 60,
            height: this.state.open ? height : 60
          }
        ]}
      >
        {this.state.open && (
          <Animated.View
            style={[
              styles.sidebar.panel,
              {
                height: height,
                transform: [{ translateX: this.state.panelTranslateX }]
              }
            ]}
          >
            <Text
              style={[
                styles.sidebar.button,
                {
                  top: 120
                }
              ]}
            >
              Trips
            </Text>
            <Text
              style={[
                styles.sidebar.button,
                {
                  top: 170
                }
              ]}
            >
              Payment
            </Text>

            <Text
              style={styles.sidebar.buttonLogout}
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
            style={styles.sidebar.profile.holder}
            activeOpacity={0.8}
            onPress={e => {
              if (this.props.inputOpen || this.props.orderingInProgress)
                return false;
              this.props.onSideBar(this.state.open);
              this.setState({ open: !this.state.open });
            }}
          >
            <Animated.Image
              style={[
                styles.sidebar.profile.image,
                {
                  opacity: this.state.panelOpacity
                }
              ]}
              source={{ uri: user.photoURL }}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

export default Sidebar;
