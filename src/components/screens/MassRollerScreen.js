import React, { Component }  from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { BackHandler, Platform, StyleSheet, ScrollView, View, TouchableHighlight, Switch } from 'react-native';
import { Container, Content, Button, Text, Picker, Item} from 'native-base';
import RNShake from 'react-native-shake';
import * as Animatable from 'react-native-animatable';
import Header from '../Header';
import Heading from '../Heading';
import LogoButton from '../LogoButton';
import Slider from '../DieSlider';
import {
    dieRoller,
    STATE_NORMAL,
    STATE_CRITICAL_SUCCESS,
    STATE_CRITICAL_FAILURE,
    LEGEND_SUCCESS_THRESHOLD
} from '../../lib/DieRoller';
import { statistics } from '../../lib/Statistics';
import { updateMassRoller, setSetting } from '../../../reducer';
import styles from '../../Styles';

class DieRollerScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        dice: PropTypes.number.isRequired,
        pips: PropTypes.number.isRequired,
        rolls: PropTypes.number.isRequired,
        isLegend: PropTypes.bool.isRequired,
        updateMassRoller: PropTypes.func.isRequired,
        setSetting: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            dice: props.dice,
            pips: props.pips,
            rolls: props.rolls,
            result: []
        };

        this.roll = this._roll.bind(this);
        this.updateDice = this._updateDice.bind(this);
        this.updateRolls = this._updateRolls.bind(this);
        this.updatePips = this._updatePips.bind(this);
    }

    componentDidMount() {
        RNShake.addEventListener('ShakeEvent', () => {
            this.roll();
        });

        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.navigate('Home');

            return true;
        });
    }

 	componentWillUnmount() {
   		RNShake.removeEventListener('ShakeEvent');

   		this.backHandler.remove();
   	}

	_roll() {
        let newState = {...this.state};
        newState.result = [];

        for (let i = 0; i < this.props.rolls; i++) {
            newState.result.push(dieRoller.roll(this.props.dice));
        }

        this.setState(newState);
	}

    _updateDice(value) {
        this.props.updateMassRoller(this.props.rolls, value, this.props.pips);
    }

    _updateRolls(value) {
        this.props.updateMassRoller(value, this.props.dice, this.props.pips);
    }

    _updatePips(value) {
        this.props.updateMassRoller(this.props.rolls, this.props.dice, value);
    }

    _getTotal(result) {
        return this.props.isLegend ? this._getTotalSuccesses(result) : this._getClassicTotal(result);
    }

    _getClassicTotal(result) {
        return dieRoller.getClassicTotal(result, this.props.pips);
    }

    _getTotalSuccesses(result) {
        return dieRoller.getTotalSuccesses(result);
    }

    _getResultColor(result) {
        let color = '#4f4e4e';

        if (result.status === STATE_CRITICAL_SUCCESS) {
            color = '#61B33E';
        } else if (result.status === STATE_CRITICAL_FAILURE) {
            color = '#B5374F';
        }

        return color;
    }

    _renderRollButtonLabel() {
        let label = 'Roll'

        if (this.state.result.length === 0) {
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
                <Text>
                {this.state.result.map((result, index) => {
                    return (
                        <Text
                            key={'roll-' + index}
                            style={[styles.grey, localStyles.rollResult, {color: this._getResultColor(result)}]}
                        >
                            {this._getTotal(result)}
                            {(index + 1 === this.state.result.length) ? '' : ', '}
                        </Text>
                    );
                })}
                </Text>
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
                    style={styles.picker}
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
                <Heading text='Mass Roller' onBackButtonPress={() => this.props.navigation.navigate('Home')} />
                <View style={styles.contentPadded}>
                    {this._renderResult()}
                    <View>
                        <Slider
                            label='Dice:'
                            value={parseInt(this.props.dice, 10)}
                            step={1}
                            min={1}
                            max={60}
                            onValueChange={this.updateDice}
                            disabled={false}
                        />
                    </View>
                    {this._renderPipsPicker()}
                    <View>
                        <Slider
                            label='Rolls:'
                            value={parseInt(this.props.rolls, 10)}
                            step={1}
                            min={1}
                            max={20}
                            onValueChange={this.updateRolls}
                            disabled={false}
                        />
                    </View>
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
                    <LogoButton label={this._renderRollButtonLabel()} onPress={() => this.roll()} />
                </View>
                <View style={{paddingBottom: 20}} />
            </Content>
	      </Container>
		);
	}
}

const localStyles = StyleSheet.create({
	rollResult: {
		fontSize: 70,
		fontWeight: 'bold'
	}
})

const mapStateToProps = state => {
    return {
        dice: state.massRoller.dice,
        rolls: state.massRoller.rolls,
        pips: state.massRoller.pips,
        isLegend: state.settings.isLegend
    };
}

const mapDispatchToProps = {
    updateMassRoller,
    setSetting
}

export default connect(mapStateToProps, mapDispatchToProps)(DieRollerScreen);