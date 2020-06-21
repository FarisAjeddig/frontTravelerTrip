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
import {TextField, OutlinedTextField} from 'react-native-material-textfield';
import PasswordInputText from 'react-native-hide-show-password-input';
import PhoneInput from 'react-native-phone-input'
import CountryPicker from 'react-native-country-picker-modal';
import Api from '../../constants/Api';


export default class RegisterScreen extends React.Component {

    constructor(props) {
        super(props);
        this.email = "";
        this.name = "";
        this.position = "";
        this.enterprise = "";
        this.phone = "";
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
      for (let p=0; p<keys.length; p++){
        if (values[p] !== undefined){
          await AsyncStorage.setItem(keys[p], values[p]);
        }
      }
    };

    onMailChange(mail) {
      this.email = mail
    }

    onNameChange(name) {
      this.name = name
    }

    onPostChange(position) {
      this.position = position
    }

    onEnterpriseChange(enterprise) {
      this.enterprise = enterprise
    }

    onPhoneChange(phone) {
      this.phone = phone
    }

    onPassChange(pass) {
      this.password = pass
    }

    onPass2Change(pass) {
      this.password2 = pass
    }

    submit() {
      let error = "";
      if (this.email === "") {
          error += "Missing email address\n"
      }
      if (this.password === "" || this.password2 === "") {
          error += "Missing password\n";
      }

      if (this.password !== this.password2){
        error+="The two passwords do not match\n";
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
          name: this.name,
          position: this.position,
          enterprise: this.enterprise,
          phone: this.phone,
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
            this.setState({messageError: responseJson.errors});
            this.setState({modalVisible: true});
            break;
          case 'SUCCESS':
            console.log(responseJson.user);
            let keys = [
              'email',
              'id',
              'name',
              'phone',
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
              this.name,
              this.phone,
              responseJson.user.interests,
              responseJson.user.availability,
              responseJson.user.firstlaunch.toString(),
              responseJson.user.picture,
              this.position,
              this.enterprise
            ];
            this.setDataToAsyncStorage(keys, values);
            Alert.alert('Your account has been created !')
            this.props.navigation.navigate('FirstLaunch');
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
            <View style={{margin: 20}}>
              <TextField
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
              <TextField
                label="Last and first name"
                autoCapitalize="none"
                autoCorrect={false}
                textColor='black'
                baseColor='black'
                tintColor='black'
                fontSize={20}
                titleFontSize={17}
                onChangeText={(name) => this.onNameChange(name)}
                value={this.name}
                placeholder="Martin MATIN"
                keyboardType='default'
              />
              <TextField
                label="Position"
                autoCapitalize="none"
                autoCorrect={false}
                textColor='black'
                baseColor='black'
                tintColor='black'
                fontSize={20}
                titleFontSize={17}
                onChangeText={(position) => this.onPostChange(position)}
                value={this.position}
                placeholder="Sales director"
                keyboardType='default'
              />
              <TextField
                label="Enterprise"
                autoCapitalize="none"
                autoCorrect={false}
                textColor='black'
                baseColor='black'
                tintColor='black'
                fontSize={20}
                titleFontSize={17}
                onChangeText={(enterprise) => this.onEnterpriseChange(enterprise)}
                value={this.enterprise}
                placeholder="McDonald's"
                keyboardType='default'
              />

              <TextField
                label='Phone number'
                placeholder="+33612345678"
                keyboardType='phone-pad'
                autoCapitalize="none"
                autoCorrect={false}
                textColor='black'
                baseColor='black'
                tintColor='black'
                fontSize={20}
                titleFontSize={17}
                onChangeText={(phone) => this.onPhoneChange(phone)}
                value={this.enterprise}
              />
              <PasswordInputText
                  value={this.password}
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
              />

              <PasswordInputText
                  value={this.password2}
                  iconColor='black'
                  autoCapitalize="none"
                  autoCorrect={false}
                  label="Confirm password"
                  fontSize={20}
                  titleFontSize={17}
                  textColor='black'
                  baseColor='black'
                  tintColor='black'
                  placeholder="********"
                  onChangeText={(password) => this.onPass2Change(password)}
              />
              <TouchableOpacity
                style={{backgroundColor: '#294f79', alignItems: 'center', marginTop: 20, marginBottom: 200, width: "100%"}}
                onPress={() => this.submit()}>
                <View style={{justifyContent:'center'}}>
                  <Text style={{justifyContent:'center',color: 'white',padding: 20,fontSize: 18}}>Sign up</Text>
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
    backgroundColor: '#f5efef',
    marginTop: 20
  }
});
