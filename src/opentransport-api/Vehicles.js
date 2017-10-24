/* class Vehicles is singleton class handling Vehicles OpenTransport API  */
export class Vehicles {
  constructor(props) {}

  get() {
    return fetch("https://facebook.github.io/react-native/movies.json")
      .then(response => response.json())
      .then(responseJson => {
        return responseJson.movies;
      })
      .catch(error => {
        //console.error(error);
      });
  }
}

export let vehicles = new Vehicles();
