import React, { PureComponent } from "react";
import { Dimensions, InteractionManager } from "react-native";
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
    this.startUpdating = this.startUpdating.bind(this);
    this.stopUpdating = this.stopUpdating.bind(this);
    this.restartUpdating = this.restartUpdating.bind(this);
  }

  componentDidMount() {
    this.startUpdating();
  }
  componentWillUnmount() {
    this.stopUpdating();
  }

  startUpdating(region = false) {
    this.loadVehicles(region);
    timer.setInterval(
      this,
      "getVehicles",
      this.loadVehicles,
      config.api.openTransport.refreshInterval
    );
  }

  stopUpdating() {
    timer.clearInterval(this);
  }

  restartUpdating(region) {
    this.stopUpdating();
    this.startUpdating(region);
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
      // console.log("vehicles", responseJson);
      InteractionManager.runAfterInteractions(() => {
        this.setState({ vehicles: responseJson.vehicles || [] });
      });
    } catch (error) {
      // console.log(error);
    }
  }

  onRegionChange(region) {
    // console.log("updated region", region);
    this.restartUpdating(region);
    this.setState({ location: region });
  }

  render() {
    // console.log("render", this.state);

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
            anchor={{ x: 0.5, y: 0.5 }}
            style={{
              transform: [{ rotateZ: vehicle.heading + "deg" }]
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
