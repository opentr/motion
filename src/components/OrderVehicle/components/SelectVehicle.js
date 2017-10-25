import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  TextInput,
  Animated,
  Easing,
  Image,
  FlatList
} from "react-native";

import SelectVehicleItem from "./SelectVehicleItem";

import config from "../../../config/config";
import styles from "../../../styles/styles";

class SelectVehicle extends PureComponent {
  static propTypes = {
    availableVehicles: PropTypes.array.isRequired
  };

  static defaultProps = {
    ...PureComponent.defaultProps
  };

  constructor(props) {
    super(props);
    this.state = {
      searched: false,
      waitingForTimes: true,
      data: this.props.availableVehicles,
      sortedVehicles: false
    };
  }

  componentDidMount() {
    console.log("select component did mount ", this.props);
    if (!this.props.isActive) return false;
    if (
      !this.state.searched &&
      !this.props.isPrevAnimation &&
      !this.props.isNextAnimation
    ) {
      this.props.onSearchForVehicle();
      this.setState({ searched: true, waitingForTimes: true });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.isActive) return false;
    console.log(
      "select componentWillReceiveProps",
      nextProps,
      this.state,
      this.props
    );
    if (
      !this.state.searched &&
      !nextProps.searchingVehicles &&
      !nextProps.isPrevAnimation &&
      !nextProps.isNextAnimation
    ) {
      this.props.onSearchForVehicle();
      this.setState({ searched: true, waitingForTimes: true });
    } else if (
      this.state.searched &&
      nextProps.searchingVehicles === false &&
      !this.state.sortedVehicles
    ) {
      //console.log(
      //   "debug now ",
      //   nextProps.availableVehicles.length,
      //   nextProps.availableVehicles.filter(
      //     v => typeof v.routeTime !== "undefined"
      //   ).length
      // );
      const waitingForTimes =
        nextProps.availableVehicles.length >
        nextProps.availableVehicles.filter(
          v => typeof v.routeTime !== "undefined"
        ).length;

      let data = nextProps.availableVehicles.slice(0);
      if (!waitingForTimes) {
        data.sort((a, b) => {
          if (a.routeTime === -1) return 1;
          if (b.routeTime === -1) return -1;
          if (a.routeTime < b.routeTime) return -1;
          return 1;
        });
      }

      this.setState({
        waitingForTimes: waitingForTimes,
        data: data,
        sortedVehicles: !waitingForTimes
      });
    }
  }

  keyExtractor = (item, index) => index;

  renderItem = ({ item, index }) => (
    <SelectVehicleItem
      data={item}
      index={index}
      sortedVehicles={this.state.sortedVehicles}
      onPressItem={this.props.onSelectVehicle}
      onGetVehicleTime={this.props.onGetVehicleTime}
    />
    //  id={item.id}
    //  onPressItem={this._onPressItem}
    //  selected={!!this.state.selected.get(item.id)}
    //  title={item.title}
  );

  render() {
    //console.log("render select vehicles debug now", this.state);
    const { inNextTransition, inPrevTransition, width } = this.props;

    if (inNextTransition || inPrevTransition || this.state.waitingForTimes) {
      return (
        <View
          style={{
            paddingTop: 48,
            paddingBottom: 0,
            width: "auto",
            height: "auto",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            flexWrap: "nowrap"
          }}
        >
          {[0, 1, 2, 3].map(i => <SelectVehicleItem key={i} index={i} />)}
        </View>
      );
    }

    //console.log("render select vehicles debug now SHOW ", this.state);
    return (
      <View
        style={{
          paddingTop: 38,
          width: "auto",
          height: "auto"
        }}
      >
        <FlatList
          horizontal={true}
          legacyImplementation={false}
          data={this.state.data}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

export default SelectVehicle;
