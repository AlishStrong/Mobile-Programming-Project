import React from 'react';
import { WebView } from 'react-native';

export default class RecipesScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
          title: navigation.getParam('recipe').label,
        };
      };

    render() {
        return (
            <WebView
                source={{uri: this.props.navigation.state.params.recipe.url}}
            />
        );
    }
}