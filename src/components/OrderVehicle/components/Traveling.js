import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, Animated, Easing } from "react-native";

const timer = require("react-native-timer");

import config from "../../../config/config";
import styles from "../../../styles/styles";

class Traveling extends PureComponent {
  static propTypes = {
    toAddress: PropTypes.string.isRequired,
    booking: PropTypes.object.isRequired
  };

  static defaultProps = {
    ...PureComponent.defaultProps,
    booking: { status: "pending" }
  };

  constructor(props) {
    super(props);

    this.state = {
      step: "pending",
      message: this.getMessage(),
      opacityText: new Animated.Value(1)
    };

    this.startUpdatingBooking = this.startUpdatingBooking.bind(this);
    this.stopUpdatingBooking = this.stopUpdatingBooking.bind(this);
  }

  componentDidMount() {
    if (this.props.booking.booking_id) this.props.getBookingUpdate();
    if (
      this.props.booking.status !== "completed" &&
      this.props.booking.status !== "declined" &&
      this.props.booking.status !== "cancelled_by_supplier" &&
      this.props.booking.status !== "cancelled_by_user"
    ) {
      // start updating if not one of final statuses
      this.startUpdatingBooking();
    }

    // recenter map on load of the
    this.props.onRecenterMap();
    this.props.simulateOrdering();
  }

  onAnimateStatus() {
    Animated.timing(
      // Animate over time
      this.state.opacityText, // The animated value to drive
      {
        toValue: 0,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
        duration: 300
      }
    ).start(() => {
      this.setState({ message: this.state.nextMessage });
      Animated.timing(
        // Animate over time
        this.state.opacityText, // The animated value to drive
        {
          toValue: 1,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
          duration: 300
        }
      ).start();
    });
  }

  componentWillReceiveProps(nextProps) {
    //console.log("traveling ", this.props.booking, nextProps.booking);
    if (nextProps.booking.status !== this.props.booking.status) {
      // statuses are different so let's get what next message should be
      this.setState(
        { nextMessage: this.getMessage(nextProps.booking.status) },
        () => {
          this.onAnimateStatus();
        }
      );

      if (
        this.props.booking.status === "pending" &&
        nextProps.booking.status === "accepted"
      ) {
        // new status is accepted, start updating the status until it's cancelled  or completed
        this.startUpdatingBooking();
      } else if (
        this.props.booking.status === "accepted" &&
        (nextProps.booking.status === "completed" ||
          nextProps.booking.status === "cancelled_by_supplier" ||
          nextProps.booking.status === "cancelled_by_user")
      ) {
        this.stopUpdatingBooking();
      }
    }
  }

  componentWillUnmount() {
    this.stopUpdatingBooking();
  }

  startUpdatingBooking() {
    return false;
    // add regular interval updating of vehicles
    timer.setInterval(
      "updateBooking",
      () => {
        this.props.getBookingUpdate();
      },
      config.api.openTransport.refreshBooking
    );
  }

  stopUpdatingBooking() {
    timer.clearInterval("updateBooking");
  }

  // getMessageTraveling() {
  //   return (
  //     <View>
  //       <Text
  //         style={{
  //           fontSize: 16,
  //           height: 30,
  //           color: config.colors.text,
  //           textAlignVertical: "center",
  //           textAlign: "left"
  //         }}
  //       >
  //         You are on your way to
  //       </Text>
  //       <Text
  //         style={{
  //           fontSize: 20,
  //           height: 40,
  //           color: config.colors.secondary,
  //           textAlignVertical: "center",
  //           textAlign: "left"
  //         }}
  //         numberOfLines={1}
  //       >
  //         {this.props.toAddress}
  //       </Text>
  //     </View>
  //   );
  // }

  getMessage(status = false) {
    if (!status) status = this.props.booking.status;

    switch (status) {
      case "pending":
        return "Booking is being processed";
        break;
      case "accepted":
        return "Booking confirmed";
        break;
      case "driver_on_way":
        return "Driver on its way";
        break;
      case "driver_arriving":
        return "driverAway" in this.props.booking &&
          typeof this.props.booking.driverAway !== "undefined" &&
          this.props.booking.driverAway !== -1
          ? `Driver arrives in ${this.props.booking.driverAway} min` +
              (this.props.booking.driverAway > 0 ? "s" : "")
          : "Driver on its way";
        break;
      case "driver_arrived":
        return `Driver arrived`;
        break;
      case "completed":
        return `You arrived at your destination`;
        break;
    }
  }

  render() {
    //console.log("Traveling ", this.props);
    return (
      <View
        style={{
          width: "100%",
          height: "auto",
          minHeight: 70,
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: 35
        }}
      >
        <Animated.Text
          style={{
            fontSize: 20,
            color: config.colors.secondary,
            textAlign: "center",
            textAlignVertical: "center",
            width: this.props.width * 0.9,
            opacity: this.state.opacityText
          }}
          onPress={() => {
            if (this.props.booking.status === "completed") {
              this.props.onResetApp();
            }
          }}
          numberOfLines={1}
        >
          {this.state.message}
        </Animated.Text>
      </View>
    );
  }
}

export default Traveling;
