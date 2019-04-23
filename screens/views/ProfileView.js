import React from 'react';
import { View, Alert, AsyncStorage } from 'react-native';
import { Content, Form, Item, Input, Button, Text, Label, Picker, ListItem, Radio, Right, Left, H3 } from 'native-base';
import firebase from 'firebase';

const defaultID = '-LcjXTt7fimzXaanpF7R';

export default class ProfileView extends React.Component {

    state = {
        editCancelButton: 'Edit',
        //profile data states
        genderState: this.props.profileData.gender,
        ageState: this.props.profileData.age,
        heightState: this.props.profileData.height,
        weightState: this.props.profileData.weight,
        exerciseState: this.props.profileData.exercise,
        allergyState: this.props.profileData.allergy ? this.props.profileData.allergy : [],
        aimState: this.props.profileData.aim,
    }

    editCancelForm = () => {
        // EDIT button pressed
        if (this.state.editCancelButton === 'Edit') {
            this.setState({
                editCancelButton: 'Cancel'
            });
        }
        // CANCEL button pressed
        else {
            this.setState({
                editCancelButton: 'Edit',
                genderState: this.props.profileData.gender,
                ageState: this.props.profileData.age,
                heightState: this.props.profileData.height,
                weightState: this.props.profileData.weight,
                exerciseState: this.props.profileData.exercise,
                allergyState: this.props.profileData.allergy ? this.props.profileData.allergy : [],
                aimState: this.props.profileData.aim,
            });
        }
    }

    saveForm = () => {
        //Prepare the data
        var newProfileData = {
            'gender': this.state.genderState,
            'age': this.state.ageState,
            'height': this.state.heightState,
            'weight': this.state.weightState,
            'exercise': this.state.exerciseState,
            'allergy': this.state.allergyState,
            'aim': this.state.aimState
        };

        //Modify the parent state of profileData
        this.props.modifyParentProfileData(newProfileData);

        this.setState({editCancelButton: 'Edit',});

        //Save to Firebase
        this.saveToFirebase(newProfileData);
    }

    saveToFirebase = (profileData) => {
        AsyncStorage.getItem("profileId").then(profileID => {
            if (profileID === null) {
                //Save profile data to Firebase and get its key as ID
                var newProfileID = firebase.database().ref('profiles').push(profileData).key;
                AsyncStorage.setItem("profileId", newProfileID).catch(error => console.log(error));
            } else {
                //Update profile data on Firebase
                firebase.database().ref('profiles/' + profileID).update(profileData);
            }
        })
        .catch(error => console.log(error));
    }

    addRemoveAllergies = (allergy) => {
        var allergyArray = [...this.state.allergyState];
        var index = allergyArray.indexOf(allergy);
        //Remove allergy
        if (index >= 0) {
            allergyArray.splice(index, 1);
        }
        //Add allergy
        else {
            allergyArray.splice(0, 0, allergy);
        }
        this.setState({ allergyState: allergyArray });
    }

    render() {
        return (
            <Content padder>
                <Form>

                    <Button style={{ marginTop: 10 }} block
                        primary={this.state.editCancelButton === 'Edit'}
                        warning={this.state.editCancelButton === 'Cancel'}
                        onPress={this.editCancelForm} >
                        <Text>{this.state.editCancelButton}</Text>
                    </Button>

                    {/* Gender prompt */}
                    <Item picker>
                        <Label>Gender:</Label>
                        <Picker
                            prompt="Select gender"
                            mode="dialog"
                            enabled={this.state.editCancelButton === 'Cancel'}
                            selectedValue={this.state.genderState}
                            onValueChange={(itemValue, itemIndex) =>
                                this.setState({ genderState: itemValue })
                            }>
                            <Picker.Item label="Male" value="male" />
                            <Picker.Item label="Female" value="female" />
                        </Picker>
                    </Item>

                    {/* Age prompt */}
                    <Item floatingLabel>
                        <Label style={{ marginBottom: 10 }}>Age:</Label>
                        <Input value={this.state.ageState} style={{ marginTop: 10 }} editable={this.state.editCancelButton === 'Cancel'}
                            onChangeText={(age) => {
                                this.setState({ ageState: age });
                            }} />
                    </Item>

                    {/* Height prompt, in cm */}
                    <Item floatingLabel>
                        <Label style={{ marginBottom: 10 }}>Height (cm):</Label>
                        <Input value={this.state.heightState} style={{ marginTop: 10 }} editable={this.state.editCancelButton === 'Cancel'} onChangeText={(height) => this.setState({ heightState: height })} />
                    </Item>

                    {/* Body mass prompt, in kg */}
                    <Item floatingLabel>
                        <Label style={{ marginBottom: 10 }}>Body weight (kg):</Label>
                        <Input value={this.state.weightState} style={{ marginTop: 10 }} editable={this.state.editCancelButton === 'Cancel'} onChangeText={(weight) => this.setState({ weightState: weight })} />
                    </Item>

                    {/* Exercising prompt */}
                    <Item picker>
                        <Label>Exercising frequency:</Label>
                        <Picker
                            prompt="How often do you exercise?"
                            mode="dialog"
                            enabled={this.state.editCancelButton === 'Cancel'}
                            selectedValue={this.state.exerciseState}
                            onValueChange={(itemValue, itemIndex) =>
                                this.setState({ exerciseState: itemValue })
                            }>
                            <Picker.Item label="Sedentary" value="sedentary" />
                            <Picker.Item label="Light" value="light" />
                            <Picker.Item label="Moderate" value="moderate" />
                            <Picker.Item label="Active" value="active" />
                            <Picker.Item label="Very active" value="very-active" />
                        </Picker>
                    </Item>

                    {/* Body aim prompt */}
                    <Item picker>
                        <Label>Your body aim:</Label>
                        <Picker
                            prompt="What do you want to achieve?"
                            mode="dialog"
                            enabled={this.state.editCancelButton === 'Cancel'}
                            selectedValue={this.state.aimState}
                            onValueChange={(itemValue, itemIndex) =>
                                this.setState({ aimState: itemValue })
                            }>
                            <Picker.Item label="Reduce weight" value="reduce-weight" />
                            <Picker.Item label="Maintain weight" value="maintain-weight" />
                            <Picker.Item label="Gain weight" value="gain-weight" />
                        </Picker>
                    </Item>

                    {/* Dietary restrictions prompt */}
                    <H3>Your dietary restrictions</H3>
                    <ListItem>
                        <Left>
                            <Text>Lactose</Text>
                        </Left>
                        <Right>
                            <Radio selected={this.state.allergyState.includes('lactose')}
                                onPress={() => this.addRemoveAllergies('lactose')}
                                disabled={this.state.editCancelButton === 'Edit'} />
                        </Right>
                    </ListItem>
                    <ListItem>
                        <Left>
                            <Text>Gluten</Text>
                        </Left>
                        <Right>
                            <Radio selected={this.state.allergyState.includes('gluten')}
                                onPress={() => this.addRemoveAllergies('gluten')}
                                disabled={this.state.editCancelButton === 'Edit'} />
                        </Right>
                    </ListItem>
                    <ListItem>
                        <Left>
                            <Text>Soy</Text>
                        </Left>
                        <Right>
                            <Radio selected={this.state.allergyState.includes('soy')}
                                onPress={() => this.addRemoveAllergies('soy')}
                                disabled={this.state.editCancelButton === 'Edit'} />
                        </Right>
                    </ListItem>
                    <ListItem>
                        <Left>
                            <Text>Nuts</Text>
                        </Left>
                        <Right>
                            <Radio selected={this.state.allergyState.includes('nuts')}
                                onPress={() => this.addRemoveAllergies('nuts')}
                                disabled={this.state.editCancelButton === 'Edit'} />
                        </Right>
                    </ListItem>

                    {
                        /* Save and Cancel button */
                        this.state.editCancelButton === 'Cancel' &&
                        <View style={{ flexDirection: "row" }}>
                            <Content padder>
                                <Button full success onPress={this.saveForm}>
                                    <Text>Save</Text>
                                </Button>
                            </Content>

                            <Content padder>
                                <Button full warning onPress={this.editCancelForm}>
                                    <Text>Cancel</Text>
                                </Button>
                            </Content>
                        </View>
                    }
                </Form>
            </Content>
        );
    }
}