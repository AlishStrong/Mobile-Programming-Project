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
    render() {
        //Calculate Basal Metabolic Rate and daily energy consumption in calories
        var BMR = 10 * parseFloat(this.props.profileData.weight) + 6.25 * parseFloat(this.props.profileData.height) - 5 * parseFloat(this.props.profileData.age);
        this.props.profileData.gender === 'male' ? BMR += 5 : BMR -= 161;
        var exercising = this.props.profileData.exercise;
        var goal = this.props.profileData.aim;
        var dailyIntake = BMR * coefficients[exercising][goal];
        
        return (
            <Content padder>
                <H3>Dietary Reccomendations</H3>
                <Content>
                    <Image source={imgSrc[this.props.profileData.aim][this.props.profileData.gender]} />
                    <Text>Your BMR index is {Math.round(BMR)}</Text>
                    <Text>According to the data you provided, in order to {this.props.profileData.aim.replace('-', ' ')} you should consume {Math.round(dailyIntake)} calories per day</Text>
                    {(this.props.profileData.allergy && this.props.profileData.allergy.length > 0) &&
                        <Text>
                            A friendly reminder that you should not consume the following products due to your dietary restrictions: {this.props.profileData.allergy.join(', ')}.
                        </Text>
                    }
                </Content>
            </Content>
        );
    }
}