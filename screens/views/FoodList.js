import React from 'react';
import { View, TextInput } from 'react-native';
import { Separator, List, ListItem, Content, Button, Text, Right, Header, Title, Body, Container } from 'native-base';
import firebase from 'firebase';
import Modal from "react-native-modal"; //Does not support native-base properly components

const currentDate = new Date();

export default class FoodList extends React.Component {

    state = {
        //For modal
        showEditModal: false,
        showRemoveModal: false,
        modalContent: {
            "name": "test",
            "quantity": {
                "type": "test",
                "amount": "test"
            },
            "expiration": ["test"]
        }
    }

    //You can return an array of objects for rendering!
    renderFoodLists = (foodArray) => {
        toReturn = [];

        if(foodArray !== null && foodArray.length > 0) {
            var expiredFood = [];
            var soonToExpireFood = [];
            var safeToEatFood = [];

            foodArray.sort((a, b) => this.orderFoodByDate(a, b))
                .map((item) => {
                    var ed = item.expiration;
                    var productExpiration = new Date(ed[2], (ed[1] - 1), ed[0]);
                    var dayDifference = Math.round((productExpiration - currentDate) / (1000 * 60 * 60 * 24));
                    if (dayDifference < 0) {
                        expiredFood.push(item);
                    } else if (dayDifference < 7) {
                        soonToExpireFood.push(item);
                    } else {
                        safeToEatFood.push(item);
                    }
            });

            if (expiredFood.length > 0) {
                toReturn.push(
                    <CurrentFoodList
                        key={"Expired!!!"}
                        foodData={expiredFood}
                        showEditModal={this.showEditModal}
                        removeFood={this.showRemoveModal}
                        separatorContent={{ "message": "Expired!!!", "bgc": "#e77681" }}
                    />
                );
            }
            if (soonToExpireFood.length > 0) {
                toReturn.push(
                    <CurrentFoodList
                        key={"Soon to expire!"}
                        foodData={soonToExpireFood}
                        showEditModal={this.showEditModal}
                        removeFood={this.showRemoveModal}
                        separatorContent={{ "message": "Soon to expire!", "bgc": "#ffc107" }}
                    />
                );
            }
            if (safeToEatFood.length > 0) {
                toReturn.push(
                    <CurrentFoodList
                        key={"Other products"}
                        foodData={safeToEatFood}
                        showEditModal={this.showEditModal}
                        removeFood={this.showRemoveModal}
                        separatorContent={{ "message": "Other products", "bgc": "#28a745" }}
                    />
                );
            }
        }
        else {
            return <Text>There is no food</Text>
        }

        return toReturn;
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

    removeFood = () => {
        var nameToRemove = this.state.modalContent.name;
        var oldFoodState = this.props.foodInHouse;
        var newFoodState = oldFoodState.filter((item) => item.name !== nameToRemove);
        var profileID = this.props.profileID;
        firebase.database().ref('food/' + profileID).set(newFoodState);
        this.props.changePstate(newFoodState, '');
        this.setState({
            showRemoveModal: false
        });
    }

    editFood = () => {
        var nameToEdit = this.state.modalContent.name;
        var oldFoodState = this.props.foodInHouse;
        var newFoodState = oldFoodState.filter((item) => item.name !== nameToEdit);
        newFoodState.splice(0,0,this.state.modalContent);
        var profileID = this.props.profileID;
        firebase.database().ref('food/' + profileID).set(newFoodState);
        this.props.changePstate(newFoodState, '');
        this.setState({
            showEditModal: false
        });
    }

    showRemoveModal = (item, source) => {
        var foodToRemove = item;
        foodToRemove.source = source;
        this.setState({
            modalContent: foodToRemove,
            showRemoveModal: true
        });
    }

    showEditModal = (item) => {
        this.setState({
            modalContent: item,
            showEditModal: true
        });
    }

    render() {
        var foodDataArray = this.props.foodInHouse;
        var profileID = this.props.profileID;
        var foodDataRef = firebase.database().ref('food/' + profileID).on("value", (snapshot) => foodDataArray = snapshot.val());

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
                        this.renderFoodLists(foodDataArray)
                    }

                    {/* Modal for edit */}
                    <Modal isVisible={this.state.showEditModal}>
                        <View style={{
                            flexDirection: "column",
                            backgroundColor: "white",
                            padding: 22,
                            justifyContent: "center",
                            alignItems: 'stretch',
                            borderRadius: 4,
                            borderColor: "rgba(0, 0, 0, 0.1)"
                        }}>

                            {/* Title of the modal */}
                            <Text style={{ 
                                    fontWeight: "bold", 
                                    fontSize: 20, 
                                    marginBottom: 10
                                }}
                            >
                                Edit {this.state.modalContent.name.replace('-', ' ')}
                            </Text>

                            {/* Prompt for food name */}
                            <View style={{ flexDirection: "column", marginBottom: 10 }} >
                                <Text style={{ fontWeight: "bold" }}>
                                    Food name:
                                </Text>
                                <TextInput style={{ 
                                        fontSize: 16,
                                        color: "#494949",
                                        borderWidth: 2, 
                                        borderColor: "#dfdfdf",
                                        borderRadius: 6,
                                        paddingLeft: 5
                                    }} 
                                    value={this.state.modalContent.name.replace('-', ' ')}
                                    onChangeText={(newName) => this.setState(prevState => ({
                                        modalContent: {
                                            ...prevState.modalContent,
                                            name: newName
                                        }
                                    }))} 
                                />
                            </View>
                            
                            {/* Promt for expiration date */}
                            <View style={{ flexDirection: "column", marginBottom: 10 }}>
                                <Text style={{ fontWeight: "bold" }}>Expiration date</Text>
                                <View style={{ flexDirection: "row" }}>
                                    {/* Day */}
                                    <View style={{ width: 70 }}>
                                        <Text style={{ fontWeight: "bold" }}>Day:</Text>
                                        <TextInput style={{ 
                                                fontSize: 16,
                                                color: "#494949",
                                                borderWidth: 2, 
                                                borderColor: "#dfdfdf",
                                                borderRadius: 6,
                                                paddingLeft: 5
                                            }} 
                                            keyboardType={"numeric"}
                                            value={this.state.modalContent.expiration[0]}
                                            onChangeText={(newDay) => {
                                                var forNewExp = this.state.modalContent.expiration;
                                                forNewExp[0] = newDay;
                                                this.setState(prevState => ({
                                                    modalContent: {
                                                        ...prevState.modalContent,
                                                        expiration: forNewExp
                                                    }
                                                }))
                                            }}
                                        />
                                    </View>

                                    {/* Month */}
                                    <View style={{ width: 70, marginLeft: 10 }}>
                                        <Text style={{ fontWeight: "bold" }}>Month:</Text>
                                        <TextInput style={{ 
                                                fontSize: 16,
                                                color: "#494949",
                                                borderWidth: 2, 
                                                borderColor: "#dfdfdf",
                                                borderRadius: 6,
                                                paddingLeft: 5
                                            }} 
                                            keyboardType={"numeric"}
                                            value={this.state.modalContent.expiration[1]}
                                            onChangeText={(newMonth) => {
                                                var forNewExp = this.state.modalContent.expiration;
                                                forNewExp[1] = newMonth;
                                                this.setState(prevState => ({
                                                    modalContent: {
                                                        ...prevState.modalContent,
                                                        expiration: forNewExp
                                                    }
                                                }))
                                            }}
                                        />
                                    </View>

                                    {/* Year */}
                                    <View style={{ width: 70, marginLeft: 10 }}>
                                        <Text style={{ fontWeight: "bold" }}>Year:</Text>
                                        <TextInput style={{ 
                                                fontSize: 16,
                                                color: "#494949",
                                                borderWidth: 2, 
                                                borderColor: "#dfdfdf",
                                                borderRadius: 6,
                                                paddingLeft: 5
                                            }} 
                                            keyboardType={"numeric"}
                                            value={this.state.modalContent.expiration[2]}
                                            onChangeText={(newYear) => {
                                                var forNewExp = this.state.modalContent.expiration;
                                                forNewExp[2] = newYear;
                                                this.setState(prevState => ({
                                                    modalContent: {
                                                        ...prevState.modalContent,
                                                        expiration: forNewExp
                                                    }
                                                }))
                                            }}
                                        />
                                    </View>
                                </View>
                            </View>

                            {/* Prompt for amount */}
                            <View style={{ flexDirection: "column", marginBottom: 10 }}>
                                <Text style={{ fontWeight: "bold" }}>Amount:</Text>
                                <TextInput style={{ 
                                        fontSize: 16,
                                        color: "#494949",
                                        borderWidth: 2, 
                                        borderColor: "#dfdfdf",
                                        borderRadius: 6,
                                        paddingLeft: 5
                                    }} 
                                    value={this.state.modalContent.quantity.amount}
                                    onChangeText={(newAmount) => {
                                        var newQuantity = this.state.modalContent.quantity;
                                        newQuantity.amount = newAmount;
                                        this.setState(prevState => ({
                                            modalContent: {
                                                ...prevState.modalContent,
                                                quantity: newQuantity
                                            }
                                        }))
                                    }} 
                                />
                            </View>
                            
                            {/* Selection of units of measurements */}
                            <View style={{ flexDirection: "column", marginBottom: 10 }}>
                                <Text style={{ fontWeight: "bold" }}>Measurement unit:</Text>
                                <View style={{ flexDirection: "row", marginVertical: 5 }}>

                                    {/* Gram option */}
                                    <Button 
                                        info rounded 
                                        bordered={this.state.modalContent.quantity.type !== "g"}
                                        style={{ height: 30, marginLeft: 15, marginRight: 10 }} 
                                        onPress={() => {
                                            var newQuantity = this.state.modalContent.quantity;
                                            newQuantity.type = "g";
                                            this.setState(prevState => ({
                                                modalContent: {
                                                    ...prevState.modalContent,
                                                    quantity: newQuantity
                                                }
                                            }))
                                        }}
                                    >
                                        <Text style={{ fontSize: 10 }}>
                                            Grams
                                        </Text>
                                    </Button>

                                    {/* Litre option */}
                                    <Button 
                                        info rounded 
                                        bordered={this.state.modalContent.quantity.type !== "l"}
                                        style={{ height: 30 }} 
                                        onPress={() => {
                                            var newQuantity = this.state.modalContent.quantity;
                                            newQuantity.type = "l";
                                            this.setState(prevState => ({
                                                modalContent: {
                                                    ...prevState.modalContent,
                                                    quantity: newQuantity
                                                }
                                            }))
                                        }}
                                    >
                                        <Text style={{ fontSize: 10 }}>
                                            Litres
                                        </Text>
                                    </Button>

                                    {/* Piece option */}
                                    <Button 
                                        info rounded 
                                        bordered={this.state.modalContent.quantity.type !== "pcs"}
                                        style={{ height: 30, marginLeft: 10 }} 
                                        onPress={() => {
                                            var newQuantity = this.state.modalContent.quantity;
                                            newQuantity.type = "pcs";
                                            this.setState(prevState => ({
                                                modalContent: {
                                                    ...prevState.modalContent,
                                                    quantity: newQuantity
                                                }
                                            }))
                                        }}
                                    >
                                        <Text style={{ fontSize: 10 }}>
                                            Pieces
                                        </Text>
                                    </Button>
                                </View>
                            </View>
                            
                            {/* Action buttons */}
                            <View style={{ flexDirection: "column", alignItems: 'center', marginTop: 5 }}>
                                <View style={{ flexDirection: "row" }}>
                                    <Button success onPress={() => this.editFood()}
                                        style={{ marginRight: "10%" }} >
                                        <Text style={{}}>
                                            Save
                                        </Text>
                                    </Button>
                                    <Button warning onPress={() => this.setState({ showEditModal: false })}
                                        style={{}} >
                                        <Text style={{}}>
                                            Cancel
                                        </Text>
                                    </Button>
                                </View>
                            </View>
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
                            <View>
                                <Text>Are you sure you want to remove
                                    <Text style={{ fontWeight: "bold" }}> {this.state.modalContent.name.replace('-', ' ')} </Text>
                                    from your food list?
                                </Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 10 }}>
                                <Button danger onPress={() => this.removeFood()}
                                    style={{ width: "30%", marginRight: "10%" }} >
                                    <Text style={{ marginLeft: "15%" }}>
                                        Yes
                                    </Text>
                                </Button>
                                <Button success onPress={() => this.setState({ showRemoveModal: false })}
                                    style={{ width: "30%" }} >
                                    <Text style={{ marginLeft: "18%" }}>
                                        NO
                                    </Text>
                                </Button>
                            </View>
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
                            <Button transparent onPress={() => this.props.removeFood(item, this.props.separatorContent.message)}>
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
