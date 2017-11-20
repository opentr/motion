import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, Text, FlatList } from "react-native";

import config from "../../config/config";
import styles from "../../styles/styles";

import moment from "moment";

class Trips extends PureComponent {
  static propTypes = {};

  static defaultProps = {
    ...PureComponent.defaultProps
  };

  constructor(props) {
    super(props);
  }

  componentWillUpdate(nextProps, nextState) {}

  keyExtractor = (item, index) => index;

  renderItem = ({ item, index }) => (
    <View style={styles.trips.item}>
      <Text
        numberOfLines={1}
        style={[styles.trips.text, styles.trips.textLocation]}
      >
        {item.address}
      </Text>
      <Text
        numberOfLines={1}
        style={[styles.trips.text, styles.trips.textDate]}
      >
        {item.date}
      </Text>
    </View>
  );

  render() {
    const { user } = this.props;
    return (
      <View style={styles.trips.holder}>
        <FlatList
          style={{ width: "100%" }}
          legacyImplementation={false}
          data={this.props.trips}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

export default Trips;
