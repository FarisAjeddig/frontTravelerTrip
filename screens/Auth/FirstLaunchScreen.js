import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Modal,
  ImageBackground,
  AsyncStorage,
  Dimensions,
  Alert,
  TouchableHighlight
} from 'react-native';
import * as Facebook from 'expo-facebook';
import { CheckBox } from 'react-native-elements';
import {TextField} from 'react-native-material-textfield';
import PasswordInputText from 'react-native-hide-show-password-input';
import Api from '../../constants/Api';

const fbId = "237940337207466";
const fbSecret = "2c22afd4578ecbff2eea71d76be8d0f6";

export default class FirstLaunchScreen extends React.Component {

    constructor(props) {
        super(props);

        this.state = ({
            checked: false,
            modalVisible: false,
            messageError: ""
        })
    }

    submit() {
      let error = "";
      if (error === "") {
          return (this.submitToAPI());
      }
      else {
          this.setState({messageError: error});
          this.setState({modalVisible: true});
          return [];
      }
    }


    submitToAPI() {
      console.log('SubmitToAPI');
      let data = {
        method: 'POST',
        credentials: 'same-origin',
        mode: 'same-origin',
        body: JSON.stringify({
          email: this.email
        }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      };

      return fetch( Api + '/api/login', data)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        })
      .catch((error) => {
        console.error(error);
      });
    }

    render() {
      return (
          <ScrollView>
            <Modal
              animationType="fade"
              transparent={true}
              visible={this.state.modalVisible}
              onRequestClose={() => {
                this.setState({modalVisible: false})}
              }>
              <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', paddingLeft: 60, paddingRight: 60 }}>
                <View style={{backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', paddingTop: 20, paddingBottom: 20, paddingRight: 10, paddingLeft: 10}}>
                  <Text style={{fontSize:20, fontWeight: 'bold'}}>Erreur</Text>
                  <Text>{this.state.messageError}</Text>
                  <TouchableHighlight
                    style={{backgroundColor: "#0011af", alignSelf: 'stretch', marginRight: 20, marginLeft: 20}}
                    onPress={() => this.setState({modalVisible: false})}>
                    <Text style={{textAlign: 'center', color: 'white', paddingTop: 15, paddingBottom: 15}}>Fermer</Text>
                  </TouchableHighlight>
                </View>
              </View>
            </Modal>

            <View style={{margin: 20}}>
            <Text style={{fontSize: 25, color: 'red'}}>Dîtes nous en plus !</Text>
            <Text>Ces données nous permettront de vous proposer des personnes avec lesquels vous "matchez" :)</Text>
            <Text>Quand êtes vous disponible pour rencontrer d'autres voyageurs d'affaire ?</Text>
            <CheckBox
              title='Click Here'
              checked={this.state.checked}
              onPress={() => { this.setState({ checked: !this.state.checked }); }}
            />

            <CheckBox
              center
              title='Click Here'
              checked={this.state.checked}
            />

            <CheckBox
              center
              title='Click Here'
              checkedIcon='dot-circle-o'
              uncheckedIcon='circle-o'
              checked={this.state.checked}
            />
            </View>
          </ScrollView>
      )
  }
}

FirstLaunchScreen.navigationOptions = {
  header: null,
};
