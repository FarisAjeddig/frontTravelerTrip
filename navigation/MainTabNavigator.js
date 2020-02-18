import React from 'react';
import { Platform } from 'react-native';
import { createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import TabBarIcon from '../components/TabBarIcon';
import MapScreen from '../screens/MapScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';

import AuthScreen from '../screens/Auth/AuthScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import FirstLaunchScreen from '../screens/Auth/FirstLaunchScreen';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

// Stack pour les premières fenetres : inscription, connexion

const AuthStack = createStackNavigator({
    HomeLogin: {
      screen: AuthScreen,
      navigationOptions: {
        headerTransparent: true,
        headerTintColor: 'white'
      }
    },
    SignUp: {
      screen: RegisterScreen,
      navigationOptions: {
        title: "Signup"
      }
    }
  },
  config
);

AuthStack.path = '';

AuthStack.navigationOptions = {
  tabBarLabel: 'HomeLogin',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};


const FirstLaunchStack = createStackNavigator(
  {
  FirstLaunch: FirstLaunchScreen
  },
  config
);

FirstLaunchStack.path = '';

const HomeStack = createStackNavigator(
  {
    Home: MapScreen,
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Carte',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-map${focused ? '' : '-outline'}`
          : 'md-map'
      }
    />
  ),
};

HomeStack.path = '';

const LinksStack = createStackNavigator(
  {
    Links: LinksScreen,
  },
  config
);

LinksStack.navigationOptions = {
  tabBarLabel: 'Liste',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-list' : 'md-list'} />
  ),
};

LinksStack.path = '';

const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
  },
  config
);

SettingsStack.navigationOptions = {
  tabBarLabel: 'Profil',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-person' : 'md-person'} />
  ),
};

SettingsStack.path = '';

const TabNavigator = createBottomTabNavigator({
  HomeStack: {
    screen: HomeStack
  },
  LinksStack: {
    screen: LinksStack
  },
  SettingsStack: {
    screen: SettingsStack
  }
});

TabNavigator.path = '';

export default createSwitchNavigator({
  Auth: AuthStack,
  FirstLaunch: FirstLaunchStack,
  Main: TabNavigator
}, {
  initialRouteName: 'Auth'
})
