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
import { Input } from 'react-native-elements'
// import {TextField} from 'react-native-material-textfield';
// import PasswordInputText from 'react-native-hide-show-password-input';
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

    componentDidMount = () => {
      // Si on a déjà les informations d'un utilisateur sur l'application, on va l'emmener directement dessus plutôt que de le refaire s'authentifier.
      AsyncStorage.getItem('email').then((value) => {
        if (value !== null){
          AsyncStorage.getItem('firstlaunch').then((value) => {
            if (!value){
              this.props.navigation.navigate('FirstLaunch');
            } else {
              this.props.navigation.navigate('MainApp');
            }
          })
        }
      });
    }

    // Connexion via Facebook
    loginWithFacebook = async () => {
      try {
        await Facebook.initializeAsync({appId: fbId});
        const { type, token, expires, permissions, declinedPermissions } = await Facebook.logInWithReadPermissionsAsync({
          permissions: ['public_profile', 'email'],
          behavior: 'native'
        });


        let data = {
          method: 'POST',
          credentials: 'same-origin',
          mode: 'same-origin',
          body: JSON.stringify({
            token: token
          }),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        };

        return fetch( Api + '/api/sign/facebook', data)
        .then((res) => res.json())
        .then((json) => {
          let keys = [
            'email',
            'id',
            'name',
            'interests',
            'availability',
            'firstlaunch',
            'picture',
            'position',
            'enterprise'
          ];
          let values = [
            json.user.email,
            json.user._id,
            json.user.name,
            json.user.interests,
            json.user.availability,
            json.user.firstlaunch.toString(),
            json.user.picture,
            json.user.position,
            json.user.enterprise
          ];
          console.log(json.user)
          this.setDataToAsyncStorage(keys, values);
          if (json.user.firstlaunch === true){
            this.props.navigation.navigate('FirstLaunchWithFacebook');
          } else {
            this.props.navigation.navigate('MainApp');
          }
        })
        .catch((error) => {
          console.log(error);
          console.error(error);
        });
      } catch ({ message }) {
        Alert.alert(`Facebook Login Error: ${message}`);
      }
    }

    async setDataToAsyncStorage(keys, values){
      for (let p=0; p<keys.length; p++){
        if (values[p] !== undefined){
          await AsyncStorage.setItem(keys[p], values[p]);
        }
      }
    };

    onMailChange(mail) {
      this.email = mail
    }

    onPassChange(pass) {
      console.log(pass)
      this.password = pass
    }

    submit() {
      let error = "";
      if (this.email === "") {
          error += "Missing email address\n"
      }
      if (this.password === "") {
          error += "Missing password\n";
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
              'email',
              'id',
              'name',
              'interests',
              'availability',
              'firstlaunch',
              'picture',
              'position',
              'enterprise'
            ];
            let values = [
              this.email,
              responseJson.user._id,
              responseJson.user.name,
              responseJson.user.interests,
              responseJson.user.availability,
              responseJson.user.firstlaunch.toString(),
              responseJson.user.picture,
              responseJson.user.position,
              responseJson.user.enterprise
            ];
            this.setDataToAsyncStorage(keys, values);

            if (responseJson.user.firstlaunch){
              this.props.navigation.navigate('FirstLaunch');
            } else {
              this.props.navigation.navigate('MainApp');
            }
            break;
          default:
            this.setState({messageError: "Try again, there was an error."});
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
                  <Text style={{fontSize:20, fontWeight: 'bold'}}>Error</Text>
                  <Text>{this.state.messageError}</Text>
                  <TouchableHighlight
                    style={{backgroundColor: "#0011af", alignSelf: 'stretch', marginRight: 20, marginLeft: 20}}
                    onPress={() => this.setState({modalVisible: false})}>
                    <Text style={{textAlign: 'center', color: 'white', paddingTop: 15, paddingBottom: 15}}>Close</Text>
                  </TouchableHighlight>
                </View>
              </View>
            </Modal>

            <View style={{margin: 20, paddingTop: 20}}>
              <Input
                label="E-mail"
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
              <Input
                  iconColor='black'
                  autoCapitalize="none"
                  autoCorrect={false}
                  label="Password"
                  fontSize={20}
                  titleFontSize={17}
                  textColor='black'
                  baseColor='black'
                  tintColor='black'
                  placeholder="********"
                  onChangeText={(password) => this.onPassChange(password)}
                  // value={this.password}
                  secureTextEntry={true}
              />
              <TouchableOpacity
                style={{backgroundColor: 'red',borderRadius: 2,alignSelf: 'center',marginTop: 20, width: "100%"}}
                onPress={() => this.submit()}>
                <View style={{justifyContent:'center'}}>
                  <Text style={{justifyContent:'center',color: 'white',padding: 20, textAlign: 'center'}}>Sign in</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={{alignItems: 'center', paddingTop: 60}}
                onPress={() => this.loginWithFacebook()}>
                <View style={{borderRadius: 4, padding: 15, backgroundColor: '#3b5998', width: "100%"}}>
                  <Text style={{color: 'white', textAlign: 'center'}}>Continue with Facebook</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={{backgroundColor: '#294f79', alignItems: 'center', marginTop: 20, width: "100%"}}
                onPress={() => this._goInscription()}>
                <View style={{justifyContent:'center'}}>
                  <Text style={{justifyContent:'center',color: 'white',padding: 20,marginLeft: 50,marginRight: 50}}>Sign up</Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
      )
  }
}

AuthScreen.navigationOptions = {
  headerShown: false
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.width,
    flex: 1,
    backgroundColor: '#f5efef',
    marginTop: 20
  }
});
