import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import MapView from 'react-native-maps';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Alert,
  ToastAndroid,
  AsyncStorage
} from 'react-native';

import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';

import { MonoText } from '../components/StyledText';
import Api from '../constants/Api';

export default class MapScreen extends React.Component {


  constructor(props) {
      super(props);
      this.email = "";
  }

  state = {
    location: {
      coords: {
        latitude: 48.6253813,
        longitude: 2.4440129
      }
    },
    users: []
  }

  componentDidMount(){
    AsyncStorage.getItem('email').then((value) => {
      console.log(value);
      if (value !== null){
        console.log("VALUE : " + value);
        this.email = value;
      }
    });
    this._getLocation();
  }

  _getLocation = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted'){
      console.log('PERMISSION NOT GRANTED');
    }
    const location = await Location.getCurrentPositionAsync();
    this._getOtherUsers(location)
    this.setState({ location })
  }

  _getOtherUsers = async (location) => {
    return fetch( Api + "/api/geoloc/users/" + location.coords.longitude + "/" + location.coords.latitude)
      .then((response) => response.json())
      .then((responseJson) => {
        var result = [];
        for(var i in responseJson){
          result.push(responseJson[i]);
        }
        console.log(result[0]);
        this.setState({users: result[0]})
      })
      .catch((error) => {
        console.error(error);
      });
  }


  submitToAPI(location) {
    let data = {
      method: 'POST',
      credentials: 'same-origin',
      mode: 'same-origin',
      body: JSON.stringify({
        email: this.email ? this.email : "fajeddig@hotmail.fr",
        coords: location.coords
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    };

    fetch( Api + '/api/geoloc/position', data)
    .then((response) => response.json())
    .then((responseJson) => {
      switch (responseJson.statut) {
        case 'ERROR':
          ToastAndroid.show(responseJson.message);
          break;
        case 'SUCCESS':
          ToastAndroid.show('Nouvelle position enregistrée.', ToastAndroid.SHORT);
          break;
        default:
          ToastAndroid.show("Il y a eu une erreur.");
          break;
        }
      })
    .catch((error) => {
      console.error(error);
    });
  }

  goToInitialLocation() {
    let initialRegion = Object.assign({}, this.state.location);
    initialRegion["latitudeDelta"] = 0.005;
    initialRegion["longitudeDelta"] = 0.005;
    this.mapView.animateToRegion(initialRegion, 2000);
  }

  prevtime = Date.now()-12000;

  render() {
    Location.watchPositionAsync({
      accuracy: Location.Accuracy.Balanced
    },
      location => {
        if ((Date.now() - this.prevtime) > 10000){
          this.prevtime = Date.now();
          ToastAndroid.show('Nouvelle position récupérée.', ToastAndroid.SHORT);
          // Send new coords to back-end
          this.submitToAPI(location)
          this._getOtherUsers(location)
        }
        this.setState({location: this.state.location})
      }
    );
    return (
      <View style={styles.container}>
      {/* <Text>{JSON.stringify(this.state.location)}</Text> */}
        <MapView
          style={styles.mapView}
          initialRegion={{
            latitude: this.state.location.coords.latitude,
            longitude: this.state.location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
          followUserLocation={true}
          paddingAdjustmentBehavior="automatic"
          liteMode={false}
          mapType="standard"
          showsUserLocation={true}
          showsMyLocationButton={false}
          userLocationPriority="high"
          showsPointsOfInterest={false}
          showsCompass={true}
          showsBuildings={false}
          showsTraffic={false}
          showsIndoors={false}
          showsIndoorLevelPicker={true}
          minZoomLevel={1}
          loadingEnabled={true}
          animateToRegion={{
            region:{
              latitude: this.state.location.coords.latitude,
              longitude: this.state.location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            },
            duration: 2000
          }}
        >
        {this.state.users.map(user => (
          <MapView.Marker
            coordinate={{
              latitude: parseFloat(user.lastLat),
              longitude: parseFloat(user.lastLong)
            }}
            title={user.email}
            description={user.password}
            key={user._id}
          >
          <Image source={require('../assets/images/marker.png')} style={{ width: 40, height: 40 }} />
          </MapView.Marker>
        ))}
        </MapView>
      </View>
    );
  }
}

MapScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapView: {
    width: Dimensions.get('window').width ,
    height: Dimensions.get('window').height
  }
});
