import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  AsyncStorage,
  View,
  TouchableHighlight,
} from 'react-native';
import { CheckBox, Button } from 'react-native-elements';
import Api from '../../constants/Api';

export default class EditAvailAndInter extends React.Component {

  constructor(props) {
      super(props);

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
          email: ""
      })
  }

  componentDidMount = () => {
    AsyncStorage.getItem('availability').then((value) => {
      return fetch( Api + "/api/availability/" + value )
        .then((response) => response.json())
        .then((availability) => {
          AsyncStorage.getItem('interests').then((value) => {
            return fetch(Api + "/api/interests/" + value )
              .then((response) => response.json())
              .then((interests) => {
                this.setState({
                  checkedAvailabilities: {
                    a18to22: availability.availability.a18to22,
                    a6to8: availability.availability.a6to8,
                    a8to12: availability.availability.a8to12,
                    a12to14: availability.availability.a12to14,
                    a14to18: availability.availability.a14to18
                  },
                  checkedInterests: {
                    business: interests.interests.business,
                    carsharing: interests.interests.carsharing,
                    restaurant: interests.interests.restaurant,
                    sport: interests.interests.sport,
                    tourism: interests.interests.tourism,
                    shopping: interests.interests.shopping,
                    spectacle: interests.interests.spectacle
                  }
                });
                AsyncStorage.getItem('email').then((value) => {
                  this.setState({email: value})
                })
              })
              .catch(error => console.error(error))
          })
        .catch((error) => console.error(error))
        });
      // this.props.navigation.navigate('MainApp');
    });
  }

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
        email: this.state.email
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
        this.props.navigation.navigate('Profil');
      }
      })
    .catch((error) => {
      console.error(error);
      this.setState({loading: false})
    });
  }

  render () {
    return (
      <ScrollView>

        <View style={{margin: 20}}>
          {/* Interests  */}
          <Text style={{fontSize: 25, color: 'blue', marginTop: 0}}>Vos centres d'intérêts</Text>
          <View style={{ flex: 1, marginBottom: 20, flexDirection: 'row', backgroundColor: 'rgb(235, 240, 237)', borderRadius: 10, marginTop: 20, padding: 10, margin: -12}}>
            <View style={{flex: 1, flexDirection: 'column'}}>

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
          <Text style={{fontSize: 25, color: 'red'}}>Vos disponibilités</Text>
          <View style={{ flex: 1, flexDirection: 'row', backgroundColor: 'rgb(235, 240, 237)', borderRadius: 10, marginTop: 20, padding: 10, marginBottom: 20, margin: -12}}>
            <View style={{flex: 1, flexDirection: 'column'}}>

              <CheckBox
                center
                title='6h à 8h'
                onPress={() => { this.setState({ checkedAvailabilities: {...this.state.checkedAvailabilities, a6to8: !this.state.checkedAvailabilities.a6to8} }); }}
                checked={this.state.checkedAvailabilities.a6to8}
              />
              <CheckBox
                center
                title='8h à 12h'
                onPress={() => { this.setState({ checkedAvailabilities: {...this.state.checkedAvailabilities, a8to12: !this.state.checkedAvailabilities.a8to12} }); }}
                checked={this.state.checkedAvailabilities.a8to12}
              />
              <CheckBox
                center
                title='12h à 14h'
                onPress={() => { this.setState({ checkedAvailabilities: {...this.state.checkedAvailabilities, a12to14: !this.state.checkedAvailabilities.a12to14} }); }}
                checked={this.state.checkedAvailabilities.a12to14}
              />

            </View>
            <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center'}}>

              <CheckBox
                center
                title='14h à 18h'
                onPress={() => { this.setState({ checkedAvailabilities: {...this.state.checkedAvailabilities, a14to18: !this.state.checkedAvailabilities.a14to18} }); }}
                checked={this.state.checkedAvailabilities.a14to18}
              />
              <CheckBox
                center
                title='18h à 22h'
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
            // icon={{name: 'send'}}
            loading={this.state.loading}
            title='MODIFIER'
            onPress={() => this.submit()} />

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
