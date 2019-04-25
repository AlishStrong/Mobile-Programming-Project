import React from 'react';
import { Alert, Text, AsyncStorage } from 'react-native';
import { Container, Tab, Tabs } from 'native-base';

import FoodList from "./views/FoodList";
import FoodAdd from "./views/FoodAdd";

export default class MyFoodScreen extends React.Component {
    static navigationOptions = { title: 'My food', };

    state = {
        foodInHouse: this.props.navigation.state.params.foodInHouse,
        profileID: ''
    }

    componentDidMount = () => {
        AsyncStorage.getItem("profileId")
        .then(pID => {this.setState({profileID: pID})})
        .catch(error => console.log(error));;
    }

    changePstate = (newFoodState, newProfileID) => {
        if (newProfileID !== '') {
            this.setState({
                foodInHouse: newFoodState,
                profileID: newProfileID
            });
        } else {
            this.setState({
                foodInHouse: newFoodState
            });
        }
    }

    render() {
        return (
            <Container>
                <Tabs tabBarPosition="bottom">
                    <Tab heading="My shelf" tabStyle={{ width: 100 }} activeTabStyle={{ width: 100 }} tab>
                        <FoodList foodInHouse={this.state.foodInHouse} profileID={this.state.profileID} />
                    </Tab>
                    <Tab heading="Add food" tabStyle={{ width: 100 }} activeTabStyle={{ width: 100 }}>
                        <FoodAdd changePstate={this.changePstate} foodInHouse={this.state.foodInHouse} />
                    </Tab>
                </Tabs>
            </Container>
        );
    }
}