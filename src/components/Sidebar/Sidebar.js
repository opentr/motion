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

import Trips from "../Trips/";

import config from "../../config/config";
import styles from "../../styles/styles";

class Sidebar extends PureComponent {
  static propTypes = {};

  static defaultProps = {
    ...PureComponent.defaultProps
  };

  constructor(props) {
    super(props);

    const width = Dimensions.get("window").width;

    this.state = {
      open: false,
      panelExpanded: false,
      panelScaleX: new Animated.Value(1),
      panelTranslateX: new Animated.Value(-200),
      panelBgTranslateX: new Animated.Value(-width + 200),
      imageOpacity: new Animated.Value(this.props.orderingInProgress ? 0 : 1),
      expandedOpacity: new Animated.Value(0)
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
        this.state.imageOpacity, // The animated value to drive
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

  hidePanel() {
    const width = Dimensions.get("window").width;
    Animated.timing(
      this.state.panelTranslateX, // The animated value to drive
      {
        toValue: -width + 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
        duration: 150
      }
    ).start(() => {
      this.setState({ open: false });
    });
  }

  onShowTrips() {
    this.openPanel();
  }

  openPanel() {
    this.setState({ panelExpanded: true });

    const width = Dimensions.get("window").width;
    Animated.parallel([
      Animated.timing(
        this.state.panelBgTranslateX, // The animated value to drive
        {
          toValue: 0,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
          duration: 200
        }
      ),
      Animated.timing(
        this.state.imageOpacity, // The animated value to drive
        {
          toValue: 0,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
          duration: 150
        }
      ),

      Animated.timing(
        this.state.expandedOpacity, // The animated value to drive
        {
          toValue: 1,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
          delay: 150,
          duration: 150
        }
      )
    ]).start();
  }

  closePanel() {
    console.log("CLOSE PANEL");
    const width = Dimensions.get("window").width;
    Animated.parallel([
      Animated.timing(
        this.state.panelBgTranslateX, // The animated value to drive
        {
          toValue: -width + 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
          delay: 100,
          duration: 150
        }
      ),
      Animated.timing(
        this.state.imageOpacity, // The animated value to drive
        {
          toValue: 1,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
          delay: 100,
          duration: 150
        }
      ),
      Animated.timing(
        this.state.expandedOpacity, // The animated value to drive
        {
          toValue: 0,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
          duration: 150
        }
      )
    ]).start(() => {
      this.setState({ panelExpanded: false });
    });
  }

  render() {
    const { user } = this.props;

    const height = Dimensions.get("window").height; //full height
    const width = Dimensions.get("window").width; //full height

    return (
      <View
        style={[
          styles.sidebar.holder,
          {
            width: this.state.panelExpanded
              ? width
              : this.state.open ? 200 : 60,
            height: this.state.open ? height : 60
          }
        ]}
      >
        {this.state.open && (
          <Animated.View
            style={[
              {
                height: height,
                transform: [{ translateX: this.state.panelTranslateX }]
              }
            ]}
          >
            <Animated.View
              style={[
                styles.sidebar.panelBackground,
                {
                  height: height,
                  width: width,
                  transform: [{ translateX: this.state.panelBgTranslateX }]
                }
              ]}
            />

            <Animated.View
              style={[
                styles.sidebar.menu,
                { opacity: this.state.imageOpacity }
              ]}
            >
              <Text
                style={[
                  styles.sidebar.button,
                  {
                    top: 120
                  }
                ]}
                onPress={() => {
                  this.onShowTrips();
                }}
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
          </Animated.View>
        )}
        {this.state.panelExpanded && (
          <Animated.View
            style={[
              styles.sidebar.expanded.holder,
              { opacity: this.state.expandedOpacity }
            ]}
          >
            <TouchableOpacity
              onPress={() => {
                console.log("ON PRESS CLOSE");
                if (this.state.panelExpanded) this.closePanel();
              }}
              activeOpacity={0.8}
            >
              <Image
                source={require("../../assets/back-black.png")}
                style={[
                  styles.backButton.icon,
                  styles.sidebar.expanded.backIcon
                ]}
              />
            </TouchableOpacity>
            <Trips />
          </Animated.View>
        )}
        {user.loggedIn && (
          <TouchableOpacity
            style={styles.sidebar.profile.holder}
            activeOpacity={0.8}
            onPress={e => {
              if (
                this.props.inputOpen ||
                this.props.orderingInProgress ||
                this.state.panelExpanded
              )
                return false;
              this.props.onSideBar(this.state.open);
              if (!this.state.open) {
                this.setState({ open: true });
              } else {
                this.hidePanel();
              }
            }}
          >
            <Animated.Image
              style={[
                styles.sidebar.profile.image,
                {
                  opacity: this.state.imageOpacity
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
