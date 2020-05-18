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

    componentDidMount = () => {
      // Si on a déjà les informations d'un utilisateur sur l'application, on va l'emmener directement dessus plutôt que de le refaire s'authentifier.
      AsyncStorage.getItem('email').then((value) => {
        if (value !== null){
          AsyncStorage.getItem('firstlaunch').then((value) => {
            if (value){
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
            responseJson.user.email,
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

          // if (responseJson.user.firstlaunch == true){
          if (responseJson.user.firstlaunch == true){
            this.props.navigation.navigate('FirstLaunchWithFacebook');
          // } else {
            // this.props.navigation.navigate('MainApp');
          // }
          } else {
            this.props.navigation.navigate('MainApp');
          }
        })
        .catch((error) => {
          console.error(error);
        });
      } catch ({ message }) {
        Alert.alert(`Facebook Login Error: ${message}`);
      }
    }

    async setDataToAsyncStorage(keys, values){
      for (let p=0; p<keys.length; p++){
        AsyncStorage.setItem(keys[p], values[p]);
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
                style={{backgroundColor: 'red',borderRadius: 2,alignSelf: 'center',marginTop: 20, width: "100%"}}
                onPress={() => this.submit()}>
                <View style={{justifyContent:'center'}}>
                  <Text style={{justifyContent:'center',color: 'white',padding: 20, color: 'white', textAlign: 'center'}}>Connexion</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={{alignItems: 'center', paddingTop: 60}}
                onPress={() => this.loginWithFacebook()}>
                <View style={{borderRadius: 4, padding: 15, backgroundColor: '#3b5998', width: "100%"}}>
                  <Text style={{color: 'white', textAlign: 'center'}}>Continuer avec Facebook</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={{backgroundColor: '#294f79', alignItems: 'center', marginTop: 20, width: "100%"}}
                onPress={() => this._goInscription()}>
                <View style={{justifyContent:'center'}}>
                  <Text style={{justifyContent:'center',color: 'white',padding: 20,marginLeft: 50,marginRight: 50, color: 'white'}}>Inscription</Text>
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
    backgroundColor: '#f5efef',
    marginTop: 20
  }
});
