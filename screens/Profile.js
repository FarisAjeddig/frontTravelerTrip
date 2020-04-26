import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableHighlight,
  ScrollView,
  AsyncStorage,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { ExpoConfigView } from '@expo/samples';
import Api from '../constants/Api';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { Avatar, ListItem, Overlay, Icon } from 'react-native-elements';


export default class ProfileScreen extends React.Component {

  state = {
    isOverlayForPictureVisible: false,
    uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/768px-Circle-icons-profile.svg.png',
    name: "Prénom NOM",
    initials: "PN",
    id: "",
    position: "Poste",
    enterprise: "Entreprise",
    loading: true
  }

  componentDidMount = () => {
    this.setState({loading: true})
    let keys = ['name', 'position', 'enterprise', 'id', 'picture'];
    AsyncStorage.multiGet(keys, (err, stores) => {
      stores.map((result, i, store) => {
      switch (store[i][0]) {
        case 'name':
          this.setState({name: store[i][1]})
          let initials = store[i][1].split(" ").map((n)=>n[0]).join("");
          this.setState({initials: initials})
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
        case 'picture':
          if (store[i][1] !== null){
            if (store[i][1].split(':')[0] === "https"){
              this.setState({uri : store[i][1]})
            } else {
              this.setState({uri : Api + "/" + store[i][1]})
              console.log(store[i][1].split(':')[0]);
            }
          }
          break;
        default:
          break;
        }
        this.setState({loading: false});
      })
    })
  }


  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  }

  _pickImage = async (type) => {
    let config = {
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1
    }


    if (type == 'LIB') {
      var response = await ImagePicker.launchImageLibraryAsync(config)
    } else {
      var response = await ImagePicker.launchCameraAsync(config)
    }

    this.setState({isOverlayForPictureVisible: false})

    console.log(response);

    if (response.cancelled){
      console.log("Le changement de photo a été annulé");
    } else {

    }

    // if (!result.cancelled) {
    //   this.setState({ image: result.uri });
    // }
    const photo = {
      uri: response.uri,
      name: this.state.id,
      type: 'image/jpeg',
    };
    const data = new FormData();
    data.append('file', photo);
    const dataFetch = {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    };
    return fetch(Api + "/api/upload", dataFetch)
    .then(resp => resp.json())
    .then(json => {
      this.setState({uri: Api + "/" + json.picture})
      try {
        AsyncStorage.setItem('picture', Api + "/" + json.picture);
      } catch (error) {
        console.log(error);
      }
    })
    .catch(err => console.log(err))
  };

  refreshFunction(_this){
    let keys = ['name', 'position', 'enterprise'];
    AsyncStorage.multiGet(keys, (err, stores) => {
      stores.map((result, i, store) => {
      switch (store[i][0]) {
        case 'name':
          _this.setState({name: store[i][1]})
          break;
        case 'position':
          _this.setState({position: store[i][1]})
          break;
        case 'enterprise':
          _this.setState({enterprise : store[i][1]})
          break;
        default:
          break;
        }
      })
      console.log(_this.state);
    })
  }


  logout() {
    let keys = [ 'email', 'id', 'name', 'phone', 'interests', 'availability', 'firstlaunch', 'picture', 'position', 'enterprise'];
    AsyncStorage.multiRemove(keys, (err) => {
      this.props.navigation.navigate('Auth');
    });
  }

  render () {
    const loading = this.state.loading;

    return (
      <ScrollView style={{marginTop: 20}}>

        <Overlay
          isVisible={this.state.isOverlayForPictureVisible}
          onBackdropPress={() => this.setState({ isOverlayForPictureVisible: false })}
          width="auto"
          height="auto"
        >
          <View>
            <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 18}}>Changer son image de profil</Text>
            <View style={{flexDirection: 'row', alignSelf: 'center'}}>
              <TouchableOpacity style={{flexDirection: 'column'}} onPress={() => this._pickImage('LIB')}>
                <Icon name='image' color="rgb(124, 168, 199)" size={100} />
                <Text style={{textAlign: 'center', fontStyle: 'italic'}}>Librairie</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{flexDirection: 'column'}} onPress={() => this._pickImage('CAM')}>
                <Icon name='camera-alt' color="rgb(124, 168, 199)" size={100} />
                <Text style={{textAlign: 'center', fontStyle: 'italic'}}>Selfie</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Overlay>

        { loading ?
            <ActivityIndicator size={100} color="#7bacbd" style={{marginTop: 20}} />
          :
          <View>
            <Avatar
              rounded
              source={{
                uri: this.state.uri
              }}
              style={{width: 150, height: 150, alignSelf: 'center', marginTop: 30}}
              showEditButton
              // onEditPress={this._pickImage}
              onEditPress={() => this.setState({isOverlayForPictureVisible: true})}
              iconSize={{width: 50, height: 50}}
              title={this.state.initials}
              size="xlarge"
            />
            <View style={{alignItems: 'center', marginTop: 30, marginBottom: 30}}>
              <Text style={{fontWeight: 'bold', fontSize: 20}}>{this.state.name}</Text>
              <Text style={{fontStyle: 'italic'}} >{this.state.position || "Poste"} chez {this.state.enterprise || "Enterprise"}</Text>
            </View>
          </View>
        }





        <View style={{margin: 15}}>
          <ListItem
            title="Modifier mes informations"
            leftIcon={{ name: "edit"}}
            chevron
            onPress={() => {

              this.props.navigation.navigate('EditProfile', {refreshFunction: this.refreshFunction, _this: this})
            }}
          />
          <ListItem
            title="Disponibilités et intérêts"
            leftIcon={{ name: "av-timer"}}
            bottomDivider
            chevron
            onPress={() => {this.props.navigation.navigate('EditAvailAndInter')}}
            style={{marginBottom: 50}}
          />

          <ListItem
            title="Nous contacter"
            leftIcon={{ name: "mail"}}
            chevron
            onPress={() => {this.props.navigation.navigate('ContactUs')}}
          />
          <ListItem
            title="Deconnexion"
            leftIcon={{ name: "exit-to-app"}}
            chevron
            onPress={() => this.logout()}
          />
          {/*<ListItem
            title="Supprimer mon compte"
            leftIcon={{ name: "delete"}}
            chevron
            onPress={() => {}}
          />*/}
        </View>
      </ScrollView>
    );
  }
}


{/* <ImageBackground
    source={{ uri: 'https://scontent-cdg2-1.xx.fbcdn.net/v/t1.0-9/p960x960/53806303_2343549475669495_1256650694291619840_o.jpg?_nc_cat=111&_nc_ohc=bGB0pTdlCh8AX_G5gET&_nc_ht=scontent-cdg2-1.xx&_nc_tp=6&oh=50988716d2e5ac5d6f09e76cf87d70c1&oe=5EF9BFFF'}}
    style={{width: 150, height: 150, alignSelf: 'center', marginTop: 20}}
    imageStyle={{ borderRadius: 400/ 2}}
>
  <TouchableHighlight
    onPress={this._pickImage}
  >
    <Text>Test</Text>
  </TouchableHighlight>
</ImageBackground> */}
