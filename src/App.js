import React, { PureComponent } from "react";

import { Provider } from "react-redux";

import store from "./store/";

import AppView from "./AppView";

class App extends PureComponent {
  render() {
    return (
      <Provider store={store}>
        <AppView />
      </Provider>
    );
  }
}

export default App;
