import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class SettingsScreen extends React.Component {
    static navigationOptions= { title:'Settings',};

    render() {
        return(
            <View>
                <Text>This is the settings screen</Text>
            </View>
        );
    }
}