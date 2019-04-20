import React from 'react';
import { View, Alert, AsyncStorage } from 'react-native';
import { Title, Container, Content, Form, Item, Input, Button, Text, Label, Picker, Footer, FooterTab, Tab, Tabs, Header, Body } from 'native-base';

import FoodList from "./views/FoodList";
import FoodAdd from "./views/FoodAdd";

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
        profileData: this.props.navigation.state.params.profileData,
        foodInHouse: this.props.navigation.state.params.foodInHouse
    }

    childModify = () => {
        // const { params } = this.props.navigation.state;
        // var passedFunction = this.props.navigation.getParam('passedFunction');
        // passedFunction('Alisher');
        this.setState({ passedState: 'I was modified by a child!' });
        this.props.navigation.state.params.passedFunction('I was modified by a child!');
    }


    render() {
        return (
            <Container>
                <Tabs tabBarPosition="bottom">
                    <Tab heading="My shelf" tabStyle={{ width: 100 }} activeTabStyle={{ width: 100 }} tab>
                        <FoodList foodInHouse={this.state.foodInHouse} />
                    </Tab>
                    <Tab heading="Add item" tabStyle={{ width: 100 }} activeTabStyle={{ width: 100 }}>
                        <FoodAdd />
                    </Tab>
                </Tabs>
            </Container>
        );
    }
}