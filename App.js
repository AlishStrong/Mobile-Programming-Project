import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import{createAppContainer, createStackNavigator} from 'react-navigation';
import HomeScreen from './screens/HomeScreen';
import DiaryScreen from './screens/DiaryScreen';
import MyFoodScreen from './screens/MyFoodScreen';
import ProfileScreen from './screens/ProfileScreen';
import RecipesScreen from './screens/RecipesScreen';

import { Font, AppLoading } from 'expo';
import { Spinner } from 'native-base';

import firebase from 'firebase';

//Navigation routes
const MyRoutes = createStackNavigator({
  HomeRT: {
    screen: HomeScreen
  },
  ProfileRT: {
    screen: ProfileScreen
  },
  MyFoodRT: {
    screen: MyFoodScreen
  },
  RecipesRT: {
    screen: RecipesScreen
  },
  DiaryRT: {
    screen: DiaryScreen
  }
},
{
  initialRouteName: 'HomeRT'
});

const AppContainer =  createAppContainer(MyRoutes);

//Configuration data for Google Firebase enabling
const config = {
  apiKey: "AIzaSyBO-c0VzzQ0YNa2OsqoSNjgyaB1L2vmMog",
  authDomain: "mobile-prog-course.firebaseapp.com",
  databaseURL: "https://mobile-prog-course.firebaseio.com",
  projectId: "mobile-prog-course",
  storageBucket: "mobile-prog-course.appspot.com",
  messagingSenderId: "33074874098"
};
if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

//The main class, aka Ancestor 
export default class App extends React.Component {

  state={
    isReady: false
  }

  //This is needed to work with NativeBase, because it uses Font, that must be loaded before app loads
  async componentWillMount() {
    await Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
    });
    this.setState({isReady:true})
  }
  
  render() {
    if (!this.state.isReady) {
      return <AppLoading />;
    } else {
      return (
        <AppContainer />
      );
    }
    
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
