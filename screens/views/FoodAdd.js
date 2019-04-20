import React from 'react';
import { View, Alert, AsyncStorage, Image } from 'react-native';
import { Content, Form, Item, Input, Button, Text, Label, Picker, ListItem, Radio, Right, Left, H3, Header, Title, Body, Container } from 'native-base';
import firebase from 'firebase';

export default class DietRecView extends React.Component {
    render() {
        return (
            <Container>
                <Header>
                    <Body>
                        <Title>Add an item</Title>
                    </Body>
                </Header>
                <Content>
                    <Text>
                        Form to add a product
                    </Text>
                </Content>
            </Container>
        );
    }
}