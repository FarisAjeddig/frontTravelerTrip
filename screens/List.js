import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  AsyncStorage,
  FlatList,
  View,
  ActivityIndicator
} from 'react-native';
import { List, ListItem } from 'react-native-elements'
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import Api from '../constants/Api';

export default class ListScreen extends React.Component {

  constructor(props) {
      super(props);
      this.email = "";
  }

  state = {
    users: [],
    loading: true
  }

  componentDidMount() {
    AsyncStorage.getItem('email').then((value) => {
      if (value !== null){
        this.email = value;
      }
    });
    this._getLocation();
  }

  _getLocation = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted'){
      // console.log('PERMISSION NOT GRANTED');
    }
    const location = await Location.getCurrentPositionAsync();
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
            console.log(responseJson.common);
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
              this.setState({users: result, loading: false})
            }
          })
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }


  render () {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Liste</Text>
        {this.state.loading  ?
          <ActivityIndicator size={100} color="#7bacbd" />
          :
        this.state.users.map(user =>
          <ListItem
            leftAvatar={{
              source: { uri: user.picture }
            }}
            key={user._id}
            title={user.name}
            subtitle={user.position + " chez " + user.enterprise}
            chevron
            onPress={() => {this.props.navigation.navigate('UserProfile', {'user': user})}}
          />
        )
      }
      {this.state.users.length === 0  && this.state.loading === false ?
        <Text style={{marginTop: 30, fontSize: 16, textAlign: 'center'}}>Pas de correspondance pour le moment. Réessayez plus tard</Text> :
      <Text></Text>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
    marginTop: 20
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold'
  }
});
