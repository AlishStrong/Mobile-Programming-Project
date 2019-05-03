import React from 'react';
import { StyleSheet, AsyncStorage } from 'react-native';
import { Container, Content, Button, Text } from 'native-base';
import firebase from 'firebase';

//The main screen that navigates to other screens, aka GrandParent
export default class HomeScreen extends React.Component {
    static navigationOptions = { title: 'Home', };

    state = {
        loaded: false,
        dailyCalories: 2433,
        testState: 'I was created by Parent',
        profileData: {},
        progressData: {},
        foodInHouse: [
            {
                "name": "Pizza",
                "expiration": ["10", "07", "2019"],
                "quantity": {
                    "amount": "2",
                    "type": "pcs"
                }
            },
            {
                "name": "Salmon",
                "expiration": ["02", "05", "2019"],
                "quantity": {
                    "amount": "700",
                    "type": "g"
                }
            }
        ]
    }

    componentWillMount = () => {
        //Check if there is a need for profileData fetching
        if (JSON.stringify(this.state.profileData) === '{}' ) {
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
                            "allergy": ["peanut-free"],
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
        firebase.database().ref('food/' + profileID).once('value')
            .then((snapshot) => {
                this.setState({
                    foodInHouse: snapshot.val()
                });
            })
            .catch((error) => console.log(error));
        //Fetch progressData    
        firebase.database().ref('progress/' + profileID).once('value')
            .then((snapshot) => {
                this.setState({
                    progressData: snapshot.val()
                });
            })
            .catch((error) => console.log(error));
    }

    setDailyCaloriesState = (newCalIntake) => {
        this.setState({dailyCalories: newCalIntake});
    }

    modifyProfileData = (newProfileData) => {
        this.setState({  });
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <Container>
                <Content>
                    <Text style={styles.headerStyle}>Welcome, this app will help you in global action for food waste reduction</Text>
                    <Button disabled={!this.state.loaded}
                        style={styles.buttonStyle} block success
                        onPress={() => navigate('ProfileRT', { profileData: this.state.profileData, modifyGrandParentProfileData: this.modifyProfileData, setDailyCaloriesState: this.setDailyCaloriesState })} >
                        <Text>Profile</Text>
                    </Button>
                    <Button disabled={!this.state.loaded}
                        style={styles.buttonStyle} block info
                        onPress={() => navigate('MyFoodRT', { foodInHouse: this.state.foodInHouse })} >
                        <Text>My Food</Text>
                    </Button>
                    <Button disabled={!this.state.loaded}
                        style={styles.buttonStyle} block warning
                        onPress={() => navigate('RecipesRT', { foodInHouse: this.state.foodInHouse, dailyIntake: this.state.dailyCalories, profileData: this.state.profileData })} >
                        <Text>Recipes</Text>
                    </Button>
                    <Button disabled={!this.state.loaded}
                        style={styles.buttonStyle} block danger
                        onPress={() => navigate('DiaryRT', { progressData: this.state.progressData })} >
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