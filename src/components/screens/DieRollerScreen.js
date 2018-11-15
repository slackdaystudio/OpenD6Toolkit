import React, { Component }  from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { Platform, StyleSheet, ScrollView, View, TouchableHighlight, Switch } from 'react-native';
import { Container, Content, Button, Text, Picker, Item} from 'native-base';
import RNShake from 'react-native-shake';
import Header from '../Header';
import Heading from '../Heading';
import Slider from '../DieSlider';
import {
    dieRoller,
    STATE_NORMAL,
    STATE_CRITICAL_SUCCESS,
    STATE_CRITICAL_FAILURE,
    LEGEND_SUCCESS_THRESHOLD
} from '../../lib/DieRoller';
import { updateRoller, setSetting } from '../../../reducer';
import styles from '../../Styles';

class DieRollerScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        dice: PropTypes.number.isRequired,
        pips: PropTypes.number.isRequired,
        isLegend: PropTypes.bool.isRequired,
        updateRoller: PropTypes.func.isRequired,
        setSetting: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            dice: props.dice,
            pips: props.pips,
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
	    newState.result = dieRoller.roll(this.props.dice);

	    this.setState(newState);
	}

    _updateDice(value) {
        this.props.updateRoller(value, this.props.pips);
    }

    _updatePips(value) {
        this.props.updateRoller(this.props.dice, value);
    }

    _getTotal() {
        return this.props.isLegend ? this._getTotalSuccesses() : this._getClassicTotal();
    }

    _getClassicTotal() {
        let total = this.state.result.rolls.length > 0 ? this.state.result.rolls.reduce((a, b) => a + b, 0) : 0;

        if (this.state.result.status === STATE_CRITICAL_SUCCESS) {
            total += this.state.result.bonusRolls.reduce((a, b) => a + b, 0) + this.state.result.wildDieRoll;
        } else if (this.state.result.status === STATE_NORMAL) {
            total += this.state.result.wildDieRoll;
        }

        return total + this.props.pips;
    }

    _getTotalSuccesses() {
        let totalSuccesses = 0;

        for (let roll of this.state.result.rolls) {
            if (roll > LEGEND_SUCCESS_THRESHOLD) {
                totalSuccesses++;
            }
        }

        if (this.state.result.status === STATE_CRITICAL_SUCCESS) {
            for (let bonusRoll of this.state.result.bonusRolls) {
                if (bonusRoll >= LEGEND_SUCCESS_THRESHOLD) {
                    totalSuccesses++;
                }
            }

            totalSuccesses += (this.state.result.wildDieRoll > LEGEND_SUCCESS_THRESHOLD) ? 1 : 0;
        } else if (this.state.result.status === STATE_NORMAL) {
            totalSuccesses += (this.state.result.wildDieRoll > LEGEND_SUCCESS_THRESHOLD) ? 1 : 0;
        }

        return totalSuccesses;
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

        return <Text />;
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

    _renderPipsPicker() {
        if (this.props.isLegend) {
            return null;
        }

        return (
            <View>
                <Picker
                    inlinelabel
                    label='Pips'
                    style={styles.grey}
                    textStyle={styles.grey}
                    iosHeader="Select one"
                    mode="dropdown"
                    selectedValue={this.props.pips}
                    onValueChange={(value) => this.updatePips(value)}
                >
                    <Item label="+0 pips" value={0} />
                    <Item label="+1 pip" value={1} />
                    <Item label="+2 pips" value={2} />
                </Picker>
            </View>
        );
    }

	render() {
		return (
		  <Container style={styles.container}>
            <Header navigation={this.props.navigation} />
            <Content style={styles.content}>
                <Heading text='Roller' />
                <View style={styles.contentPadded}>
                    {this._renderResult()}
                    <View>
                        <Slider
                            label='Dice:'
                            value={parseInt(this.props.dice, 10)}
                            step={1}
                            min={1}
                            max={30}
                            onValueChange={this.updateDice}
                            disabled={false}
                        />
                    </View>
                    {this._renderPipsPicker()}
                    <View style={styles.titleContainer}>
                        <Text style={styles.grey}>Use D6 Legend rules?</Text>
                        <View style={{paddingRight: 10}}>
                            <Switch
                                value={this.props.isLegend}
                                onValueChange={() => this.props.setSetting('isLegend', !this.props.isLegend)}
                                thumbColor='#f57e20'
                                trackColor={{true: '#fde5d2', false: '#4f4e4e'}}
                            />
                        </View>
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button block style={styles.button} onPress={this.roll}>
                            <Text uppercase={false}>{this._renderRollButtonLabel()}</Text>
                        </Button>
                    </View>
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
})

const mapStateToProps = state => {
    return {
        dice: state.roller.dice,
        pips: state.roller.pips,
        isLegend: state.settings.isLegend
    };
}

const mapDispatchToProps = {
    updateRoller,
    setSetting
}

export default connect(mapStateToProps, mapDispatchToProps)(DieRollerScreen);