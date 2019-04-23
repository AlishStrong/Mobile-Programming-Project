import React from 'react';
import { View, AsyncStorage, TextInput } from 'react-native';
import { Content, Button, Text, Header, Title, Body, Container } from 'native-base';
import firebase from 'firebase';
import Modal from "react-native-modal";

export default class FoodAdd extends React.Component {

    state = {
        newFood: {
            "name": "",
            "quantity": {
                "type": "default",
                "amount": ""
            },
            "expiration": []
        },
        unfilledValues: [],
        showError: false,
        forUnitButtons: 'none'
    }

    saveToFireBase = () => {
        var unfilledValues = []
        var foodToSave = this.state.newFood;
        
        if (foodToSave.name === "") {
            unfilledValues.push("name");
        }
        if (foodToSave.quantity.amount === "") {
            unfilledValues.push("amount");
        }
        if (foodToSave.quantity.type === "default") {
            unfilledValues.push("unit of measurement");
        }
        if (foodToSave.expiration.length < 3 || foodToSave.expiration.includes("")) {
            unfilledValues.push("expiration date");
        }

        //Throw an error and prevent the transaction
        if (unfilledValues.length > 0) {
            this.setState({
                unfilledValues: unfilledValues,
                showError: true
            });
        } 
        //Save the new food
        else {     
            //Check the profile ID
            AsyncStorage.getItem("profileId").then(profileID => {
                if (profileID === null) {
                    //Save food to Firebase and get its key as a new profile ID
                    var newProfileID = firebase.database().ref("food").push(foodData).key;
                    AsyncStorage.setItem("profileId", newProfileID).catch(error => console.log(error));
                } else {
                    //Put food to Firebase through set() method
                    var foodState = this.props.foodInHouse;
                    foodState.push(foodToSave);
                    firebase.database().ref('food/' + profileID).set(foodState);
                }
                //Save the new food to Parent's state
                this.props.saveParentFoodInHouse(foodToSave);
            })
            .catch(error => console.log(error));
        }
    }

    setStateAmount = (amount) => {
        var currentState = this.state.newFood;
        currentState.quantity.amount = amount;
        this.setState({newFood: currentState});
    }

    setStateUnit = (unit) => {
        var currentState = this.state.newFood;
        currentState.quantity.type = unit;
        this.setState({newFood: currentState});
    }

    manageTheUnits = (unit) => {
        if (this.state.forUnitButtons === unit) {
            this.setState({forUnitButtons: 'none'});
            this.setStateUnit('default');
        } else {
            this.setState({forUnitButtons: unit});
            this.setStateUnit(unit);
        }
    }

    render() {
        return (
            <Container>
                <Header>
                    <Body>
                        <Title>Add a new food item</Title>
                    </Body>
                </Header>
                <Content>
                    <View style={{
                            flexDirection: "column",
                            padding: 22,
                            alignItems: 'stretch',
                        }}>

                        {/* Prompt for food name */}
                        <View style={{ flexDirection: "column", marginBottom: 15 }} >
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
                                placeholder={"Type food name here..."}
                                value={this.state.newFood.name.replace('-', ' ')}
                                onChangeText={(newName) => this.setState(prevState => ({
                                    newFood: {
                                        ...prevState.newFood,
                                        name: newName
                                    }
                                }))} 
                            />
                        </View>
                        
                        {/* Promt for expiration date */}
                        <View style={{ flexDirection: "column", marginBottom: 15 }}>
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
                                        placeholder={"XX"}
                                        keyboardType={"numeric"}
                                        value={this.state.newFood.expiration[0]}
                                        onChangeText={(newDay) => {
                                            var forNewExp = this.state.newFood.expiration;
                                            forNewExp[0] = newDay;
                                            this.setState(prevState => ({
                                                newFood: {
                                                    ...prevState.newFood,
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
                                        placeholder={"XX"}
                                        keyboardType={"numeric"}
                                        value={this.state.newFood.expiration[1]}
                                        onChangeText={(newMonth) => {
                                            var forNewExp = this.state.newFood.expiration;
                                            forNewExp[1] = newMonth;
                                            this.setState(prevState => ({
                                                newFood: {
                                                    ...prevState.newFood,
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
                                        placeholder={"XXXX"}
                                        keyboardType={"numeric"}
                                        value={this.state.newFood.expiration[2]}
                                        onChangeText={(newYear) => {
                                            var forNewExp = this.state.newFood.expiration;
                                            forNewExp[2] = newYear;
                                            this.setState(prevState => ({
                                                newFood: {
                                                    ...prevState.newFood,
                                                    expiration: forNewExp
                                                }
                                            }))
                                        }}
                                    />
                                </View>
                            </View>
                        </View>

                        {/* Prompt for amount */}
                        <View style={{ flexDirection: "column", marginBottom: 15 }}>
                            <Text style={{ fontWeight: "bold" }}>Amount:</Text>
                            <TextInput style={{ 
                                    fontSize: 16,
                                    color: "#494949",
                                    borderWidth: 2, 
                                    borderColor: "#dfdfdf",
                                    borderRadius: 6,
                                    paddingLeft: 5
                                }} 
                                keyboardType={"numeric"}
                                placeholder={"Specify amount here..."}
                                value={this.state.newFood.quantity.amount}
                                onChangeText={newAmount => this.setStateAmount(newAmount)} 
                            />
                        </View>
                        
                        {/* Selection of units of measurements */}
                        <View style={{ flexDirection: "column", marginBottom: 15 }}>
                            <Text style={{ fontWeight: "bold" }}>Measurement unit:</Text>
                            <View style={{ flexDirection: "row", justifyContent: "space-around", marginVertical: 5 }}>

                                {/* Gram option */}
                                <Button 
                                    info rounded 
                                    bordered={(this.state.forUnitButtons !== "g" || this.state.forUnitButtons === "none")}
                                    style={{ height: 30 }} 
                                    onPress={() => this.manageTheUnits("g")}
                                >
                                    <Text style={{ fontSize: 10 }}>
                                        Grams
                                    </Text>
                                </Button>

                                {/* Litre option */}
                                <Button 
                                    info rounded 
                                    bordered={(this.state.forUnitButtons !== "l" || this.state.forUnitButtons === "none")}
                                    style={{ height: 30 }} 
                                    onPress={() => this.manageTheUnits("l")}
                                >
                                    <Text style={{ fontSize: 10 }}>
                                        Litres
                                    </Text>
                                </Button>

                                {/* Piece option */}
                                <Button 
                                    info rounded 
                                    bordered={(this.state.forUnitButtons !== "pcs" || this.state.forUnitButtons === "none")}
                                    style={{ height: 30 }} 
                                    onPress={() => this.manageTheUnits("pcs")}
                                >
                                    <Text style={{ fontSize: 10 }}>
                                        Pieces
                                    </Text>
                                </Button>
                            </View>
                        </View>
                        
                        {/* Action buttons */}
                        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 5 }}>
                            <Button success onPress={() => this.saveToFireBase()}>
                                <Text>Save new food item</Text>
                            </Button>
                        </View>
                    </View>

                    {/* Modal for error */}
                    <Modal isVisible={this.state.showError}>
                        <View style={{
                            backgroundColor: "white",
                            padding: 22,
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 4
                        }}>
                            <View>
                                <Text>
                                    You forgot to specify <Text style={{ fontWeight: "bold" }}>{this.state.unfilledValues.join(', ')}</Text>. 
                                </Text>
                            </View>
                            <View style={{ flexDirection: "row", marginTop: 10 }}>
                                <Button info onPress={() => this.setState({ showError: false })}>
                                    <Text>OK</Text>
                                </Button>
                            </View>
                        </View>
                    </Modal>

                </Content>
            </Container>
        );
    }
}