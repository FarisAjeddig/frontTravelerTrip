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
  AsyncStorage,
  ActivityIndicator
} from 'react-native';
import { Avatar } from 'react-native-elements';

import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';

import { MonoText } from '../components/StyledText';
import Api from '../constants/Api';

export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(position => resolve(position), e => reject(e));
  });
};

export default class MapScreen extends React.Component {


  constructor(props) {
      super(props);
      this.email = "";
  }

  state = {
    location: {
      coords: {
        latitude: 55.6253813,
        longitude: 28.4440129,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421

      }
    },
    users: [],
    loading: true
  }

  componentDidMount(){
    AsyncStorage.getItem('email').then((value) => {
      if (value !== null){
        this.email = value;
      }
    });

    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      this._getLocation();
    });

    return getCurrentLocation().then(position => {
      if (position) {
        this._getLocation();
        this.setState({
          location: {coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        });
      }
    });
  }

  _getLocation = async () => {
    const { status } = await Permissions.getAsync(Permissions.LOCATION);
    if (status !== 'granted'){
      // console.log('PERMISSION NOT GRANTED');
    }
    const location = await Location.getCurrentPositionAsync();
    this.setState({ location: {coords: {latitude: location.coords.latitude, longitude: location.coords.longitude}} })
    this._getOtherUsers(location)
    this.submitToAPI(location)
    this.setState({loading: false})
  }

  // Calcul de la distance entre deux points. unit : 'K' pour kilometres, 'M' pour miles, 'N' pour Nautic
  distance = (lat1, lon1, lat2, lon2, unit) => {
  	if ((lat1 == lat2) && (lon1 == lon2)) {
  		return 0;
  	}
  	else {
  		var radlat1 = Math.PI * lat1/180;
  		var radlat2 = Math.PI * lat2/180;
  		var theta = lon1-lon2;
  		var radtheta = Math.PI * theta/180;
  		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  		if (dist > 1) {
  			dist = 1;
  		}
  		dist = Math.acos(dist);
  		dist = dist * 180/Math.PI;
  		dist = dist * 60 * 1.1515;
  		if (unit=="K") { dist = dist * 1.609344 }
  		if (unit=="N") { dist = dist * 0.8684 }
  		return dist;
  	}
  }

  _getOtherUsers = async (location) => {
    return fetch( Api + "/api/geoloc/users/" + location.coords.longitude + "/" + location.coords.latitude + "/" + this.email)
      .then((response) => response.json())
      .then((responseJson) => {
        var result = [];
        var i = 0;
        var numberUsers = responseJson.users.length;
        for (let user of responseJson.users) {
          fetch(Api + "/api/geoloc/common/" + user._id + "/" + this.email)
          .then((response) => response.json())
          .then((responseJson) => {
            if (responseJson.common == 'true'){
              if (user.picture === undefined){
                user.picture = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/768px-Circle-icons-profile.svg.png"
              } else if (!(user.picture.split(':')[0] === "https")){
                user.picture =  Api + "/" + user.picture
              }
              result.push(user);
            }
            i = i+1;
            if (i == numberUsers){
              this.setState({users: result})
            }
          })
        }
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
        email: this.email,
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
          // ToastAndroid.show(responseJson.message);
          break;
        case 'SUCCESS':
          // ToastAndroid.show('Nouvelle position enregistrée.', ToastAndroid.SHORT);
          // this.setState({ location: {coords: {latitude: location.coords.latitude, longitude: location.coords.longitude}} })
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

  onRegionChange(region) {
    this.setState({ location: {coords: { latitude : region.latitude, longitude: region.longitude}} });
  }

  prevtime = Date.now()-12000;

  render() {
    if (!this.state.loading){
      Location.watchPositionAsync({
        accuracy: Location.Accuracy.Balanced
      },
        location => {
          if ((Date.now() - this.prevtime) > 10000){
            this.prevtime = Date.now();
            // ToastAndroid.show('Nouvelle position récupérée.', ToastAndroid.SHORT);
            // Send new coords to back-end
            this.submitToAPI(location)
            // Get others users actualized
            this._getOtherUsers(location)
            this.setState({ location: {coords: {latitude: location.coords.latitude, longitude: location.coords.longitude}} })
          }
        }
      );
    }

    return (
      <View style={styles.container}>
        <MapView
          style={styles.mapView}
          initialRegion={{
            latitude: this.state.location.coords.latitude,
            longitude: this.state.location.coords.longitude,
            latitudeDelta: 10.922,
            longitudeDelta: 10.421
          }}
          followUserLocation={true}
          paddingAdjustmentBehavior="automatic"
          liteMode={false}
          mapType="standard"
          showsUserLocation={true}
          showsMyLocationButton
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
          region={{
            latitude: this.state.location.coords.latitude,
            longitude: this.state.location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421}}
          // onRegionChangeComplete={e => this.setState({ location: {coords: e } })}
        >
        {this.state.users.map(user => (
          <MapView.Marker
            coordinate={{
              latitude: parseFloat(user.lastLat),
              longitude: parseFloat(user.lastLong)
            }}
            title={user.name}
            description={user.position + " chez " + user.enterprise}
            key={user._id}
            onCalloutPress={() => {this.props.navigation.navigate('UserProfile', {'user': user})}}
          >
          <Avatar rounded
          source={{
            uri: user.picture
          }}
          size="small"
          />
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
