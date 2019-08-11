import React, { Component }  from 'react';
import { BackHandler, StyleSheet, View, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Container, Content, Text, List, ListItem, Left, Right, Spinner, Tabs, Tab, ScrollableTab } from 'native-base';
import Header from '../Header';
import Heading from '../Heading';
import LogoButton from '../LogoButton';
import ConfirmationDialog from '../ConfirmationDialog';
import { statistics, CONTEXTUALLY_INFINITE } from '../../lib/Statistics';
import { chart } from '../../lib/Chart';
import styles from '../../Styles';

export default class StatisticsScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            stats: null,
            confirmationDialog: {
                visible: false,
                title: 'Clear Statistics',
                info: 'This is permanent, are you certain you want to clear your die statistics?',
            }
        }

        this.onOk = this._onClearConfirm.bind(this);
        this.onClose = this._onConfirmationClose.bind(this);
    }

    componentDidMount() {
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            this._loadStats();
        });

        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.navigate('Home');

            return true;
        });
    }

    componentWillUnmount() {
        this.backHandler.remove();
        this.focusListener.remove();
    }

    _loadStats(callback) {
        AsyncStorage.getItem('statistics').then((statistics) => {
            let newState = {...this.state};
            newState.stats = JSON.parse(statistics);

            this.setState(newState, () => {
                if (typeof callback === 'function') {
                    callback();
                }
            });
        });
    }

    _clearStats() {
        let newState = {...this.state};
        newState.confirmationDialog.visible = true;

        this.setState(newState);
    }

    _onClearConfirm() {
        statistics.init().then(() => {
            this._loadStats(this.onClose);
        });
    }

    _onConfirmationClose() {
        let newState = {...this.state};
        newState.confirmationDialog.visible = false;

        this.setState(newState);
    }

    _renderAverageRoll() {
        if (this.state.stats.diceRolled === 0) {
            return <Text style={styles.grey}>-</Text>;
        }

        return (
            <Text style={styles.grey}>
                {(this.state.stats.sum / this.state.stats.diceRolled).toFixed(1)}
            </Text>
        );
    }

    _renderDieDistributionChart() {
        if (this.state.stats.sum === 0) {
            return null;
        }

        return chart.renderDieDistributionChart(this.state.stats.distributions);
    }

	render() {
        if (this.state.stats === null) {
            return (
                <Container style={styles.container}>
                    <Header hasTabs={false} navigation={this.props.navigation} />
                    <Content style={styles.content}>
                        <Spinner />
                    </Content>
                </Container>
            );
        }

		return (
		  <Container style={styles.container}>
			<Header navigation={this.props.navigation} />
	        <Content style={styles.content}>
	            <Heading text='General Statistics' onBackButtonPress={() => this.props.navigation.navigate('Home')} />
                {this._renderDieDistributionChart()}
                <List>
                    <ListItem>
                      <Left>
                        <Text style={styles.boldGrey}>Total Dice Rolled:</Text>
                      </Left>
                      <Right>
                        <Text style={styles.grey}>{this.state.stats.diceRolled}</Text>
                      </Right>
                    </ListItem>
                    <ListItem>
                      <Left>
                        <Text style={styles.boldGrey}>Total Face Value:</Text>
                      </Left>
                      <Right>
                        <Text style={styles.grey}>{this.state.stats.sum}</Text>
                      </Right>
                    </ListItem>
                    <ListItem>
                      <Left>
                        <Text style={styles.boldGrey}>Largest Amount of Dice Rolled:</Text>
                      </Left>
                      <Right>
                        <Text style={styles.grey}>{this.state.stats.largestDieRoll}</Text>
                      </Right>
                    </ListItem>
                    <ListItem>
                      <Left>
                        <Text style={styles.boldGrey}>Largest Roll:</Text>
                      </Left>
                      <Right>
                        <Text style={styles.grey}>{this.state.stats.largestSum}</Text>
                      </Right>
                    </ListItem>
                    <ListItem>
                      <Left>
                        <Text style={styles.boldGrey}>Average Roll:</Text>
                      </Left>
                      <Right>
                        {this._renderAverageRoll()}
                      </Right>
                    </ListItem>
                </List>
                <Heading text='Critical Success Statistics' />
                <List>
                    <ListItem>
                      <Left>
                        <Text style={styles.boldGrey}>Total Critical Successes:</Text>
                      </Left>
                      <Right>
                        <Text style={styles.grey}>{this.state.stats.criticalSuccesses}</Text>
                      </Right>
                    </ListItem>
                    <ListItem>
                      <Left>
                        <Text style={styles.boldGrey}>Bonus Dice Rolled:</Text>
                      </Left>
                      <Right>
                        <Text style={styles.grey}>{this.state.stats.bonusDiceRolled}</Text>
                      </Right>
                    </ListItem>
                    <ListItem>
                      <Left>
                        <Text style={styles.boldGrey}>Bonus Dice Total:</Text>
                      </Left>
                      <Right>
                        <Text style={styles.grey}>{this.state.stats.bonusDiceTotal}</Text>
                      </Right>
                    </ListItem>
                    <ListItem>
                      <Left>
                        <Text style={styles.boldGrey}>Largest Bonus Dice Total:</Text>
                      </Left>
                      <Right>
                        <Text style={styles.grey}>{this.state.stats.largestCriticalSuccess}</Text>
                      </Right>
                    </ListItem>
                    <ListItem>
                      <Left>
                        <Text style={styles.boldGrey}>Lowest Bonus Dice Total:</Text>
                      </Left>
                      <Right>
                        <Text style={styles.grey}>{this.state.stats.lowestCriticalSuccess === CONTEXTUALLY_INFINITE ? '-' : this.state.stats.lowestCriticalSuccess}</Text>
                      </Right>
                    </ListItem>
                </List>
                <Heading text='Critical Failure Statistics' />
                <List>
                    <ListItem>
                      <Left>
                        <Text style={styles.boldGrey}>Total Critical Failures:</Text>
                      </Left>
                      <Right>
                        <Text style={styles.grey}>{this.state.stats.criticalFailures}</Text>
                      </Right>
                    </ListItem>
                    <ListItem>
                      <Left>
                        <Text style={styles.boldGrey}>Penalty Dice Rolled:</Text>
                      </Left>
                      <Right>
                        <Text style={styles.grey}>{this.state.stats.penaltyDiceRolled}</Text>
                      </Right>
                    </ListItem>
                    <ListItem>
                      <Left>
                        <Text style={styles.boldGrey}>Penalty Dice Total:</Text>
                      </Left>
                      <Right>
                        <Text style={styles.grey}>{this.state.stats.penaltyDiceTotal}</Text>
                      </Right>
                    </ListItem>
                    <ListItem>
                      <Left>
                        <Text style={styles.boldGrey}>Largest Penalty Dice Total:</Text>
                      </Left>
                      <Right>
                        <Text style={styles.grey}>{this.state.stats.largestCriticalFailure}</Text>
                      </Right>
                    </ListItem>
                    <ListItem>
                      <Left>
                        <Text style={styles.boldGrey}>Lowest Penalty Dice Total:</Text>
                      </Left>
                      <Right>
                        <Text style={styles.grey}>{this.state.stats.lowestCriticalFailure === CONTEXTUALLY_INFINITE ? '-' : this.state.stats.lowestCriticalFailure}</Text>
                      </Right>
                    </ListItem>
                </List>
                <View style={{paddingBottom: 20}} />
                <LogoButton label={'Clear'} onPress={() => this._clearStats()} />
                <View style={{paddingBottom: 20}} />
                <ConfirmationDialog
                    visible={this.state.confirmationDialog.visible}
                    title={this.state.confirmationDialog.title}
                    info={this.state.confirmationDialog.info}
                    onOk={this.onOk}
                    onClose={this.onClose}
                />
	        </Content>
	      </Container>
		);
	}
}
