import React from 'react';
import { StyleSheet, AsyncStorage } from 'react-native';
import { Container, Content, Button, Text } from 'native-base';

export default class HomeScreen extends React.Component {
    static navigationOptions = { title: 'Home', };

    state = {
        loaded: false,
        testState: 'Alisher Aliev'
    }

    componentWillMount = () => {
        this.setState({ loaded: true });
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <Container>
                <Content>
                    <Text style={styles.headerStyle}>This is the home screen</Text>
                    <Button disabled={!this.state.loaded}
                        style={styles.buttonStyle} block success
                        onPress={() => navigate('ProfileRT')} >
                        <Text>Profile</Text>
                    </Button>
                    <Button disabled={!this.state.loaded}
                        style={styles.buttonStyle} block info
                        onPress={() => navigate('MyFoodRT')} >
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