import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import { Avatar, ListItem, Overlay, Icon } from 'react-native-elements';
import Api from '../constants/Api';

export default class UserProfile extends React.Component {

  state = {
    uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/768px-Circle-icons-profile.svg.png',
    name: "Prénom NOM",
    initials: "PN",
    position: "Poste",
    enterprise: "Entreprise",
    loading: true
  }

  componentDidMount(){
    let user = this.props.navigation.state.params.user;
    if (user.picture !== null && user.picture !== undefined){
      if (user.picture.split(':')[0] === "https"){
        this.setState({uri : user.picture})
      } else {
        this.setState({uri : Api + "/" + user.picture})
        console.log(user.picture.split(':')[0]);
      }
    }
    this.setState({
      name: user.name,
      initials: user.name.split(" ").map((n)=>n[0]).join(""),
      position: user.position,
      enterprise: user.enterprise,
      loading: false
    })
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
          iconSize={{width: 50, height: 50}}
          title={this.state.initials}
          size="xlarge"
        />
        <View style={{alignItems: 'center', marginTop: 30, marginBottom: 30}}>
          <Text style={{fontWeight: 'bold', fontSize: 20}}>{this.state.name}</Text>
          <Text style={{fontStyle: 'italic'}} >{this.state.position || "Poste"} chez {this.state.enterprise || "Enterprise"}</Text>
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
});
