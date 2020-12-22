import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  FlatList
} from 'react-native';
// import { ExpoLinksView } from '@expo/samples';
import { Avatar, ListItem, Overlay, Icon, Text } from 'react-native-elements';
import Api from '../constants/Api';

export default class UserProfile extends React.Component {

  state = {
    uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/768px-Circle-icons-profile.svg.png',
    name: "Name",
    initials: "BT",
    position: "Position",
    enterprise: "Enterprise",
    availability: {
      a6to8: false,
      a8to12: false,
      a12to14: false,
      a14to18: false,
      a18to22: false
    },
    interests: {
      business: false,
      carsharing: false,
      restaurant: false,
      shopping: false,
      spectacle: false,
      sport: false,
      tourism: false,
    },
    loading: true
  }

  componentDidMount(){
    let user = this.props.navigation.state.params.user;
    if (user.picture !== null && user.picture !== undefined){
      if (user.picture.split(':')[0] === "https" || user.picture.split(':')[0] === "http"){
        this.setState({uri : user.picture})
      } else {
        this.setState({uri : Api + "/" + user.picture})
      }
    }

    return fetch(Api + '/api/availability/' + user.availability)
    .then((response) => response.json())
    .then((json) => {
      this.setState({availability: {
        a6to8: json.availability.a6to8,
        a8to12: json.availability.a8to12,
        a12to14: json.availability.a12to14,
        a14to18: json.availability.a14to18,
        a18to22: json.availability.a18to22
      }});

      return fetch(Api + '/api/interests/' + user.interests)
      .then((response) => response.json())
      .then((json) => {
        this.setState({ interests: {
          business: json.interests.business,
          carsharing: json.interests.carsharing,
          restaurant: json.interests.restaurant,
          shopping: json.interests.shopping,
          spectacle: json.interests.spectacle,
          sport: json.interests.sport,
          tourism: json.interests.tourism,
        }})
        this.setState({
          name: user.name,
          initials: user.name.split(" ").map((n)=>n[0]).join(""),
          position: user.position,
          enterprise: user.enterprise,
          loading: false
        })
      })
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render () {
    return (
      <ScrollView style={styles.container}>
      <View>
        <Avatar
          rounded
          source={{
            uri: this.state.uri
          }}
          style={{width: 150, height: 150, alignSelf: 'center', marginTop: 30}}
          // iconSize={{width: 50, height: 50}}
          title={this.state.initials}
          size="xlarge"
        />
        <View style={{alignItems: 'center', marginTop: 30, marginBottom: 30}}>
          <Text style={{fontWeight: 'bold', fontSize: 20}}>{this.state.name}</Text>
          <Text style={{fontStyle: 'italic'}} >{this.state.position || "Poste"} at {this.state.enterprise || "Enterprise"}</Text>
        </View>
      </View>
      <View>
        <Text style={styles.keyWordTitle}>Interests</Text>
        <View style={{flexDirection: 'row', marginBottom: 30}}>
          <Text style={{flex: 1, lineHeight: 30, marginBottom: 30, textAlign: 'center'}}>
          { this.state.interests.business ? <Text style={styles.keyWordText}>Business </Text> : <Text></Text> }
          { this.state.interests.carsharing ? <Text style={styles.keyWordText}> Car Sharing </Text> : <Text></Text> }
          { this.state.interests.restaurant ? <Text style={styles.keyWordText}> Restaurant </Text> : <Text></Text> }
          { this.state.interests.shopping ? <Text style={styles.keyWordText}> Shopping </Text> : <Text></Text> }
          { this.state.interests.spectacle ? <Text style={styles.keyWordText}> Show </Text> : <Text></Text> }
          { this.state.interests.sport ? <Text style={styles.keyWordText}> Sport </Text> : <Text></Text> }
          { this.state.interests.tourism ? <Text style={styles.keyWordText}> Tourism </Text> : <Text></Text> }
          </Text>
        </View>
      </View>

      <View>
        <Text style={styles.keyWordTitle}>Availability</Text>
        <View style={{flexDirection: 'row', marginBottom: 30}}>
          <Text style={{flex: 1, lineHeight: 30, marginBottom: 30, textAlign: 'center'}}>
          { this.state.availability.a6to8 ? <Text style={styles.keyWordText}> 6am to 8am </Text> : <Text></Text> }
          { this.state.availability.a8to12 ? <Text style={styles.keyWordText}> 8am to 12pm  </Text> : <Text></Text> }
          { this.state.availability.a12to14 ? <Text style={styles.keyWordText}> 12pm to 2pm  </Text> : <Text></Text> }
          { this.state.availability.a14to18 ? <Text style={styles.keyWordText}> 2pm to 6pm </Text> : <Text></Text> }
          { this.state.availability.a18to22 ? <Text style={styles.keyWordText}> 6pm to 10pm </Text> : <Text></Text> }
          </Text>
        </View>
      </View>

      <View>
        <Text style={styles.keyWordTitle}>Coordinates</Text>
        <View style={{ marginBottom: 30}}>
          <Text style={{textAlign:'center', flexDirection: 'column'}}>
          {this.props.navigation.state.params.user.authorizationForPrintingEmail ? <Text style={{flex: 1, letterSpacing: 1.5}}>{this.props.navigation.state.params.user.email}  {"\n"} {"\n"}</Text> : <Text style={{letterSpacing: 1.5}}> He/she don't want to share his/her email :( {"\n"} {"\n"} </Text>}
          {this.props.navigation.state.params.user.authorizationForPrintingPhone ? <Text style={{flex: 1, letterSpacing: 1.5}}>{this.props.navigation.state.params.user.phoneNumber}</Text> : <Text style={{letterSpacing: 1.5}}> She/he don't want to share her/his phone number :( </Text>}
          </Text>
        </View>
      </View>


      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  keyWordText: {
    fontSize: 16,
    padding: 6,
    // fontWeight: 'bold',
    color: 'black',
    letterSpacing: 1.5,
    textAlign: 'center'
  },
  keyWordTitle: {
    fontSize: 20,
    marginLeft: 15,
    fontWeight: 'bold',
    marginBottom: 15
  }
});
