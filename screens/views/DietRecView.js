import React from 'react';
import { View, Alert, AsyncStorage, Image } from 'react-native';
import { Content, Form, Item, Input, Button, Text, Label, Picker, ListItem, Radio, Right, Left, H3 } from 'native-base';
import firebase from 'firebase';

//Coefficient data needed for daily calorie calculations
const coefficients = {
    'sedetary': {
        'reduce-weight': 1.05,
        'maintain-weight': 1.2,
        'gain-weight': 1.35
    },
    'light': {
        'reduce-weight': 1.22,
        'maintain-weight': 1.38,
        'gain-weight': 1.53
    },
    'moderate': {
        'reduce-weight': 1.31,
        'maintain-weight': 1.47,
        'gain-weight': 1.62
    },
    'active': {
        'reduce-weight': 1.4,
        'maintain-weight': 1.55,
        'gain-weight': 1.7
    },
    'very-active': {
        'reduce-weight': 1.57,
        'maintain-weight': 1.73,
        'gain-weight': 1.88
    }
};

//Array with sources to images, because require() cannot fetch things dynamically!
const imgSrc = {
    'reduce-weight': {
        'female': require('./img/female-reduce-weight.png'),
        'male': require('./img/male-reduce-weight.png')
    },
    'maintain-weight': {
        'female': require('./img/female-maintain-weight.png'),
        'male': require('./img/male-maintain-weight.png')
    },
    'gain-weight': {
        'female': require('./img/female-gain-weight.png'),
        'male': require('./img/male-gain-weight.png')
    }
};

export default class DietRecView extends React.Component {

    state = {
        loaded: false,

        //Profile state
        genderState: '',
        ageState: '',
        heightState: '',
        weightState: '',
        exerciseState: '',
        allergyState: [],
        aimState: '',

        //Diet specific state
        bmr: 0.0,
        dailyCalorie: 0.0
    }

    componentDidMount = () => {
        AsyncStorage.getItem('profileId')
            .then((res) => {
                var profileID = '';
                if (res === null) {
                    //Assign ID with default value
                    profileID = '-LcjXTt7fimzXaanpF7R';
                } else {
                    //Assign ID of the profile
                    profileID = res;
                }
                //Fetch the data from Firebase
                this.fetchFirebase(profileID);
            })
            .catch((error) => { console.log(error) });
    }

    //Fetch data from Firebase
    fetchFirebase = (profileID) => {
        firebase.database().ref('profiles/' + profileID).once('value')
            .then((snapshot) => {
                this.setState({
                    genderState: snapshot.child("gender").val(),
                    ageState: snapshot.child("age").val(),
                    heightState: snapshot.child("height").val(),
                    weightState: snapshot.child("weight").val(),
                    exerciseState: snapshot.child("exercise").val(),
                    allergyState: (snapshot.child("allergy").exists() ? snapshot.child("allergy").val() : []),
                    aimState: snapshot.child("aim").val()
                });

                //Calculate BMR
                this.calculateBMR();

                //Calculate daily intake
                this.calculateDailyCalories();

                //State loading completion
                this.setState({ loaded: true });
            })
            .catch((error) => console.log(error));
    }

    //Calculate Basal Metabolic Rate
    calculateBMR = () => {
        var BMR = 10 * parseFloat(this.state.weightState) + 6.25 * parseFloat(this.state.heightState) - 5 * parseFloat(this.state.ageState);
        this.state.genderState === 'male' ? BMR += 5 : BMR -= 161;
        this.setState({ bmr: BMR });
    }

    //Calculate daily energy consumption in calories
    calculateDailyCalories = () => {
        var exercising = this.state.exerciseState;
        var goal = this.state.aimState;
        var BMR = this.state.bmr;
        var dailyIntake = BMR * coefficients[exercising][goal];
        this.setState({ dailyCalorie: dailyIntake });
    }

    render() {
        return (
            <Content padder>
                <H3>Dietary Reccomendations</H3>
                {this.state.loaded &&
                    <Content>
                         <Image source={imgSrc[this.state.aimState][this.state.genderState]} />
                         <Text>Your BMR index is {Math.round(this.state.bmr)}</Text>
                         <Text>According to the data you provided, in order to {this.state.aimState.replace('-', ' ')} you should consume {Math.round(this.state.dailyCalorie)} calories per day</Text>
                        {this.state.allergyState.length > 0 &&
                            <Text>
                                A friendly reminder that you should not consume the following products due to your dietary restrictions: {this.state.allergyState.join(', ')}.
                            </Text>
                        }
                    </Content>
                }
            </Content>
        );
    }
}