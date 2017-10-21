import React, { Component } from "react";
import PropTypes from "prop-types";

import { View } from "react-native";

class VisibleSteps extends Component {
  static propTypes = {};

  static defaultProps = {
    ...Component.defaultProps
  };

  render() {
    console.log("render VisibleSteps now", this.props);

    const {
      currStepNo,
      inPrevTransition,
      inNextTransition,
      width,
      totalWidth,
      renderStep,
      steps
    } = this.props;

    return (
      <View
        style={{
          backgroundColor: "#f00",
          width: totalWidth,
          height: 200,
          flexDirection: "row"
        }}
      >
        {/* {currStepNo > 0 && (
          <View
            key="next"
            style={{
              width: width,
              height: 200
            }}
          >
            {renderStep(steps[currStepNo - 1])}
          </View>
        )} */}

        {steps.map(step => (
          <View key={step.id} style={{ width: width, height: 200 }}>
            {renderStep(step)}
          </View>
        ))}

        {/* <View
          key="prev"
          style={{
            width: width,
            justifyContent: "flex-start",
            height: 200
          }}
        >
          {renderStep(steps[currStepNo + 1])}
        </View> */}
      </View>
    );
  }
}

export default VisibleSteps;
