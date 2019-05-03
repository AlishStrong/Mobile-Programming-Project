import React from 'react';
import { Dimensions, View, TextInput } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Modal from "react-native-modal";
import { Container, Content, Text, Button } from "native-base";

import firebase from 'firebase';

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const curDate = new Date();

export default class DiaryScreen extends React.Component {
    static navigationOptions = { title: 'Diary', };

    state = {
        progressData: {},
        showModal: false,
        caloriesState: 0.0,
        weightState: 0.0
    }

    componentWillMount = () => {
        var progressData = this.props.navigation.state.params.progressData;
        var progressDataRef = firebase.database().ref('progress/-Lcl-q_2hhXlMfvnksoJ').on("value", (snapshot) => progressData = snapshot.val());
        this.setState({ progressData });
    }

    dataForWeightChart = () => {
        var progressData = this.state.progressData;
        var recordDates = Object.keys(progressData).map((date) => {
            var dateArray = date.split("-");
            return (monthNames[dateArray[1] - 1] + ", " + dateArray[0]);
        });
        var recordWeights = Object.values(progressData).map(data => data.weight);
        var weightChartData = {
            labels: recordDates,
            datasets: [{
                data: recordWeights
            }]
        };
        return weightChartData;
    }

    dataForCalorieChart = () => {
        var progressData = this.state.progressData;
        var recordDates = Object.keys(progressData).map((date) => {
            var dateArray = date.split("-");
            return (monthNames[dateArray[1] - 1] + ", " + dateArray[0]);
        });
        var recordCalories = Object.values(progressData).map(data => data.calories);
        var caloryChartData = {
            labels: recordDates,
            datasets: [{
                data: recordCalories
            }]
        };
        return caloryChartData;
    }

    saveNewRecord = () => {
        var pushDate = curDate.getDate() + "-" + (curDate.getMonth() + 1) + "-" + curDate.getFullYear();
        var dbReference = firebase.database().ref('progress/-Lcl-q_2hhXlMfvnksoJ/' + pushDate);
        dbReference.once("value").then((snap) => {
            presence = snap.exists();
            if (presence) {
                dbReference.update({
                    calories: this.state.caloriesState,
                    weight: this.state.weightState
                });
            } else {
                dbReference.set({
                    calories: this.state.caloriesState,
                    weight: this.state.weightState
                });
            }
        });
        var prstate = this.state.progressData;
        prstate[pushDate] = {
            calories: this.state.caloriesState,
            weight: this.state.weightState
        };
        this.setState({ 
            progressData: prstate,
            showModal: false
        });
    }

    render() {
        return (
            <Container>
                <Content>
                    {/* Weight chart */}
                    <Text style={{ marginTop: 16 }}>Weight measurements</Text>
                    <LineChart
                        data={this.dataForWeightChart()}
                        width={Dimensions.get('window').width} // from react-native
                        height={180}
                        yAxisLabel={'kg '}
                        chartConfig={{
                            backgroundGradientFrom: '#28a745',
                            backgroundGradientTo: '#2cc26b',
                            decimalPlaces: 1,
                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`
                        }}
                        style={{
                            marginVertical: 8
                        }}
                    />

                    {/* Calorie chart */}
                    <Text style={{ marginTop: 16 }}>Calories chart</Text>
                    <LineChart
                        data={this.dataForCalorieChart()}
                        width={Dimensions.get('window').width} // from react-native
                        height={180}
                        chartConfig={{
                            backgroundGradientFrom: '#fb8c00',
                            backgroundGradientTo: '#ffa726',
                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`
                        }}
                        style={{
                            marginVertical: 8
                        }}
                    />

                    <Button full onPress={() => this.setState({showModal: true})}>
                        <Text>Write new record</Text>
                    </Button>

                    {/* Modal for new record */}
                    <Modal isVisible={this.state.showModal}>
                        <View style={{
                            flexDirection: "column",
                            backgroundColor: "white",
                            padding: 22,
                            justifyContent: "center",
                            alignItems: 'stretch',
                            borderRadius: 4,
                            borderColor: "rgba(0, 0, 0, 0.1)"
                        }}>

                            {/* Title of the modal */}
                            <Text style={{
                                fontWeight: "bold",
                                fontSize: 20,
                                marginBottom: 10
                            }}
                            >
                                Add a new record
                            </Text>

                            {/* Prompt for weight */}
                            <View style={{ flexDirection: "column", marginBottom: 10 }}>
                                <Text style={{ fontWeight: "bold" }}>Weight:</Text>
                                <TextInput style={{
                                    fontSize: 16,
                                    color: "#494949",
                                    borderWidth: 2,
                                    borderColor: "#dfdfdf",
                                    borderRadius: 6,
                                    paddingLeft: 5
                                }}
                                    keyboardType={"numeric"}
                                    value={this.state.weightState}
                                    onChangeText={(newWeight) => {
                                        this.setState({ weightState: newWeight });
                                    }}
                                />
                            </View>

                            {/* Prompt for calories */}
                            <View style={{ flexDirection: "column", marginBottom: 10 }}>
                                <Text style={{ fontWeight: "bold" }}>Calories:</Text>
                                <TextInput style={{
                                    fontSize: 16,
                                    color: "#494949",
                                    borderWidth: 2,
                                    borderColor: "#dfdfdf",
                                    borderRadius: 6,
                                    paddingLeft: 5
                                }}
                                    keyboardType={"numeric"}
                                    value={this.state.caloriesState}
                                    onChangeText={(newCalories) => {
                                        this.setState({ caloriesState: newCalories })
                                    }}
                                />
                            </View>

                            {/* Action buttons */}
                            <View style={{ flexDirection: "column", alignItems: 'center', marginTop: 5 }}>
                                <View style={{ flexDirection: "row" }}>
                                    <Button success onPress={() => this.saveNewRecord()}
                                        style={{ marginRight: "10%" }} >
                                        <Text style={{}}>
                                            Save
                                        </Text>
                                    </Button>
                                    <Button warning onPress={() => this.setState({ showModal: false })}
                                        style={{}} >
                                        <Text style={{}}>
                                            Cancel
                                        </Text>
                                    </Button>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </Content>
            </Container>
        );
    }
}
