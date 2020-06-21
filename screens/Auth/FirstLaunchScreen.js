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
import { CheckBox, Button } from 'react-native-elements';
import Api from '../../constants/Api';

const fbId = "237940337207466";
const fbSecret = "2c22afd4578ecbff2eea71d76be8d0f6";

export default class FirstLaunchScreen extends React.Component {

    constructor(props) {
        super(props);
        this.email = "";

        this.state = ({
            checkedAvailabilities: {
              a6to8: false,
              a8to12: false,
              a12to14: false,
              a14to18: false,
              a18to22: false,
            },
            checkedInterests: {
              business: false,
              restaurant: false,
              sport: false,
              tourism: false,
              carsharing: false,
              spectacle: false,
              shopping: false
            },
            AllDay: false,
            AllInterest: false,
            loading: false,
            modalVisible: false,
            messageError: ""
        })
    }

    componentDidMount = () => {
      AsyncStorage.getItem('email').then((value) => {
        this.email = value;
      })
      AsyncStorage.getItem('firstlaunch').then((value) => {
        if (value === 'false'){
        //  this.props.navigation.navigate('MainApp');
        } else {
          try {
            AsyncStorage.setItem('firstlaunch', 'false');
          } catch (error) {
            console.log(error);
          }
        }
      });
    }


    async setDataToAsyncStorage(keys, values){
      for (let p=0; p<keys.length; p++){
        if (values[p] !== undefined){
          await AsyncStorage.setItem(keys[p], values[p]);
        }
      }
    };

    submit() {
      this.setState({loading: true})
      return (this.submitToAPI());
    }


    submitToAPI() {
      let data = {
        method: 'POST',
        credentials: 'same-origin',
        mode: 'same-origin',
        body: JSON.stringify({
          availabilities: this.state.checkedAvailabilities,
          interests: this.state.checkedInterests,
          email: this.email
        }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      };

      return fetch( Api + '/api/profile/availandinter', data)
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.statut==="SUCCESS"){
          try {
            AsyncStorage.setItem('firstlaunch', 'false');
          } catch (error) {
            console.log(error);
          }
          this.props.navigation.navigate('MainApp');
        }
        })
      .catch((error) => {
        console.error(error);
        this.setState({loading: false})
      });
    }

    render() {
      return (
          <ScrollView style={{marginTop: 20}}>
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
              <Text style={{fontSize: 25, color: 'red'}}>Tell us more !</Text>
              <Text>This data will allow us to offer you people with whom you "match" :)</Text>

              {/* Interests  */}
              <Text style={{marginTop: 10}}>The subjects on which you would like to discuss</Text>
              <View style={{ flex: 1, marginBottom: 20, flexDirection: 'row', backgroundColor: 'rgb(235, 240, 237)', borderRadius: 10, marginTop: 20, padding: 10, margin: -12}}>
                <View style={{flex: 1, flexDirection: 'column' }}>

                  <CheckBox
                    center
                    title='Business'
                    onPress={() => { this.setState({ checkedInterests: {...this.state.checkedInterests, business: !this.state.checkedInterests.business} }); }}
                    checked={this.state.checkedInterests.business}
                  />
                  <CheckBox
                    center
                    title='Food'
                    onPress={() => { this.setState({ checkedInterests: {...this.state.checkedInterests, restaurant: !this.state.checkedInterests.restaurant} }); }}
                    checked={this.state.checkedInterests.restaurant}
                  />
                  <CheckBox
                    center
                    title='Sports'
                    onPress={() => { this.setState({ checkedInterests: {...this.state.checkedInterests, sport: !this.state.checkedInterests.sport} }); }}
                    checked={this.state.checkedInterests.sport}
                  />
                  <CheckBox
                    center
                    title='Show'
                    onPress={() => { this.setState({ checkedInterests: {...this.state.checkedInterests, spectacle: !this.state.checkedInterests.spectacle} }); }}
                    checked={this.state.checkedInterests.spectacle}
                  />

                </View>
                <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center'}}>

                  <CheckBox
                    center
                    title='Tourism'
                    onPress={() => { this.setState({ checkedInterests: {...this.state.checkedInterests, tourism: !this.state.checkedInterests.tourism} }); }}
                    checked={this.state.checkedInterests.tourism}
                  />
                  <CheckBox
                    center
                    title='Car Sharing'
                    onPress={() => { this.setState({ checkedInterests: {...this.state.checkedInterests, carsharing: !this.state.checkedInterests.carsharing} }); }}
                    checked={this.state.checkedInterests.carsharing}
                  />
                  <CheckBox
                    center
                    title='Shopping'
                    onPress={() => { this.setState({ checkedInterests: {...this.state.checkedInterests, shopping: !this.state.checkedInterests.shopping} }); }}
                    checked={this.state.checkedInterests.shopping}
                  />
                  <CheckBox
                    center
                    title='All'
                    onPress={() => { this.setState({ AllInterest: !this.state.AllInterest, checkedInterests: {business: !this.state.AllInterest, restaurant: !this.state.AllInterest, sport: !this.state.AllInterest, tourism: !this.state.AllInterest, carsharing: !this.state.AllInterest, spectacle: !this.state.AllInterest, shopping: !this.state.AllInterest} }); }}
                    checked={this.state.AllInterest}
                  />
                </View>
              </View>
              {/* Availabilities  */}
              <Text>When are you available to meet other business travelers?</Text>
              <View style={{ flex: 1, flexDirection: 'row', backgroundColor: 'rgb(235, 240, 237)', borderRadius: 10, marginTop: 20, padding: 10, marginBottom: 20, margin: -12}}>
                <View style={{flex: 1, flexDirection: 'column'}}>

                  <CheckBox
                    center
                    title='6am to 8am'
                    onPress={() => { this.setState({ checkedAvailabilities: {...this.state.checkedAvailabilities, a6to8: !this.state.checkedAvailabilities.a6to8} }); }}
                    checked={this.state.checkedAvailabilities.a6to8}
                  />
                  <CheckBox
                    center
                    title='8am to 12pm'
                    onPress={() => { this.setState({ checkedAvailabilities: {...this.state.checkedAvailabilities, a8to12: !this.state.checkedAvailabilities.a8to12} }); }}
                    checked={this.state.checkedAvailabilities.a8to12}
                  />
                  <CheckBox
                    center
                    title='12pm to 2pm'
                    onPress={() => { this.setState({ checkedAvailabilities: {...this.state.checkedAvailabilities, a12to14: !this.state.checkedAvailabilities.a12to14} }); }}
                    checked={this.state.checkedAvailabilities.a12to14}
                  />

                </View>
                <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center'}}>

                  <CheckBox
                    center
                    title='2pm to 6pm'
                    onPress={() => { this.setState({ checkedAvailabilities: {...this.state.checkedAvailabilities, a14to18: !this.state.checkedAvailabilities.a14to18} }); }}
                    checked={this.state.checkedAvailabilities.a14to18}
                  />
                  <CheckBox
                    center
                    title='6pm to 10pm'
                    onPress={() => { this.setState({ checkedAvailabilities: {...this.state.checkedAvailabilities, a18to22: !this.state.checkedAvailabilities.a18to22} }); }}
                    checked={this.state.checkedAvailabilities.a18to22}
                  />
                  <CheckBox
                    center
                    title='All'
                    onPress={() => { this.setState({ AllDay: !this.state.AllDay, checkedAvailabilities: {a18to22: !this.state.AllDay, a6to8: !this.state.AllDay, a8to12: !this.state.AllDay, a12to14: !this.state.AllDay, a14to18: !this.state.AllDay} }); }}
                    checked={this.state.AllDay}
                  />
                </View>
              </View>


              <Button
                raised
                icon={{name: 'send'}}
                loading={this.state.loading}
                title='SEND'
                onPress={() => this.submit()} />

            </View>
          </ScrollView>
      )
  }
}

FirstLaunchScreen.navigationOptions = {
  header: null,
};
