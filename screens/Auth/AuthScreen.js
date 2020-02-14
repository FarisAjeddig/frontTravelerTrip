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
import {TextField} from 'react-native-material-textfield';
import PasswordInputText from 'react-native-hide-show-password-input';
import Api from '../../constants/Api';

const fbId = "237940337207466";
const fbSecret = "2c22afd4578ecbff2eea71d76be8d0f6";

export default class AuthScreen extends React.Component {

    constructor(props) {
        super(props);
        this.email = "";
        this.password = "";

        this.state = ({
            email: "",
            password: "",
            modalVisible: false,
            messageError: ""
        })
    }

    loginWithFacebook = async () => {
      try {
        await Facebook.initializeAsync(fbId);
        const { type, token, expires, permissions, declinedPermissions } = await Facebook.logInWithReadPermissionsAsync({
          permissions: ['public_profile', 'email'],
          behavior: 'native'
        });

        let data = {
          method: 'POST',
          credentials: 'same-origin',
          mode: 'same-origin',
          body: JSON.stringify({
            token: token,
          }),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        };

        return fetch( Api + '/api/sign/facebook', data)
        .then((response) => response.json())
        .then((responseJson) => {
          let keys = [
            'email'
          ];
          let values = [
            responseJson.user.email
          ];
          this.setDataToAsyncStorage(keys, values);


          this.props.navigation.navigate('FirstLaunch');
        })
        .catch((error) => {
          console.error(error);
        });

        // if (type === 'success') {
        //   // Get the user's name using Facebook's Graph API
        //   const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
        //   await console.log(response.json());
        //   Alert.alert('Logged in!', `Hi ${(await response.json()).name}!`);
        // } else {
        //   Alert.alert(type)
        //   // type === 'cancel'
        // }
      } catch ({ message }) {
        Alert.alert(`Facebook Login Error: ${message}`);
      }
    }

    async setDataToAsyncStorage(keys, values){
      for (i=0; i<keys.length; i++){
        AsyncStorage.setItem(keys[i], values[i]);
      }
    };

    onMailChange(mail) {
      this.email = mail
    }

    onPassChange(pass) {
      this.password = pass
    }

    submit() {
      let error = "";
      if (this.email === "") {
          error += "Adresse mail manquante\n"
      }
      if (this.password === "") {
          error += "Mot de passe manquant\n";
      }
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
      let data = {
        method: 'POST',
        credentials: 'same-origin',
        mode: 'same-origin',
        body: JSON.stringify({
          email: this.email,
          password: this.password
        }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      };

      return fetch( Api + '/api/login', data)
      .then((response) => response.json())
      .then((responseJson) => {
        switch (responseJson.statut) {
          case 'ERROR':
            this.setState({messageError: responseJson.message});
            this.setState({modalVisible: true});
            break;
          case 'SUCCESS':
            let keys = [
              'email'
            ];
            let values = [
              this.email
            ];
            this.setDataToAsyncStorage(keys, values);

            this.props.navigation.navigate('FirstLaunch');
            break;
          default:
            this.setState({messageError: "Réessayez, il y a eu une erreur."});
            this.setState({modalVisible: true});
            break;
          }
        })
      .catch((error) => {
        console.error(error);
      });
    }

    _goInscription() {
      this.props.navigation.navigate('SignUp');
    }

    render() {
      return (
          <ScrollView style={styles.container}>
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
              <TextField
                label="Identifiant"
                autoCapitalize="none"
                autoCorrect={false}
                textColor='black'
                baseColor='black'
                tintColor='black'
                fontSize={20}
                titleFontSize={17}
                onChangeText={(email) => this.onMailChange(email)}
                value={this.mail}
                placeholder="example@gmail.com"
                keyboardType='email-address'
              />
              <PasswordInputText
                  value={this.password}
                  iconColor='black'
                  autoCapitalize="none"
                  autoCorrect={false}
                  label="Mot de passe"
                  fontSize={20}
                  titleFontSize={17}
                  textColor='black'
                  baseColor='black'
                  tintColor='black'
                  placeholder="********"
                  onChangeText={(password) => this.onPassChange(password)}
              />
              <TouchableOpacity
                style={{backgroundColor: 'red',borderRadius: 2,alignSelf: 'center',marginTop: 20}}
                onPress={() => this.submit()}>
                <View style={{justifyContent:'center'}}>
                  <Text style={{justifyContent:'center',color: 'white',paddingTop: 15,paddingBottom: 15,fontSize: 18,marginLeft: 50,marginRight: 50, color: 'white'}}>CONNEXION</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={{alignItems: 'center', paddingTop: 20}} onPress={() => this.loginWithFacebook()}>
                <View style={{width: "70%", borderRadius: 4, padding: 24, backgroundColor: '#3b5998'}}>
                  <Text style={{color: 'white', textAlign: 'center'}}>Login to Facebook</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.tabBarInfoContainer, {backgroundColor: 'blue', alignItems: 'center', marginTop: "20%"}}
                onPress={() => this._goInscription()}>
                <View style={{justifyContent:'center'}}>
                  <Text style={{justifyContent:'center',color: 'white',paddingTop: 15,paddingBottom: 15,fontSize: 18,marginLeft: 50,marginRight: 50, color: 'white'}}>INSCRIPTION</Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
      )
  }
}

AuthScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.width,
    flex: 1,
    backgroundColor: '#f5efef'
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  }
});
