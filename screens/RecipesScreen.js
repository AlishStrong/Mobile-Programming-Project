import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Container, Header, Content, Picker, Form } from "native-base";

export default class RecipesScreen extends React.Component {
    static navigationOptions = { title: 'Recipes', };

    state = {
        language: 'c#',
        exerciseState: 'moderate'
    }

    render() {
        return (
            // <View>
            //     <Text>This is the recipes screen</Text>
            //     <Picker
            //         selectedValue={this.state.language}
            //         style={{ height: 50, width: 100 }}
            // onValueChange={(itemValue, itemIndex) =>
            //     this.setState({ language: itemValue })
            // }>
            // <Picker.Item label="Java" value="java" />
            // <Picker.Item label="JavaScript" value="js" />
            // <Picker.Item label="C#" value="c#" />
            // <Picker.Item label="C++" value="c++" />
            //     </Picker>
            // </View>
            <Container>
                <Content>
                    <Text>{this.props.navigation.state.params.foodInHouse.length}</Text>
                    <Form>
                        <Picker
                            note
                            mode="dropdown"
                            style={{ width: 120 }}
                            selectedValue={this.state.language}
                            onValueChange={(itemValue, itemIndex) =>
                                this.setState({ language: itemValue })
                            }
                        >
                            <Picker.Item label="Java" value="java" />
                            <Picker.Item label="JavaScript" value="js" />
                            <Picker.Item label="C#" value="c#" />
                            <Picker.Item label="C++" value="c++" />
                        </Picker>

                        <Picker
                            prompt="How often do you exercise?"
                            mode="dropdown"
                            selectedValue={this.state.exerciseState}
                            onValueChange={(routine) =>
                                this.setState({ exerciseState: routine })
                            }>
                            <Picker.Item label="Sedentary" value="sedentary" />
                            <Picker.Item label="Light" value="light" />
                            <Picker.Item label="Moderate" value="moderate" />
                            <Picker.Item label="Active" value="active" />
                            <Picker.Item label="Very active" value="very active" />
                        </Picker>
                    </Form>
                </Content>
            </Container>
        );
    }
}