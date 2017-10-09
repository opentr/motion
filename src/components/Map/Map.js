import React, { PureComponent } from "react";
import { Dimensions, InteractionManager, View, Image } from "react-native";
import MapView from "react-native-maps";
import PropTypes from "prop-types";
import { findWithAttr } from "../../utils/search";

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
    //this.loadVehicles(region);
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
      const radius = Math.round(region.latitudeDelta * 111 * 1.60934 * 1000); //config.api.openTransport.searchRadius;
      let response = await fetch(
        config.api.openTransport.url +
          config.api.openTransport.apiPrefix +
          "/vehicles?radius=" +
          radius +
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
      InteractionManager.runAfterInteractions(() => {
        const vehicles = this.state.vehicles.slice(0);
        const reponseVehicles = responseJson.vehicles || [];

        this.setState({ vehicles: reponseVehicles });
      });
    } catch (error) {
      // console.log(error);
    }
  }

  onRegionChange(region) {
    // console.log("updated region", region);
    this.setState({ location: region });
    this.restartUpdating(region);
  }

  render() {
    console.log("render", this.state);

    const width = Dimensions.get("window").width; //full width
    const height = Dimensions.get("window").height; //full height

    styles.map.height = height * (1 - config.ordering.height);

    return (
      <View style={styles.map}>
        <MapView
          style={styles.map}
          initialRegion={this.state.location}
          showsCompass={false}
          showsBuildings={false}
          onRegionChange={this.onRegionChange}
          rotateEnabled={false}
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
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            height: 0.6 * height,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "transparent"
          }}
        >
          <Image
            style={{ transform: [{ scale: 0.04 }] }}
            pointerEvents="none"
            source={require("../../assets/pin.png")}
          />
        </View>
      </View>
    );
  }
}

export default Map;
