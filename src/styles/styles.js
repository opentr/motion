import { StyleSheet } from "react-native";
import config from "../config/config";

const styles = {
  app: {
    ...StyleSheet.absoluteFillObject
  },
  fullScreen: {
    ...StyleSheet.absoluteFillObject
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  marker: {
    width: 10,
    height: 20
  },
  baseText: {
    fontSize: 20,
    color: config.colors.text
  },
  buttonText: {
    fontSize: 30,
    color: config.colors.primary
  }
};

export default StyleSheet.create(styles);
