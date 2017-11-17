import React, { PureComponent } from "react";
import {
  Dimensions,
  InteractionManager,
  View,
  Text,
  Image,
  PermissionsAndroid,
  Platform
} from "react-native";
import MapView from "react-native-maps";
import PropTypes from "prop-types";
import { findWithAttr } from "../../../utils/search";
import Marker from "./MarkerFromTo";

const equal = require("fast-deep-equal");
const timer = require("react-native-timer");

import { compareReal, regionDifferent } from "../../../utils/numbers";

import config from "../../../config/config";
import styles from "../../../styles/styles";

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
    // this.updateRegionSimple = this.updateRegionSimple.bind(this);
    this.startUpdating = this.startUpdating.bind(this);
    this.stopUpdating = this.stopUpdating.bind(this);
    this.restartUpdating = this.restartUpdating.bind(this);
    // this.onMapReady = this.onMapReady.bind(this);

    this.state = {
      mapExpanded: false,
      myPosition: null,
      mapAnimating: false
    };

    this.map = false;
    this.mapReady = false;
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.ordering.currStep.id === "traveling" &&
      this.props.ordering.currStepNo !== nextProps.ordering.currStepNo
    ) {
      this.restartUpdating(true);
      // expand map while user is traveling
      // this.expandMap();
    } else {
      // return map back to normal
      // this.contractMap();
    }

    console.log("map will receive props ", nextProps.region, this.props.region);
    if (
      nextProps.mapAction.action &&
      nextProps.mapAction.action === "fitToCoordinates" &&
      this.map &&
      this.mapReady
    ) {
      this.map.fitToCoordinates(
        nextProps.mapAction.coordinates,
        nextProps.mapAction.options
      );

      this.props.onMapAction({});
    } else if (
      regionDifferent(nextProps.region, this.props.region) &&
      this.map &&
      this.mapReady
    ) {
      console.log("update map");
      this.map.animateToRegion(nextProps.region);
    }
  }

  expandMap() {
    if (this.state.mapExpanded) return false;

    this.setState({
      mapExpanded: true
    });
  }

  contractMap() {
    if (!this.state.mapExpanded) return false;

    this.setState({
      mapExpanded: false
    });
  }

  componentDidMount() {
    this.startUpdating();
    this.props.onAskForLocationPermission();
  }

  componentWillUnmount() {
    if (this.watchID) navigator.geolocation.clearWatch(this.watchID);
    this.stopUpdating();
  }

  startUpdating(callFirst = true) {
    // debounce loading of vehicles for 300ms
    if (callFirst) this.props.onLoadVehicles();

    // timer.setTimeout(
    //   this,
    //   "getVehiclesFirst",
    //   () => {
    //     this.props.onLoadVehicles();
    //   },
    //   300
    // );

    // add regular interval updating of vehicles
    timer.setInterval(
      this,
      "getVehicles",
      () => {
        this.props.onLoadVehicles();
      },
      config.api.openTransport.refreshInterval
    );
  }

  stopUpdating() {
    // console.log("stop updateing");

    // clear updating of vehicles
    timer.clearTimeout(this);
    timer.clearInterval(this);
  }

  restartUpdating() {
    // stop / clear updating
    this.stopUpdating();

    // start new updating
    this.startUpdating(false);
  }

  // updateRegionSimple(coordinates, position) {
  //   console.log(" drag ", arguments, coordinates, position);
  // }

  updateRegion(region) {
    console.log("updated region !!!", region);

    // if (this.map && this.mapReady)
    // call action for region change
    if (regionDifferent(region, this.props.region))
      this.props.onRegionChange(region);

    // restart vehicle updating
    this.restartUpdating();

    if (
      this.props.ordering.currStep.id === "to" ||
      this.props.ordering.currStep.id === "from"
    )
      // update address if from or to steps in ordering
      this.props.reverseGeocodeLocation();
  }

  render() {
    // console.log("render", this.state);

    const width = Dimensions.get("window").width; //full width
    const height = Dimensions.get("window").height; //full height
    const delta = Platform.OS == "ios" ? 25 : 0;

    let mapHeight;
    if (this.props.ordering.hidePanel) {
      mapHeight = height;
    } else if (this.props.ordering.currStep.height < 350) {
      mapHeight = this.mapHeight =
        height - this.props.ordering.currStep.height + delta;
    } else if (this.mapHeight) {
      mapHeight = this.mapHeight;
    } else {
      mapHeight = this.mapHeight = height - config.ordering.height;
    }

    const mapStyle = Object.assign({}, styles.map.holder, {
      width: width,
      height: mapHeight
    });

    console.log(
      "map render ",
      this.props.ordering.currStepNo,
      this.state.mapAnimating
    );

    const platformIOS = Platform.IOS === "ios";
    const vehiclesList =
      this.props.ordering.currStep.id === "traveling"
        ? [this.props.selectedVehicle]
        : this.props.vehicles;

    return (
      <View style={mapStyle}>
        <MapView
          key={this.props.locationPermission + "-"}
          style={mapStyle}
          showsUserLocation={this.props.locationPermission}
          initialRegion={this.props.region}
          showsCompass={false}
          showsBuildings={false}
          onRegionChangeComplete={this.updateRegion}
          rotateEnabled={false}
          legalLabelInsets={{ top: 0, left: 0, right: 0, bottom: 100 }}
          onMapReady={() => {
            this.mapReady = true;
          }}
          ref={map => {
            this.map = map;
          }}
        >
          {/* if we passed pick up step show pick up market */}
          {this.props.ordering.currStepNo > this.props.ordering.fromStepNo && (
            <MapView.Marker
              key={"fromMarker"}
              anchor={{ x: 0.5, y: platformIOS ? 0 : 1 }}
              coordinate={{
                latitude: this.props.ordering.fromData.geometry.location.lat,
                longitude: this.props.ordering.fromData.geometry.location.lng
              }}
              style={styles.map.marker}
            >
              <Marker
                platformIOS={platformIOS}
                region={this.props.region}
                address={this.props.ordering.fromAddress}
                backgroundColor={config.colors.green}
              />
            </MapView.Marker>
          )}
          {/* if we passed destination step show destination marker */}
          {this.props.ordering.currStepNo > this.props.ordering.toStepNo && (
            <MapView.Marker
              key={"toMarker"}
              anchor={{ x: 0.5, y: platformIOS ? 0 : 1 }}
              style={styles.map.marker}
              coordinate={{
                latitude: this.props.ordering.toData.geometry.location.lat,
                longitude: this.props.ordering.toData.geometry.location.lng
              }}
            >
              <Marker
                platformIOS={platformIOS}
                region={this.props.region}
                address={this.props.ordering.toAddress}
                backgroundColor="red"
              />
            </MapView.Marker>
          )}
          {vehiclesList.map((vehicle, index) => (
            <MapView.Marker
              key={index}
              anchor={{ x: 0.5, y: 0.5 }}
              style={[
                styles.map.vehicle,
                {
                  transform: [{ rotateZ: vehicle.heading + "deg" }]
                }
              ]}
              coordinate={{
                latitude: vehicle.position.lat,
                longitude: vehicle.position.lng
              }}
              image={require("../../../assets/car.png")}
            />
          ))}
          {this.props.ordering.route && (
            <MapView.Polyline
              coordinates={this.props.ordering.route}
              strokeWidth={3}
              strokeColor="red"
            />
          )}
        </MapView>
        {/* Show overlay map cursor only if you are choosing location, like from and to steps */}
        {(this.props.ordering.currStep.id === "from" ||
          this.props.ordering.currStep.id === "to") && (
          <View
            pointerEvents="none"
            style={[
              styles.map.overlay,
              {
                height: mapStyle.height,
                transform: [{ translateY: Platform.OS === "android" ? -20 : 0 }]
              }
            ]}
          >
            {/* <Image
              pointerEvents="none"
              source={require("../../../assets/pinScaled.png")}
            /> */}
            <Marker
              platformIOS={platformIOS}
              region={this.props.region}
              loadingGeocoding={this.props.loadingGeocoding}
              address={
                this.props.ordering.currStep.id === "from"
                  ? this.props.ordering.fromAddress
                  : this.props.ordering.toAddress
              }
              backgroundColor={
                this.props.ordering.currStep.id === "from"
                  ? config.colors.green
                  : "red"
              }
            />
          </View>
        )}
      </View>
    );
  }
}

export default Map;
