import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  AsyncStorage,
  FlatList,
  View
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

        for (let user of responseJson.users) {
          if (user.picture === undefined){
            user.picture = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/768px-Circle-icons-profile.svg.png"
          } else if (!(user.picture.split(':')[0] === "https")){
            user.picture =  Api + "/" + user.picture
          }
          result.push(user);
        }

        // result = responseJson.users

        this.setState({users: result})
        this.setState({ location, loading: false })
      })
      .catch((error) => {
        console.error(error);
      });
  }


  render () {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Liste</Text>

        {this.state.users.map(user =>
          <ListItem
            leftAvatar={{
              source: { uri: user.picture }
            }}
            title={user.name}
            subtitle={user.position + " chez " + user.enterprise}
            chevron
            onPress={() => {this.props.navigation.navigate('UserProfile', {'user': user})}}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold'
  }
});
