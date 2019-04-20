import React from 'react';
import { View, Alert, AsyncStorage, Image } from 'react-native';
import { Separator, List, ListItem, Content, Form, Item, Input, Button, Text, Label, Picker, Radio, Right, Left, H3, Header, Title, Body, Container } from 'native-base';
import firebase from 'firebase';

const date = new Date();

export default class DietRecView extends React.Component {

    state = {
        foodInHouse: this.props.foodInHouse,
        currentDate: {
            "date": date.getDate(),
            "month": date.getMonth() + 1,
            "year": date.getFullYear()
        },
        testFood: [
            {
                "name": "chicken-breast",
                "quantity": {
                    "type": "g",
                    "amount": "500"
                },
                "expiration": "24.04.2019"
            },
            {
                "name": "potato",
                "quantity": {
                    "type": "g",
                    "amount": "2000"
                },
                "expiration": "30.06.2019"
            },
            {
                "name": "tomato",
                "quantity": {
                    "type": "g",
                    "amount": "200"
                },
                "expiration": "10.05.2019"
            }
        ]
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
                    <List>
                        <Separator bordered style={{backgroundColor: '#e77681'}}>
                            <Text style={{color: '#ffffff', fontSize: 16}}>Soon to expire!</Text>
                        </Separator>
                        <ListItem thumbnail>
                            <Body>
                                <Text>Chicken breast</Text>
                                <Text note numberOfLines={1}>Expires: 24.04.2019</Text>
                                <Text note numberOfLines={1}>Quantity: 500 g</Text>
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
                        <ListItem thumbnail last>
                            <Body>
                                <Text>Tomato</Text>
                                <Text note numberOfLines={1}>Expires: 10.05.2019</Text>
                                <Text note numberOfLines={1}>Quantity: 200 g</Text>
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
                    </List>

                    {/* Products that have a lot of time */}
                    <List>
                        <Separator bordered bordered style={{backgroundColor: '#81e776'}}>
                            <Text style={{color: '#ffffff', fontSize: 16}}>Other products</Text>
                        </Separator>
                        <ListItem thumbnail last>
                            <Body>
                                <Text>Potato</Text>
                                <Text note numberOfLines={1}>Expires: 30.06.2019</Text>
                                <Text note numberOfLines={1}>Quantity: 2000 g</Text>
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
                        <ListItem thumbnail last>
                            <Body>
                                <Text>Potato</Text>
                                <Text note numberOfLines={1}>Expires: 30.06.2019</Text>
                                <Text note numberOfLines={1}>Quantity: 2000 g</Text>
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
                        <ListItem thumbnail last>
                            <Body>
                                <Text>Potato</Text>
                                <Text note numberOfLines={1}>Expires: 30.06.2019</Text>
                                <Text note numberOfLines={1}>Quantity: 2000 g</Text>
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
                    </List>
                </Content>
            </Container>
        );
    }
}