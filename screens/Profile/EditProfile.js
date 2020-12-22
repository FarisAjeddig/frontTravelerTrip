import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  Alert
} from 'react-native';
import { Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import Api from '../../constants/Api';

export default class EditProfile extends React.Component {

  constructor(props) {
      super(props);
  }

  state = {
    name: "name",
    position: "position",
    enterprise: "enterprise",
    id: ""
  }

  async setDataToAsyncStorage(keys, values){
    for (let p=0; p<keys.length; p++){
      AsyncStorage.setItem(keys[p], values[p]);
    }
  };

  componentDidMount = () => {
    let keys = ['name', 'position', 'enterprise', 'id'];
      AsyncStorage.multiGet(keys, (err, stores) => {
        stores.map((result, i, store) => {
        switch (store[i][0]) {
          case 'name':
            this.setState({name: store[i][1]})
            break;
          case 'position':
            this.setState({position: store[i][1]})
            break;
          case 'enterprise':
            this.setState({enterprise : store[i][1]})
            break;
          case 'id':
            this.setState({id : store[i][1]})
            break;
          default:
            break;
          }
        })
      })
  }

  _OnNameChange(text) {
    this.setState({name: text})
  }

  _OnPostChange(text) {
    this.setState({position: text})
  }

  _OnEnterpriseChange(text) {
    this.setState({enterprise: text})
  }

  _submit(){
    if (this.state.name === "" || this.state.position === "" || this.state.enterprise === "" || this.state.position === null || this.state.enterprise === null){
      Alert.alert('Please fill in all fields');
    } else {
      let data = {
        method: 'POST',
        credentials: 'same-origin',
        mode: 'same-origin',
        body: JSON.stringify({
          id: this.state.id,
          enterprise: this.state.enterprise,
          position: this.state.position,
          name: this.state.name
        }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      };

      return fetch( Api + '/api/profile/editInfo', data)
      .then((response) => response.json())
      .then((responseJson) => {
        let keys = [
          'name',
          'position',
          'enterprise'
        ];
        let values = [
          this.state.name,
          this.state.position,
          this.state.enterprise
        ];
        this.setDataToAsyncStorage(keys, values);
        this.props.navigation.state.params.refreshFunction(this.props.navigation.state.params._this);
        this.props.navigation.goBack();
      })
      .catch((error) => {
        console.error(error);
      });
    }
  }

  render () {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.input} >
          <Input
            placeholder='Last and first name'
            leftIcon={
              <Icon
                name='user'
                size={25}
                color='black'
                style={{marginRight: 20}}
              />
            }
            onChangeText={(text) => {this._OnNameChange(text)}}
            label="Last and first name"
            value={this.state.name}
          />
        </View>
        <View style={styles.input} >
          <Input
            placeholder='Position'
            leftIcon={
              <Icon
                name='address-card'
                size={25}
                color='black'
                style={{marginRight: 20}}
              />
            }
            onChangeText={(text) => {this._OnPostChange(text)}}
            label="Position"
            value={this.state.position}
          />
        </View>
        <View style={styles.input}>
          <Input
            placeholder='Enterprise'
            leftIcon={
              <Icon
                name='building'
                size={25}
                color='black'
                style={{marginRight: 20}}
              />
            }
            onChangeText={(text) => {this._OnEnterpriseChange(text)}}
            label="Enterprise"
            value={this.state.enterprise}
          />
        </View>
        <View style={{marginTop: 30 }} />
        <Button
          title="EDIT"
          onPress={() => {this._submit()}}
        />

    </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 35,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    paddingBottom: 20,
  }
});
