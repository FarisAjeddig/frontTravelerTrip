import React from 'react';
import { Platform } from 'react-native';
import { createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import TabBarIcon from '../components/TabBarIcon';
import MapScreen from '../screens/MapScreen';
import List from '../screens/List';
import Profile from '../screens/Profile';

import AuthScreen from '../screens/Auth/AuthScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import FirstLaunchScreen from '../screens/Auth/FirstLaunchScreen';


// // Stack pour les premières fenetres : inscription, connexion
//
// const AuthStack = createStackNavigator({
//     Auth: {
//       screen: AuthScreen,
//       navigationOptions: {
//         headerTransparent: true,
//         headerTintColor: 'white'
//       }
//     },
//     SignUp: {
//       screen: RegisterScreen,
//       navigationOptions: {
//         title: "Signup"
//       }
//     }
//   }
// );
//
// const FirstLaunchStack = createStackNavigator(
//   {
//   FirstLaunch: FirstLaunchScreen
//   }
// );
//
//
// const HomeStack = createStackNavigator({
//   Home: {
//     screen: MapScreen,
//     navigationOptions: {
//       tabBarVisible: false
//     }
//   }
// });
//
// const ListStack = createStackNavigator({
//   List: {
//     screen: List,
//     navigationOptions: {
//       tabBarVisible: false,
//       header: null
//     }
//   }
// });
//
// // Stack pour toutes les pages du profil
// const ProfileStack = createStackNavigator({
//  Profile: {
//    screen: Profile,
//    navigationOptions: {
//           header: null,
//           tabBarIcon: ({ focused, tintColor }) => {
//             <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-list' : 'md-list'} />
//           }
//       }
//  },
//  // EditProfile: {
//  //   screen: EditProfile,
//  //   navigationOptions: {
//  //     title: 'Modifier ses informations personnelles'
//  //   }
//  // }
// });
//
//
// const TabNavigator = createBottomTabNavigator({
//  HomeStack: {
//    screen: HomeStack,
//    navigationOptions: {
//      tabBarIcon: ({ focused }) => (
//        <TabBarIcon
//          focused={focused}
//          name={
//            Platform.OS === 'ios'
//              ? `ios-map${focused ? '' : '-outline'}`
//              : 'md-map'
//          }
//        />
//      ),
//      tabBarLabel: 'Carte'
//    }
//  },
//  Main: {
//    screen: ListStack,
//    navigationOptions: {
//          tabBarIcon: ({ focused }) => (
//            <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-list' : 'md-list'} />
//          ),
//           tabBarLabel: 'Liste',
//           tabBarVisible: true
//       }
//  },
//  Profile: {
//    screen: ProfileStack,
//    navigationOptions: {
//      tabBarIcon: ({ focused, tintColor }) => {
//        <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-list' : 'md-list'} />
//      },
//      tabBarVisible: false
//    }
//  }
// },
// {
//   defaultNavigationOptions: ({ navigation }) => ({
//   }),
//   tabBarOptions: {
//   },
// });
//
//
// export default createSwitchNavigator({
//   Auth: AuthStack,
//   FirstLaunch: FirstLaunchStack,
//   Main: TabNavigator
// }, {
//   initialRouteName: 'Auth'
// })

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

 const ListNavigator = createStackNavigator({
   List: {
     screen: List,
     navigationOptions: {
       tabBarVisible: false
     }
   }
 });

 const HomeNavigator = createStackNavigator({
   MainHome: {
     screen: MapScreen,
     navigationOptions: {
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
 }
});

// Stack "générale" qui comprend les trois onglets, et leurs "sous-navigation"
const Navigator = createBottomTabNavigator({
 MainHome: {
   screen: HomeNavigator,
   navigationOptions: {
     tabBarIcon: ({ focused, tintColor }) => (
       <TabBarIcon focused={focused} name={ Platform.OS === 'ios' ? `ios-map${focused ? '' : '-outline'}` : 'md-map' } />
     ),
     tabBarLabel: 'Carte'
   }
 },
 List: {
   screen: List,
   navigationOptions: {
     tabBarIcon: ({ focused, tintColor }) => {
       return <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-list' : 'md-list'} />;
     },
     tabBarLabel: 'Liste'
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
  MainApp: Navigator,
  List: ListNavigator,
  ProfilNav: ProfilNavigator
},
{
  initialRouteName: 'Auth'
});
