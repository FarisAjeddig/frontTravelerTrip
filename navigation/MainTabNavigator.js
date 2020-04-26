import React from 'react';
import { Platform } from 'react-native';
import { createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import TabBarIcon from '../components/TabBarIcon';
import MapScreen from '../screens/MapScreen';
import List from '../screens/List';
import UserProfile from '../screens/UserProfile';

import Profile from '../screens/Profile';
import EditProfile from '../screens/Profile/EditProfile';
import EditAvailAndInter from '../screens/Profile/EditAvailAndInter';
import ContactUs from '../screens/Profile/ContactUs';

import AuthScreen from '../screens/Auth/AuthScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import FirstLaunchScreen from '../screens/Auth/FirstLaunchScreen';
import FirstLaunchWithFacebookScreen from '../screens/Auth/FirstLaunchWithFacebookScreen';

import Ionicons from 'react-native-vector-icons/Ionicons';


// Stack pour les premières fenetres : Choix de l'inscription/connexion, inscription, et connexion
 const AuthNavigator = createStackNavigator({
   Auth: {
     screen: AuthScreen,
     navigationOptions: {
       headerTransparent: true,
       headerTintColor: 'white'
     }

   },
   SignUp: {
     screen: RegisterScreen,
     navigationOptions: {
       headerTransparent: true,
       headerTintColor: 'white'
     }
   }
 });

 const FirstLaunchNavigator = createStackNavigator({
   FirstLaunch: {
     screen: FirstLaunchScreen,
     navigationOptions: {
       tabBarVisible: false
     }
   }
 });

 const FirstLaunchWithFacebookNavigator = createStackNavigator({
   FirstLaunchWithFacebook: {
     screen: FirstLaunchWithFacebookScreen,
     navigationOptions: {
       tabBarVisible: false
     }
   }
 });

 const ListNavigator = createStackNavigator({
   List: {
     screen: List,
     navigationOptions: {
       header: null
     }
   }
 });

 const HomeNavigator = createStackNavigator({
   MainHome: {
     screen: MapScreen,
     navigationOptions: {
       header: null
     }
   },
   UserProfile: {
     screen: UserProfile,
     navigationOptions: {
       tabBarVisible: true,
       header: null
     }
   }
 })

// Stack pour toutes les pages du profil
const ProfilNavigator = createStackNavigator({
 Profil: {
   screen: Profile,
   navigationOptions: {
     header: null
   }
 },
 EditProfile: {
   screen: EditProfile,
   navigationOptions: {
     title: "Modifier ses informations"
   }
 },
 EditAvailAndInter: {
   screen: EditAvailAndInter,
   navigationOptions: {
     title: "Disponibilités et intérêts"
   }
 },
 ContactUs: {
   screen: ContactUs,
   navigationOptions: {
     title: "Contactez-nous"
   }
 }
});

// Stack "générale" qui comprend les trois onglets, et leurs "sous-navigation"
const Navigator = createBottomTabNavigator({
  List: {
    screen: List,
    navigationOptions: {
      tabBarIcon: ({ focused, tintColor }) => {
        return <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-list' : 'md-list'} />;
      },
      tabBarLabel: 'Liste'
    }
  },
 MainHome: {
   screen: HomeNavigator,
   navigationOptions: {
     tabBarIcon: ({ focused, tintColor }) => (
       <TabBarIcon focused={focused} name={ Platform.OS === 'ios' ? `ios-map${focused ? '' : '-outline'}` : 'md-map' } />
     ),
     tabBarLabel: 'Carte'
   }
 },
 Profil: {
   screen: ProfilNavigator,
   navigationOptions: {
     tabBarIcon: ({ focused, tintColor }) => {
       const iconName = `ios-person${!focused ? '' : ''}`;
       return <Ionicons name={iconName} size={25} color={tintColor} />;
     },
     tabBarVisible: true,
     tabBarLabel: 'Mon profil'
   }
 }
},
{
  defaultNavigationOptions: ({ navigation }) => ({
  }),
  tabBarOptions: {
    // activeTintColor: 'white',
    // inactiveTintColor: 'rgb(58, 43, 101)'
  },
});




export default createSwitchNavigator({
  Auth: AuthNavigator,
  FirstLaunch: FirstLaunchNavigator,
  FirstLaunchWithFacebook: FirstLaunchWithFacebookNavigator,
  MainApp: Navigator,
  List: ListNavigator,
  ProfilNav: ProfilNavigator
},
{
  initialRouteName: 'Auth'
});
