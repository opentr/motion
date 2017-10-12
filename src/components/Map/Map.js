import React, { PureComponent } from "react";
import { Dimensions, InteractionManager, View, Image } from "react-native";
import MapView from "react-native-maps";
import PropTypes from "prop-types";
import { findWithAttr } from "../../utils/search";

const timer = require("react-native-timer");

import config from "../../config/config";
import styles from "../../styles/styles";

class Map extends PureComponent {
  static propTypes = {
    onRegionChange: PropTypes.func.isRequired,
    onLoadVehicles: PropTypes.func.isRequired,
    region: PropTypes.object.isRequired,
    vehicles: PropTypes.array.isRequired
  };

  static defaultProps = {
    ...PureComponent.defaultProps
  };

  constructor(props) {
    super(props);
    this.updateRegion = this.updateRegion.bind(this);
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

    if (region === false) {
      region = this.props.region;
    }

    timer.setInterval(
      this,
      "getVehicles",
      () => {
        this.props.onLoadVehicles(region);
      },
      config.api.openTransport.refreshInterval
    );
  }

  stopUpdating() {
    // console.log("stop updateing");
    timer.clearInterval(this);
  }

  restartUpdating(region) {
    this.stopUpdating();
    this.startUpdating(region);
  }

  updateRegion(region) {
    console.log("updated region !!!", region);
    this.props.onRegionChange(region);
    this.restartUpdating(region);
  }

  render() {
    // console.log("render", this.state);

    const width = Dimensions.get("window").width; //full width
    const height = Dimensions.get("window").height; //full height
    const mapStyle = {
      position: "absolute",
      top: 0,
      width: width,
      height: height * (1 - config.ordering.height)
    };

    console.log("render", this.props.region);

    return (
      <View style={mapStyle}>
        <MapView
          style={mapStyle}
          initialRegion={this.props.region}
          region={this.props.region}
          showsCompass={false}
          showsBuildings={false}
          onRegionChange={this.updateRegion}
          onRegionChangeComplete={this.updateRegion}
          rotateEnabled={false}
        >
          {this.props.vehicles.map((vehicle, index) => (
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
