import React, { PureComponent } from "react";
import { Dimensions } from "react-native";
import MapView from "react-native-maps";
import PropTypes from "prop-types";

const timer = require("react-native-timer");

import config from "../../config/config";
import styles from "../../styles/styles";

class Map extends PureComponent {
  static propTypes = {};

  static defaultProps = {
    ...PureComponent.defaultProps
  };

  constructor() {
    super();

    const { forceStartLocation, startLocation } = config.map;
    this.state = {
      location: forceStartLocation && startLocation,
      vehicles: []
    };

    this.onRegionChange = this.onRegionChange.bind(this);
    this.loadVehicles = this.loadVehicles.bind(this);
  }

  componentDidMount() {
    timer.setInterval(
      this,
      "getVehicles",
      this.loadVehicles,
      config.api.openTransport.refreshInterval
    );
    // this.loadVehicles();
  }

  componentWillUnmount() {
    timer.clearInterval(this);
  }

  async loadVehicles(region = false) {
    if (!region) {
      region = this.state.location;
    }
    try {
      let response = await fetch(
        config.api.openTransport.url +
          config.api.openTransport.apiPrefix +
          "/vehicles?radius=" +
          config.api.openTransport.searchRadius +
          "&position=" +
          region.latitude +
          "," +
          region.longitude,
        {
          method: "get",
          headers: {
            Authorization: "Bearer " + config.api.openTransport.key
          }
        }
      );
      let responseJson = await response.json();
      console.log("vehicles", responseJson);
      this.setState({ vehicles: responseJson.vehicles || [] });
    } catch (error) {
      console.log(error);
    }
  }

  onRegionChange(region) {
    console.log("updated region", region);
    // this.loadVehicles(region);
    // this.setState({ location: region });
  }

  render() {
    console.log("render", this.state);

    var width = Dimensions.get("window").width; //full width
    var height = Dimensions.get("window").height; //full height

    return (
      <MapView
        style={styles.map}
        initialRegion={this.state.location}
        onRegionChange={this.onRegionChange}
      >
        {this.state.vehicles.map((vehicle, index) => (
          <MapView.Marker
            key={index}
            style={{
              flex: 1,
              width: width,
              height: height,
              transform: [
                { scale: (0.2, 0.2) },
                { rotateZ: vehicle.heading + "deg" }
              ]
            }}
            coordinate={{
              latitude: vehicle.position.lat,
              longitude: vehicle.position.lng
            }}
            image={require("../../assets/car.png")}
          />
        ))}
      </MapView>
    );
  }
}

export default Map;
