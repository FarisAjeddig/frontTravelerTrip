import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  AsyncStorage,
  Alert,
  View
} from 'react-native';
import { Button } from 'react-native-elements';
import Api from '../../constants/Api';

export default class ContactUs extends React.Component {

  constructor(props) {
      super(props);
      this.message = "";
      this.id = "";

      this.state = {
        loading: false
      }
  }

  componentDidMount = () => {
    AsyncStorage.getItem('id').then(value => {
      this.id = value
    })
  }

  _onMessageChange(text){
    this.message=text;
    console.log(this.message);
  }

  submit(){
    this.setState({loading: true});
    if (this.message == "") {
      Alert.alert("Your message is empty.")
      this.setState({loading: false})
    } else {
      let data = {
        method: 'POST',
        credentials: 'same-origin',
        mode: 'same-origin',
        body: JSON.stringify({
          id: this.id,
          message: this.message
        }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      };

      return fetch( Api + '/api/contact', data)
      .then((response) => response.json())
      .then((responseJson) => {
        switch (responseJson.statut) {
          case 'ERROR':
            this.setState({messageError: responseJson.message});
            this.setState({modalVisible: true});
            break;
          case 'SUCCESS':
            Alert.alert("Your message has been sent, we will get back to you with the details associated with your account quickly!")
            this.props.navigation.navigate('Profil');
            break;
          default:
            Alert.alert("Try again, there was an error.")
            break;
          }
        })
      .catch((error) => {
        console.error(error);
      });
    }
  }

  render () {
    return (
      <ScrollView style={styles.container}>
        <Text style={{textAlign: 'center', fontSize: 20, marginBottom: 30}}>Contact us</Text>
        <TextInput
          style={styles.TextInputStyleClass}
          underlineColorAndroid="transparent"
          placeholder={"How can we help you ?"}
          placeholderTextColor={"#9E9E9E"}
          numberOfLines={10}
          multiline={true}
          onChangeText={(text) => {this._onMessageChange(text)}}
        />
        <View style={{marginTop: 50}} />
        <Button
          title="Send"
          onPress={() => {this.submit()}}
          loading={this.state.loading}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    // backgroundColor: '#fff',
    margin: 20
  },
  TextInputStyleClass:{
    textAlign: 'center',
    borderWidth: 2,
    borderColor: '#9E9E9E',
    borderRadius: 20 ,
    backgroundColor : "#FFFFFF",
    height: 150
  }
});
