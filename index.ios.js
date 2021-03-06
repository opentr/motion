import React, { Component } from "react";
import { AppRegistry, Text, View } from "react-native";

import { Client } from "bugsnag-react-native";

if (!__DEV__) {
  const bugsnag = new Client();
}

import App from "./src/App";

export default class OpenRide extends Component {
  render() {
    return <App />;
  }
}

AppRegistry.registerComponent("OpenRide", () => OpenRide);
