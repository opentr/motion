import React, { Component } from "react";
import PropTypes from "prop-types";
import { Animated, Easing, View } from "react-native";

import VisibleSteps from "./VisibleSteps";

const timer = require("react-native-timer");

class Steps extends Component {
  static propTypes = {
    totalSteps: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    currStepNo: PropTypes.number.isRequired,
    style: PropTypes.object,
    renderStep: PropTypes.func.isRequired
  };

  static defaultProps = {
    ...Component.defaultProps,
    style: {}
  };

  constructor(props) {
    super(props);

    const { currStepNo, width } = this.props;
    console.log("constructor props now state");
    this.state = {
      inPrevTransition: false,
      inNextTransition: false,
      viewTranslateX: new Animated.Value(-currStepNo * width)
    };
  }

  componentWillReceiveProps(nextProps) {
    const { currStepNo, width } = this.props;
    console.log("nextProps now ", nextProps.currStepNo, currStepNo);

    if (nextProps.currStepNo !== currStepNo) {
      let stateUpdate = {};

      Animated.timing(
        // Animate over time
        this.state.viewTranslateX, // The animated value to drive
        {
          toValue: -nextProps.currStepNo * width,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
          duration: 500
        }
      ).start(() => {
        console.log("finished now");
        // this.setState({
        //   inPrevTransition: false,
        //   inNextTransition: false
        // });
      });
    }
  }

  componentWillUnmount() {
    timer.clearTimeout(this);
  }

  render() {
    const {
      style,
      totalSteps,
      currStepNo,
      width,
      height,
      renderStep
    } = this.props;

    const { inPrevTransition, inNextTransition } = this.state;

    console.log(
      "render slider now",
      totalSteps,
      inPrevTransition,
      inNextTransition
    );

    return (
      <View
        style={{
          width: width,
          height: height * 2
        }}
      >
        <Animated.View
          style={{
            ...style,
            width: totalSteps * width,
            left: 0,
            top: 0,
            transform: [{ translateX: this.state.viewTranslateX }]
          }}
        >
          <VisibleSteps
            currStepNo={currStepNo}
            width={width}
            totalWidth={totalSteps * width}
            inNextTransition={inNextTransition}
            inPrevTransition={inPrevTransition}
            renderStep={renderStep}
            steps={this.props.steps}
          />
        </Animated.View>
      </View>
    );
  }
}

export default Steps;
