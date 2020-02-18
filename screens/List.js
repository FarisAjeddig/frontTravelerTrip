import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text }
  from 'react-native';
import { ExpoLinksView } from '@expo/samples';

export default class AuthScreen extends React.Component {

  render () {
    return (
      <ScrollView style={styles.container}>
        <Text>Liste</Text>
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
