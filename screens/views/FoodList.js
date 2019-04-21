import React from 'react';
import { View, Alert, AsyncStorage, Image } from 'react-native';
import { Separator, List, ListItem, Content, Form, Item, Input, Button, Text, Label, Picker, Radio, Right, Left, H3, Header, Title, Body, Container } from 'native-base';
import firebase from 'firebase';
import Modal from "react-native-modal";

const currentDate = new Date();

export default class FoodList extends React.Component {

    state = {
        //For modal
        showEditModal: false,
        showRemoveModal: false,
        modalContent: {"name": "needed, otherwise JS crashes the app!"},

        foodInHouse: this.props.foodInHouse,
        expiredFood: [],
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
            },
            {
                "name": "cheese",
                "quantity": {
                    "type": "g",
                    "amount": "100"
                },
                "expiration": ["20", "04", "2019"]
            }
        ]
    }

    componentDidMount = () => {
        var foodArray = this.state.testFood;
        foodArray.sort((a, b) => this.orderFoodByDate(a, b));

        var expiredFood = [];
        var soonToExpire = [];
        var safeToEat = [];

        foodArray.map((item) => {
            ed = item.expiration;
            var productExpiration = new Date(ed[2], (ed[1] - 1), ed[0]);
            var dayDifference = Math.round((productExpiration - currentDate) / (1000 * 60 * 60 * 24));
            if (dayDifference < 0) {
                expiredFood.push(item);
            } else if (dayDifference < 7) {
                soonToExpire.push(item);
            } else {
                safeToEat.push(item);
            }
        });

        this.setState({
            expiredFood: expiredFood,
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

    removeFood = (foodName) => {
        // var foodArray = this.state.testFood;
        // var removeIndex = foodArray.indexOf(foodName);
        // if (removeIndex !== -1) {
        //     foodArray.splice(removeIndex, 1);
        //     this.setState({ testFood: foodArray });
        // }
        Alert.alert("remove: " + foodName.name);
    }

    showRemoveModal = (item) => {
        this.setState({
            modalContent: item,
            showRemoveModal: true
        });
    }

    showEditModal = (item) => {
        this.setState({
            modalContent: item,
            showEditModal: true
        });
    }

    //You can return an array of objects for rendering!
    renderFoodLists = () => {
        var toReturn = [];
        if (this.state.expiredFood.length > 0) {
            toReturn.push(
                <CurrentFoodList 
                    foodData={this.state.expiredFood} 
                    showEditModal={this.showEditModal}
                    removeFood={this.showRemoveModal}
                    separatorContent={{"message": "Expired!!!", "bgc": "#e77681"}} 
                />
            );
        }
        if (this.state.soonToExpireFood.length > 0) {
            toReturn.push(
                <CurrentFoodList 
                    foodData={this.state.soonToExpireFood} 
                    showEditModal={this.showEditModal}
                    removeFood={this.showRemoveModal}
                    separatorContent={{"message": "Soon to expire!", "bgc": "#ffc107"}} 
                />
            );
        }
        if (this.state.safeFood.length > 0) {
            toReturn.push(
                <CurrentFoodList 
                    foodData={this.state.safeFood} 
                    showEditModal={this.showEditModal}
                    removeFood={this.showRemoveModal}
                    separatorContent={{"message": "Other products", "bgc": "#28a745"}} 
                />
            );
        }
        return toReturn;
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
                    {
                        /* List of products */
                        this.renderFoodLists()
                    }

                    {/* Modal for edit */}
                    <Modal isVisible={this.state.showEditModal}>
                        <View style={{
                             backgroundColor: "white",
                             padding: 22,
                             justifyContent: "center",
                             alignItems: "center",
                             borderRadius: 4,
                             borderColor: "rgba(0, 0, 0, 0.1)",
                        }}>
                            <Text>Content: {this.state.modalContent.name}</Text>
                            <Button onPress={() => this.setState({ showEditModal: false })} ><Text>Hide me!</Text></Button>
                        </View>
                    </Modal>

                    {/* Modal for removal */}
                    <Modal isVisible={this.state.showRemoveModal}>
                        <View style={{
                             backgroundColor: "white",
                             padding: 22,
                             justifyContent: "center",
                             alignItems: "center",
                             borderRadius: 4,
                             borderColor: "rgba(0, 0, 0, 0.1)",
                        }}>
                            <Text>Are you sure you want to remove {this.state.modalContent.name.replace('-', ' ')} from your food list?</Text>
                            <Button onPress={() => this.setState({ showRemoveModal: false })} ><Text>Hide me!</Text></Button>
                        </View>
                    </Modal>
                </Content>
            </Container>
        );
    }
}

class CurrentFoodList extends React.Component {
    render() {
        return (
            <Content>
                <Separator bordered style={{ backgroundColor: this.props.separatorContent.bgc }}>
                    <Text style={{ color: '#ffffff', fontSize: 16 }}>{this.props.separatorContent.message}</Text>
                </Separator>
                <List dataArray={this.props.foodData} renderRow={(item) => {
                    return <ListItem thumbnail>
                        <Body>
                            <Text>{item.name.charAt(0).toUpperCase() + item.name.slice(1).replace('-', ' ')}</Text>
                            <Text note numberOfLines={1}>Expires on: {item.expiration.join(".")}</Text>
                            <Text note numberOfLines={1}>Quantity: {item.quantity.amount} {item.quantity.type}</Text>
                        </Body>
                        <Right>
                            <Button transparent onPress={() => this.props.showEditModal(item)}
                                style={{ marginBottom: 5 }}>
                                <Text>Edit</Text>
                            </Button>
                            <Button transparent onPress={() => this.props.removeFood(item)}>
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
