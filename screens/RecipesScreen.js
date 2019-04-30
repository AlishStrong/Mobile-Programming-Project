import React from 'react';

import { Container, Content, ListItem, List, Body, Text, Left, Right, Thumbnail, Button, Separator } from "native-base";

import firebase from 'firebase';

const currentDate = new Date();

//Recipes must be put as states and loaded when ComponentWillMount!
export default class RecipesScreen extends React.Component {
    static navigationOptions = { title: 'Recipes', };

    state = {
        foodInHouse: [],
        recipesFromSoonExpiringFood: [],
        recipesFromAllFood: []
    }

    componentWillMount = () => {
        var foodInHouse = this.props.navigation.state.params.foodInHouse;
        var foodDataRef = firebase.database().ref('food/-Lcl-q_2hhXlMfvnksoJ').on("value", (snapshot) => foodInHouse = snapshot.val());
        this.setState({foodInHouse});
        if (foodInHouse !== null && foodInHouse.length > 0) {
            var safeToEatFood = [];
            var soonToExpireFood = [];
            foodInHouse.map((food) => {
                var ed = food.expiration;
                var productExpiration = new Date(ed[2], (ed[1] - 1), ed[0]);
                var dayDifference = Math.round((productExpiration - currentDate) / (1000 * 60 * 60 * 24));
                if (dayDifference >= 0) {
                    var foodToAdd = food.name.replace(' ', '-');
                    if (dayDifference < 7) {
                        soonToExpireFood.push(foodToAdd);
                    }
                    safeToEatFood.push(foodToAdd);
                }
            });

            var dietaryWishes = this.props.navigation.state.params.profileData.allergy.map((item) => '&health=' + item);
            if (dietaryWishes.length > 0) {
                dietaryWishes = dietaryWishes.join('');
            } else {
                dietaryWishes = '';
            }
            // var foodParameter = foodNames.join(',');
            var caloriesPerMeal = Math.round(this.props.navigation.state.params.dailyIntake/3);

            //Fetch recipes for SoonToExpireFood
            if (soonToExpireFood.length > 0) {
                fetch("https://api.edamam.com/search?q=" + soonToExpireFood.join(',') + "&app_id=f018ad23&app_key=0a66737cc38dbfd7f47e53f79429b4f3" + dietaryWishes + "&to=3&calories=" + caloriesPerMeal)
                .then(response => response.json())
                .then((data) => {
                    recipes = data.hits;
                    this.setState({recipesFromSoonExpiringFood: recipes});
                })
                .catch((error) => console.log(error));
            }

            //Fetch recipes for SafeToEatFood
            if (safeToEatFood.length > 0) {
                fetch("https://api.edamam.com/search?q=" + safeToEatFood.join(',') + "&app_id=f018ad23&app_key=0a66737cc38dbfd7f47e53f79429b4f3" + dietaryWishes + "&to=5&calories=" + caloriesPerMeal)
                .then(response => response.json())
                .then((data) => {
                    recipes = data.hits;
                    this.setState({recipesFromAllFood: recipes});
                })
                .catch((error) => console.log(error));
            }
        }
    }

    renderRecipe = (item) => {
        const {navigate} = this.props.navigation;
        return (
            <ListItem thumbnail>
                <Left>
                    <Thumbnail square source={{ uri: item.recipe.image }} />
                </Left>
                    <Body>
                        <Text>{item.recipe.label}</Text>
                        <Text note numberOfLines={1}>Calories per serving: {item.recipe.calories / item.recipe.yield}</Text>
                    </Body>
                <Right>
                    <Button transparent onPress={() => navigate('RecipeDetailRT', {recipe: item.recipe})}>
                        <Text>View</Text>
                    </Button>
                </Right>
            </ListItem>
        );
    }

    renderRecipeLists = (foodDataArray) => {
        var toReturn = []
        if (foodDataArray !== 0 && foodDataArray.length > 0) {

            if (this.state.recipesFromSoonExpiringFood.length > 0) {
                    toReturn.push(
                        <Content key={"Don't waste the food!"}>
                            <Separator bordered style={{ backgroundColor: "#ffc107" }}>
                                <Text style={{ color: '#ffffff', fontSize: 16 }}>Don't waste the food!</Text>
                            </Separator>
                            <List dataArray={this.state.recipesFromSoonExpiringFood} renderRow={(item) => this.renderRecipe(item)}></List>
                        </Content>
                    );
            }

            if (this.state.recipesFromAllFood.length > 0) {
                    toReturn.push(
                        <Content key={"Try these out!"}>
                            <Separator bordered style={{ backgroundColor: "#28a745" }}>
                                <Text style={{ color: '#ffffff', fontSize: 16 }}>Try these out!</Text>
                            </Separator>
                            <List dataArray={this.state.recipesFromAllFood} renderRow={(item) => this.renderRecipe(item)}></List>
                        </Content>
                    );
            }

        } else {
            toReturn.push(<Text>There is no food in household for suggestion</Text>);
        }
        return toReturn;
    }

    render() {
        return (
            <Container>
                <Content>
                    {this.renderRecipeLists(this.state.foodInHouse)}
                </Content>
            </Container>
        );
    }
}