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

    state = {
        passedState: this.props.navigation.state.params.passedItem,
        profileData: this.props.navigation.state.params.profileData
    }

    childModify = () => {
        // const { params } = this.props.navigation.state;
        // var passedFunction = this.props.navigation.getParam('passedFunction');
        // passedFunction('Alisher');
        this.setState({passedState: 'I was modified by a child!'});
        this.props.navigation.state.params.passedFunction('I was modified by a child!');
    }


    render() {
        const { navigation } = this.props;
        const { params } = this.props.navigation.state;
        const passedItem = navigation.getParam('passedItem', 'nothing');
        return (
            <View>
                {/* <Text>{params.passedItem}</Text> */}
                <Text>{this.state.passedState}</Text>
                <Text>{this.state.profileData.age}</Text>
                {this.state.profileData.allergy && <Text>{this.state.profileData.allergy.join(', ')}</Text>}
                <Button title="Change test data" onPress={() => this.childModify()}></Button>
                <Button title="Save data" onPress={() => this.saveUserId()}></Button>
                <Button title="Delete saved data" onPress={() => this.deleteUserId()}></Button>
                <Button title="Show saved data" onPress={() => this.showUserId()}></Button>
            </View>
        );
    }
}