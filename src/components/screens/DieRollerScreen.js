import React, { Component }  from 'react';
import { Platform, StyleSheet, ScrollView, View, TouchableHighlight } from 'react-native';
import { Container, Content, Button, Text, Picker, Item} from 'native-base';
import RNShake from 'react-native-shake';
import Header from '../Header';
import Slider from '../DieSlider';
import {
    dieRoller,
    STATE_NORMAL,
    STATE_CRITICAL_SUCCESS,
    STATE_CRITICAL_FAILURE
} from '../../lib/DieRoller';
import styles from '../../Styles';

export default class DieRollerScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dice: 1,
            pips: 0,
            result: null
        };

        this.roll = this._roll.bind(this);
        this.updateDice = this._updateDice.bind(this);
        this.updatePips = this._updatePips.bind(this);
    }

    componentWillMount() {
        RNShake.addEventListener('shake', () => {
            this.roll();
        });
    }

 	componentWillUnmount() {
   		RNShake.removeEventListener('shake');
   	}

	_roll() {
	    let newState = {...this.state};
	    newState.result = dieRoller.roll(this.state.dice);

	    this.setState(newState);
	}

    _updateDice(value) {
        let newState = {...this.state};
        newState.dice = value;

        this.setState(newState);
    }

    _updatePips(value) {
        let newState = {...this.state};
        newState.pips = value;

        this.setState(newState);
    }

    _getTotal() {
        let total = this.state.result.rolls.length > 0 ? this.state.result.rolls.reduce((a, b) => a + b, 0) : 0;

        if (this.state.result.status === STATE_CRITICAL_SUCCESS) {
            total += this.state.result.bonusRolls.reduce((a, b) => a + b, 0) + this.state.result.wildDieRoll;
        } else if (this.state.result.status === STATE_NORMAL) {
            total += this.state.result.wildDieRoll;
        }

        return total + this.state.pips;
    }

    _renderCriticalInfo() {
        if (this.state.result.status === STATE_CRITICAL_SUCCESS) {
            return (
                <Text style={styles.grey}>
                    <Text style={styles.boldGrey}>Bonus Roll(s): </Text>{this.state.result.bonusRolls.join(', ')}
                </Text>
            );
        }

        if (this.state.result.status === STATE_CRITICAL_FAILURE) {
            return (
                <Text style={styles.grey}>
                    <Text style={styles.boldGrey}>Penalty Die: </Text>{this.state.result.penaltyRoll}
                </Text>
            );
        }

        return null;
    }

    _renderRollButtonLabel() {
        let label = 'Roll'

        if (this.state.result === null) {
            return label;
        }

        return label + ' Again'
    }

    _renderResult() {
        if (this.state.result === null) {
            return null;
        }

        return (
            <View>
                <Text style={[styles.grey, localStyles.rollResult]}>{this._getTotal()}</Text>
                <Text style={styles.grey}>
                    <Text style={styles.boldGrey}>Rolls: </Text>{this.state.result.rolls.join(', ')}
                </Text>
                <Text style={styles.grey}>
                    <Text style={styles.boldGrey}>Wild Die: </Text>{this.state.result.wildDieRoll}
                </Text>
                {this._renderCriticalInfo()}
            </View>
        );
    }

	render() {
		return (
		  <Container style={styles.container}>
            <Header navigation={this.props.navigation} />
            <Content style={styles.content}>
                <Text style={styles.heading}>Roller</Text>
                <Slider
                    label='Dice:'
                    value={this.state.dice}
                    step={1}
                    min={1}
                    max={30}
                    onValueChange={this.updateDice}
                    disabled={false}
                />
                <Picker
                  inlinelabel
                  label='Pips'
                  style={styles.grey}
                  textStyle={styles.grey}
                  iosHeader="Select one"
                  mode="dropdown"
                  selectedValue={this.state.pips}
                  onValueChange={(value) => this.updatePips(value)}
                >
                  <Item label="+0 pips" value={0} />
                  <Item label="+1 pip" value={1} />
                  <Item label="+2 pips" value={2} />
                </Picker>
                {this._renderResult()}
                <View style={styles.buttonContainer}>
                    <Button block style={styles.button} onPress={this.roll}>
                        <Text uppercase={false}>{this._renderRollButtonLabel()}</Text>
                    </Button>
                </View>
                <View style={{paddingBottom: 20}} />
            </Content>
	      </Container>
		);
	}
}

const localStyles = StyleSheet.create({
	rollResult: {
		fontSize: 75
	}
});