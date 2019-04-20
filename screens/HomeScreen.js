import React from 'react';
import { StyleSheet, AsyncStorage, Alert } from 'react-native';
import { Container, Content, Button, Text } from 'native-base';
import firebase from 'firebase';

export default class HomeScreen extends React.Component {
    static navigationOptions = { title: 'Home', };

    state = {
        loaded: false,
        testState: 'I was created by Parent',
        profileData: {},
        foodInHouse: {}
    }

    componentWillMount = () => {
        this.setState({ anotherTestState: 'I got modified' });
        //Check if there is a need for profileData fetching
        if (JSON.stringify(this.state.profileData) === '{}') {
            //Check whether profileID is saved
            AsyncStorage.getItem("profileId").then((profileID) => {
                //ProfileID is saved -> fetch data from Firebase
                if (profileID !== null) {
                    this.fetchFirebase(profileID);
                }
                //ProfileID is not saved -> fetch default data
                else {
                    this.setState({
                        profileData: {
                            "age": "25",
                            "aim": "maintain-weight",
                            "allergy": ["nuts", "gluten"],
                            "exercise": "moderate",
                            "gender": "male",
                            "height": "180",
                            "weight": "65"
                        }
                    });
                    this.setState({ loaded: true });
                }
            }).catch(error => console.log(error));
        } else {
            this.setState({ loaded: true });
        }

    }

    //Fetch data from Firebase
    fetchFirebase = (profileID) => {
        //Fetch profileData
        firebase.database().ref('profiles/' + profileID).once('value')
            .then((snapshot) => {
                this.setState({
                    profileData: snapshot.val()
                });
                this.setState({ loaded: true });
            })
            .catch((error) => console.log(error));
        //Fetch foodInHouse
        firebase.database().ref('housefood/' + profileID).once('value')
            .then((snapshot) => {
                this.setState({
                    foodInHouse: snapshot.val()
                });
            })
            .catch((error) => console.log(error));
    }

    modifyProfileData = (newProfileData) => {
        // Alert.alert("Modification in HomeScreen");
        this.setState({ profileData: newProfileData });
    }

    editTestState = (something) => {
        this.setState({ showText: true });
        if (something !== 'undefined') {
            this.setState({ testState: something });
            Alert.alert("you passed: " + something + ". Thus the new state is: " + this.state.testState);
        } else {
            Alert.alert("I am showing the default state: " + this.state.testState);
        }
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <Container>
                <Content>
                    <Text style={styles.headerStyle}>This is the home screen</Text>
                    <Button disabled={!this.state.loaded}
                        style={styles.buttonStyle} block success
                        onPress={() => navigate('ProfileRT', { profileData: this.state.profileData, modifyParentProfileData: this.modifyProfileData })} >
                        <Text>Profile</Text>
                    </Button>
                    <Button disabled={!this.state.loaded}
                        style={styles.buttonStyle} block info
                        onPress={() => navigate('MyFoodRT', { foodInHouse: this.state.foodInHouse, passedItem: this.state.testState, passedFunction: this.editTestState, profileData: this.state.profileData })} >
                        <Text>My Food</Text>
                    </Button>
                    <Button disabled={!this.state.loaded}
                        style={styles.buttonStyle} block warning
                        onPress={() => navigate('RecipesRT')} >
                        <Text>Recipes</Text>
                    </Button>
                    <Button disabled={!this.state.loaded}
                        style={styles.buttonStyle} block danger
                        onPress={() => navigate('DiaryRT')} >
                        <Text>Diary</Text>
                    </Button>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#ecf5fd'
    },
    headerStyle: {
        fontSize: 24,
        fontWeight: '100',
        marginBottom: 24,
        marginTop: 24
    },
    buttonStyle: {
        marginBottom: 24
    }
});