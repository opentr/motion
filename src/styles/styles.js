import { StyleSheet, Platform } from "react-native";

import config from "../config/config";

const styles = {
  app: {
    ...StyleSheet.absoluteFillObject
  },
  fullScreen: {
    ...StyleSheet.absoluteFillObject
  },
  appVersion: {
    position: "absolute",
    top: 0,
    right: 0,
    color: "white",
    paddingLeft: 3,
    paddingRight: 3,
    backgroundColor: "rgba(0,0,0,.5)"
  },
  buttonText: {
    fontSize: 20,
    color: config.colors.primary
  },
  actionText: {
    fontSize: 20,
    color: config.colors.secondary
  },

  backButton: {
    holder: {
      position: "absolute",
      top: 12,
      left: 8,
      zIndex: 100
    },
    icon: {
      width: 32,
      height: 32
    }
  },
  sidebar: {
    holder: {
      position: "absolute",
      top: 0,
      left: 0
    },
    panelBackground: {
      position: "absolute",
      top: 0,
      backgroundColor: "white",
      zIndex: 2
    },
    menu: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 500
    },
    profile: {
      holder: {
        position: "absolute",
        top: 10,
        left: 10
      },
      image: {
        width: 40,
        height: 40,
        borderRadius: 24
      }
    },
    button: {
      position: "absolute",
      left: 20,
      fontSize: 30,
      color: config.colors.primary
    },
    buttonLogout: {
      position: "absolute",
      bottom: 60,
      left: 20,
      fontSize: 24,
      color: config.colors.text
    },
    expanded: {
      backIcon: {
        left: -4,
        marginBottom: 40
      },
      holder: {
        zIndex: 400,
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        ...StyleSheet.absoluteFillObject,
        padding: 30
      }
    }
  },
  trips: {
    holder: { width: "100%" },
    item: {
      flex: 1,
      marginBottom: 5,
      flexDirection: "row",
      justifyContent: "space-between"
    },
    text: {
      fontSize: 20,

      color: config.colors.secondary
    },
    textLocation: {
      width: "60%"
    },
    textDate: {
      textAlign: "right",
      color: "#7a7a7a"
    }
  },
  login: {
    firstStep: {
      height: 90
    },
    holder: {
      flexDirection: "column",
      width: "100%",
      height: "auto",
      height: 140,
      justifyContent: "center",
      alignItems: "center"
    },
    button: {
      fontSize: 24,
      color: config.colors.primary,
      textAlign: "center",
      textAlignVertical: "center",
      paddingTop: 8,
      paddingBottom: 8
    },
    loginButton: {
      height: 90
    }
  },
  map: {
    holder: {
      position: "absolute",
      top: 0
    },
    marker: {
      zIndex: 1000
    },
    markerFromTo: {
      holder: {
        maxWidth: 160,
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        transform: [{ translateY: Platform.OS === "ios" ? -30 : 0 }]
      },
      label: {
        padding: 3,
        borderRadius: 5
      },
      labelText: {
        color: "white",
        padding: 3
      },
      activityHolder: {
        width: 160,
        paddingTop: 4,
        paddingBottom: 3
      },
      pinLine: {
        width: 3,
        maxWidth: 3,
        height: 28
      }
    },
    vehicle: {
      zIndex: 990
    },
    recenterButton: {
      holder: {
        position: "absolute",
        top: 8,
        right: 8,
        zIndex: 20
      },
      image: {
        width: 24,
        height: 24
      }
    },
    overlay: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "transparent"
    }
  },
  ordering: {
    holder: {
      position: "absolute",
      backgroundColor: "rgba(0,0,0,0)",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      zIndex: 10
    },
    background: {
      position: "absolute",
      top: 40,
      backgroundColor: "white"
    },
    steps: {
      marginTop: 35
    },
    fromToTime: {
      holder: {
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center"
      },
      title: {
        fontSize: 18,
        color: config.colors.text,
        marginTop: 35,
        textAlignVertical: "center",
        textAlign: "center"
      },
      value: {
        textAlign: "center",
        textAlignVertical: "center",
        marginTop: 20
      },
      button: {
        marginTop: 20
      }
    },
    addressInput: {
      holder: { flexDirection: "column" },
      inputText: {
        fontSize: 20,
        height: Platform.OS === "ios" ? 32 : 42,
        textAlign: "left",
        textAlignVertical: "center",
        marginTop: 0
      },
      inputUnderline: {
        backgroundColor: config.colors.secondary,
        height: 2
      },
      label: {
        fontSize: 12,
        letterSpacing: 2,
        marginBottom: 3
      },
      labelSearch: {
        marginTop: 10
      },
      resultsHolder: {
        marginTop: 10,
        paddingLeft: 4
      },
      result: {
        color: config.colors.text,
        fontSize: 16,
        fontSize: 16,
        marginBottom: 3
      }
    },
    confirmation: {
      holder: {
        marginTop: 10,
        width: "auto",
        height: "auto",
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "flex-start",
        paddingLeft: 10,
        paddingRight: 10
      },
      label: {
        marginTop: 10,
        marginBottom: 4,
        fontSize: 16,
        height: 22,
        color: config.colors.text,
        textAlignVertical: "top",
        textAlign: "left"
      },
      info: {
        fontSize: 20,
        height: 30,
        color: config.colors.secondary,
        textAlignVertical: "top",
        textAlign: "left"
      },
      button: {
        marginTop: 18,
        fontSize: 30,
        color: config.colors.primary,
        textAlign: "center",
        width: "100%"
      }
    },
    vehicleSelect: {
      holderLoading: {
        paddingTop: 20,
        paddingBottom: 0,
        width: "auto",
        height: "auto",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        flexWrap: "nowrap"
      },
      holder: {
        paddingTop: 10,
        width: "auto",
        height: "auto"
      },
      vehicle: {
        holder: {
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center",
          paddingLeft: 10,
          paddingRight: 10,
          paddingBottom: 10
        },
        make: {
          fontSize: 15,
          width: 83,
          color: config.colors.primary,
          textAlignVertical: "center",
          textAlign: "center",
          height: 40,
          marginTop: 10,
          backgroundColor: "white"
        },
        makePlaceholder: {
          height: 30,
          marginTop: 0,
          backgroundColor: "#f2f2f2"
        },
        image: {
          width: 105,
          height: 60,
          marginTop: 5
        },
        imagePlaceholder: {
          width: 100,
          marginTop: 15
        },
        time: {
          fontSize: 15,
          lineHeight: 24,
          width: 85,
          marginTop: 0,
          color: config.colors.text,
          textAlignVertical: "center",
          textAlign: "center",
          backgroundColor: "white"
        },
        timePlaceholder: {
          lineHeight: 16,
          width: 60,
          marginTop: 8,
          backgroundColor: "#f2f2f2"
        },
        price: {
          fontSize: 20,
          lineHeight: 30,
          marginTop: 0,
          width: 85,
          color: config.colors.text,
          textAlignVertical: "center",
          textAlign: "center",
          fontWeight: "bold",
          backgroundColor: "white"
        },
        pricePlaceholder: {
          lineHeight: 20,
          marginTop: 10,
          width: 60,
          backgroundColor: "#f2f2f2"
        },

        rating: {
          placeholder: {
            flexDirection: "row",
            width: 60,
            height: 24,
            paddingTop: 0,
            marginTop: 10,
            backgroundColor: "#f2f2f2"
          },
          holder: {
            flexDirection: "row",
            width: 105,
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 10
          },
          heart: {
            width: 24,
            height: 20,
            marginRight: 5
          },
          textHolder: {
            paddingTop: 2,
            paddingBottom: 4,
            paddingLeft: 6,
            paddingRight: 6,
            backgroundColor: config.colors.green
          },
          text: {
            color: "white",
            lineHeight: 18,
            fontSize: 18
          }
        }
      }
    },
    traveling: {
      holder: {
        width: "100%",
        height: "auto",
        minHeight: 70,
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: 35
      },
      text: {
        fontSize: 20,
        color: config.colors.secondary,
        textAlign: "center",
        textAlignVertical: "center"
      }
    }
  }
};

export default styles;
