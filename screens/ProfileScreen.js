import React from 'react';
import {Alert} from 'react-native';
import { Container, Content, Form, Item, Input, Button, Text, Label, Picker, Footer, FooterTab, Tab, Tabs } from 'native-base';

import ProfileView from "./views/ProfileView";
import DietRecView from "./views/DietRecView";

//ProfileScreen - parent to ProfileView and DietRecView
export default class ProfileScreen extends React.Component {
    static navigationOptions = { title: 'Profile', };

    state = {
        //State of profileData is needed for two children of ProfileScreen!
        profileData: this.props.navigation.state.params.profileData
    }

    modifyParentProfileData = (newProfileData) => {
        this.setState({profileData: newProfileData});
        this.props.navigation.state.params.modifyGrandParentProfileData(newProfileData);
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <Container>
                <Tabs tabBarPosition="bottom">
                    <Tab heading="Profile" tabStyle={{ width: 100 }} activeTabStyle={{ width: 100 }} tab>
                        <Content>
                            <ProfileView profileData={this.state.profileData} modifyParentProfileData={this.modifyParentProfileData} />
                        </Content>
                    </Tab>
                    <Tab heading="Diet Recommendation" tabStyle={{ width: 100 }} activeTabStyle={{ width: 100 }}>
                        <DietRecView profileData={this.state.profileData} />
                    </Tab>
                </Tabs>
            </Container>
        );
    }
}