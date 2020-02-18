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
import {TextField} from 'react-native-material-textfield';
import PasswordInputText from 'react-native-hide-show-password-input';
import Api from '../../constants/Api';


export default class RegisterScreen extends React.Component {

    constructor(props) {
        super(props);
        this.email = "";
        this.password = "";
        this.password2 = "";

        this.state = ({
            email: "",
            password: "",
            password2: "",
            modalVisible: false,
            messageError: ""
        })
    }

    async setDataToAsyncStorage(keys, values){
      for (p=0; p<keys.length; p++){
        AsyncStorage.setItem(keys[p], values[p]);
      }
    };

    onMailChange(mail) {
      this.email = mail
    }

    onPassChange(pass) {
      this.password = pass
    }

    onPass2Change(pass) {
      this.password2 = pass
    }

    submit() {
      console.log("SUBMIT");
      let error = "";
      if (this.email === "") {
          error += "Adresse mail manquante\n"
      }
      if (this.password === "" || this.password2 === "") {
          error += "Mot de passe manquant\n";
      }

      if (this.password !== this.password2){
        error+="Les deux mots de passe ne correspondent pas\n";
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
      console.log('SubmitToAPI');
      let data = {
        method: 'POST',
        credentials: 'same-origin',
        mode: 'same-origin',
        body: JSON.stringify({
          email: this.email,
          password: this.password,
          password2: this.password2
        }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      };

      return fetch( Api + '/api/register', data)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        switch (responseJson.statut) {
          case 'ERROR':
            this.setState({messageError: responseJson.message});
            this.setState({modalVisible: true});
            break;
          case 'SUCCESS':
            console.log(responseJson.user);
            let keys = [
              'email',
              'id',
              'name',
              'interests',
              'availability',
              'firstlaunch'
            ];
            let values = [
              this.email,
              responseJson.user._id,
              responseJson.user.name,
              responseJson.user.interests,
              responseJson.user.availability,
              responseJson.user.firstlaunch.toString()
            ];
            this.setDataToAsyncStorage(keys, values);
            Alert.alert('Votre compte a bien été créé !')
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
                label="Email"
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

              <PasswordInputText
                  value={this.password2}
                  iconColor='black'
                  autoCapitalize="none"
                  autoCorrect={false}
                  label="Confirmer le mot de passe"
                  fontSize={20}
                  titleFontSize={17}
                  textColor='black'
                  baseColor='black'
                  tintColor='black'
                  placeholder="********"
                  onChangeText={(password) => this.onPass2Change(password)}
              />
              <TouchableOpacity
                style={styles.tabBarInfoContainer, {backgroundColor: 'blue', alignItems: 'center', marginTop: "20%"}}
                onPress={() => this.submit()}>
                <View style={{justifyContent:'center'}}>
                  <Text style={{justifyContent:'center',color: 'white',paddingTop: 15,paddingBottom: 15,fontSize: 18,marginLeft: 50,marginRight: 50}}>INSCRIPTION</Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
      )
  }
}

RegisterScreen.navigationOptions = {
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
