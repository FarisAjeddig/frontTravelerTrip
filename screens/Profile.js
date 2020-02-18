import React from 'react';
import { View, Text, ImageBackground } from 'react-native';
import { ExpoConfigView } from '@expo/samples';

export default class ProfileScreen extends React.Component {
  render () {
    return (
      <ImageBackground
          source={{ uri: 'https://scontent-cdg2-1.xx.fbcdn.net/v/t1.0-9/p960x960/53806303_2343549475669495_1256650694291619840_o.jpg?_nc_cat=111&_nc_ohc=bGB0pTdlCh8AX_G5gET&_nc_ht=scontent-cdg2-1.xx&_nc_tp=6&oh=50988716d2e5ac5d6f09e76cf87d70c1&oe=5EF9BFFF'}}
          style={{width: 150, height: 150, alignSelf: 'center', marginTop: 20}}
          imageStyle={{ borderRadius: 400/ 2}}
      >
      </ImageBackground>
    );
  }
}
