import React from 'react';
import { View, Button, Text, Alert, AsyncStorage } from 'react-native';

const userId = 'AlisherAlievID';

export default class MyFoodScreen extends React.Component {
    static navigationOptions = { title: 'My food', };

    saveUserId = async () => {
        try {
            await AsyncStorage.setItem('userId', userId);
            Alert.alert("UserId " + userId + " saved successfully");
        } catch (error) {
            // Error retrieving data
            Alert.alert("Error saving userId", error);
        }
    }

    deleteUserId = async () => {
        try {
            await AsyncStorage.removeItem('profileId');
            Alert.alert("UserId " + userId + " was successfully removed");
          } catch (error) {
            // Error retrieving data
            Alert.alert("Error deleting userId", error);
          }
    }

    showUserId = async () => {
        let userId = '';
        try {
            userId = await AsyncStorage.getItem('profileId');
            Alert.alert("UserId is", userId)
        } catch (error) {
            // Error retrieving data
            Alert.alert("Error getting userId", error);
        }
    }

    render() {
        return (
            <View>
                <Button title="Save data" onPress={() => this.saveUserId()}></Button>
                <Button title="Delete saved data" onPress={() => this.deleteUserId()}></Button>
                <Button title="Show saved data" onPress={() => this.showUserId()}></Button>
            </View>
        );
    }
}