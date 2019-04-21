import React from 'react';
import { View, Alert, AsyncStorage, Image } from 'react-native';
import { Separator, List, ListItem, Content, Form, Item, Input, Button, Text, Label, Picker, Radio, Right, Left, H3, Header, Title, Body, Container } from 'native-base';
import firebase from 'firebase';

const currentDate = new Date();

export default class FoodList extends React.Component {

    state = {
        foodInHouse: this.props.foodInHouse,
        soonToExpireFood: [],
        safeFood: [],
        testFood: [
            {
                "name": "chicken-breast",
                "quantity": {
                    "type": "g",
                    "amount": "500"
                },
                "expiration": ["24", "04", "2019"]
            },
            {
                "name": "potato",
                "quantity": {
                    "type": "g",
                    "amount": "2000"
                },
                "expiration": ["30", "06", "2019"]
            },
            {
                "name": "tomato",
                "quantity": {
                    "type": "g",
                    "amount": "200"
                },
                "expiration": ["10", "05", "2019"]
            }
            ,
            {
                "name": "milk",
                "quantity": {
                    "type": "l",
                    "amount": "1"
                },
                "expiration": ["25", "04", "2019"]
            },
            {
                "name": "carrot",
                "quantity": {
                    "type": "g",
                    "amount": "700"
                },
                "expiration": ["20", "05", "2019"]
            },
            {
                "name": "eggs",
                "quantity": {
                    "type": "pieces",
                    "amount": "10"
                },
                "expiration": ["17", "05", "2019"]
            }
            
        ]
    }

    componentDidMount = () => {
        var foodArray = this.state.testFood;
        foodArray.sort((a,b) => this.orderFoodByDate(a,b));

        var soonToExpire = foodArray.filter((item) => {
            ed = item.expiration;
            var productExpiration = new Date(ed[2], (ed[1] - 1), ed[0]);
            var dayDifference = Math.round((productExpiration - currentDate) / (1000 * 60 * 60 * 24));
            if (dayDifference < 7) {
                return item;
            }
        });

        var safeToEat = foodArray.filter((item) => !soonToExpire.includes(item));

        this.setState({
            soonToExpireFood: soonToExpire,
            safeFood: safeToEat
        });
    }

    //Orders food by its expiration date in ascending order
    orderFoodByDate = (food1, food2) => {
        var ed1 = food1.expiration;
        var ed2 = food2.expiration;
        date1 = new Date(ed1[2], (ed1[1] - 1), ed1[0]);
        date2 = new Date(ed2[2], (ed2[1] - 1), ed2[0]);
        if (date1 > date2) {
            return 1;
        } else if (date1 < date2) {
            return -1;
        } else {
            return 0;
        }
    }

    render() {
        return (
            <Container>
                <Header>
                    <Body>
                        <Title>Products in my shelf</Title>
                    </Body>
                </Header>
                <Content>
                    {/* Soon to expire products */}
                    <SoonToExpireList soonToExpire={this.state.soonToExpireFood} />
                    {/* Products that have a lot of time */}
                    <SafeToEatList safeToEat={this.state.safeFood} />
                </Content>
            </Container>
        );
    }
}

class SoonToExpireList extends React.Component {

    render() {
        return (
            <Content>
                <Separator bordered style={{ backgroundColor: '#e77681' }}>
                    <Text style={{ color: '#ffffff', fontSize: 16 }}>Soon to expire!</Text>
                </Separator>
                <List dataArray={this.props.soonToExpire} renderRow={(item) => {
                    return <ListItem thumbnail>
                        <Body>
                            <Text>{item.name.charAt(0).toUpperCase() + item.name.slice(1).replace('-', ' ')}</Text>
                            <Text note numberOfLines={1}>Expires on: {item.expiration.join(".")}</Text>
                            <Text note numberOfLines={1}>Quantity: {item.quantity.amount} {item.quantity.type}</Text>
                        </Body>
                        <Right>
                            <Button transparent>
                                <Text>Edit</Text>
                            </Button>
                            <Button transparent>
                                <Text>Remove</Text>
                            </Button>
                        </Right>
                    </ListItem>
                }}>
                </List>
            </Content>
        );
    }
}

class SafeToEatList extends React.Component {
    render() {
        return (
            <Content>
                <Separator bordered bordered style={{ backgroundColor: '#81e776' }}>
                    <Text style={{ color: '#ffffff', fontSize: 16 }}>Other products</Text>
                </Separator>
                <List dataArray={this.props.safeToEat} renderRow={(item) => {
                    return <ListItem thumbnail>
                        <Body>
                            <Text>{item.name.charAt(0).toUpperCase() + item.name.slice(1).replace('-', ' ')}</Text>
                            <Text note numberOfLines={1}>Expires on: {item.expiration.join(".")}</Text>
                            <Text note numberOfLines={1}>Quantity: {item.quantity.amount} {item.quantity.type}</Text>
                        </Body>
                        <Right>
                            <Button transparent>
                                <Text>Edit</Text>
                            </Button>
                            <Button transparent>
                                <Text>Remove</Text>
                            </Button>
                        </Right>
                    </ListItem>
                }}>
                </List>
            </Content>
        );
    }
}