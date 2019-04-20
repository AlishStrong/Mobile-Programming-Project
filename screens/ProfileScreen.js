import React from 'react';
import { Container, Content, Form, Item, Input, Button, Text, Label, Picker, Footer, FooterTab, Tab, Tabs } from 'native-base';

import ProfileView from "./views/ProfileView";
import DietRecView from "./views/DietRecView";

export default class ProfileScreen extends React.Component {
    static navigationOptions = { title: 'Profile', };

    render() {
        const { navigate } = this.props.navigation;
        return (
            <Container>
                <Tabs tabBarPosition="bottom">
                    <Tab heading="Profile" tabStyle={{ width: 100 }} activeTabStyle={{ width: 100 }} tab>
                        <Content>
                            <ProfileView />
                        </Content>
                    </Tab>
                    <Tab heading="Diet Recommendation" tabStyle={{ width: 100 }} activeTabStyle={{ width: 100 }}>
                        <DietRecView />
                    </Tab>
                </Tabs>
            </Container>
        );
    }
}