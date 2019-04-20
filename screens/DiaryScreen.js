import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class DiaryScreen extends React.Component {
    static navigationOptions= { title:'Diary',};

    render() {
        return(
            <View>
                <Text>This is the diary screen</Text>
            </View>
        );
    }
}