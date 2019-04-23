import React from 'react';
import { Alert } from 'react-native';
import { Container, Tab, Tabs } from 'native-base';

import FoodList from "./views/FoodList";
import FoodAdd from "./views/FoodAdd";

export default class MyFoodScreen extends React.Component {
    static navigationOptions = { title: 'My food', };

    state = {
        foodInHouse: this.props.navigation.state.params.foodInHouse
    }

    saveNewFood = (food) => {
        Alert.alert("I modify parent food");
        var foodState = this.state.foodInHouse;
        foodState.push(food);
        this.setState({foodInHouse: foodState});
    }

    render() {
        return (
            <Container>
                <Tabs tabBarPosition="bottom">
                    <Tab heading="My shelf" tabStyle={{ width: 100 }} activeTabStyle={{ width: 100 }} tab>
                        <FoodList foodInHouse={this.state.foodInHouse} />
                    </Tab>
                    <Tab heading="Add item" tabStyle={{ width: 100 }} activeTabStyle={{ width: 100 }}>
                        <FoodAdd foodInHouse={this.state.foodInHouse} saveParentFoodInHouse={this.saveNewFood} />
                    </Tab>
                </Tabs>
            </Container>
        );
    }
}