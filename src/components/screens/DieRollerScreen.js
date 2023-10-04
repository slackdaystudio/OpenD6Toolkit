import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {View} from 'react-native';
import {Container, Content, Text, Picker, Item} from 'native-base';
import {ScaledSheet, scale} from 'react-native-size-matters';
import * as Animatable from 'react-native-animatable';
import Header from '../Header';
import Heading from '../Heading';
import LogoButton from '../LogoButton';
import Slider from '../DieSlider';
import {dieRoller, STATE_CRITICAL_SUCCESS, STATE_CRITICAL_FAILURE, TYPE_LEGEND, TYPE_CLASSIC} from '../../lib/DieRoller';
import {statistics} from '../../lib/Statistics';
import {updateRoller} from '../../reducers/dieRoller';
import styles from '../../Styles';

// Copyright (C) Slack Day Studio - All Rights Reserved
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

class DieRollerScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        dice: PropTypes.number.isRequired,
        pips: PropTypes.number.isRequired,
        isLegend: PropTypes.bool.isRequired,
        updateRoller: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            dice: props.dice,
            pips: props.pips,
            result: null,
        };

        this.roll = this._roll.bind(this);
        this.updateDice = this._updateDice.bind(this);
        this.updatePips = this._updatePips.bind(this);
    }

    componentDidMount() {
        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.setState({result: null});
        });
    }

    componentWillUnmount() {
        this.focusListener.remove();
    }

    handleViewRef = ref => (this.view = ref);

    criticalSuccessAnimation() {
        this.view.shake(2000).then(endState => {});
    }

    criticalFailureAnimation() {
        this.view.bounce(2000).then(endState => {});
    }

    _roll() {
        const result = dieRoller.roll(this.props.dice);

        statistics
            .add(result, this.props.isLegend ? TYPE_LEGEND : TYPE_CLASSIC)
            .then(() => {
                let newState = {...this.state};
                newState.result = result;

                this.setState(newState, () => {
                    if (this.state.result.status === STATE_CRITICAL_SUCCESS) {
                        this.criticalSuccessAnimation();
                    } else if (this.state.result.status === STATE_CRITICAL_FAILURE) {
                        this.criticalFailureAnimation();
                    }
                });
            })
            .catch(error => console.error(error));
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
        return dieRoller.getClassicTotal(this.state.result, this.props.pips);
    }

    _getTotalSuccesses() {
        return dieRoller.getTotalSuccesses(this.state.result);
    }

    _getResultColor() {
        let color = '#4f4e4e';

        if (this.state.result.status === STATE_CRITICAL_SUCCESS) {
            color = '#61B33E';
        } else if (this.state.result.status === STATE_CRITICAL_FAILURE) {
            color = '#B5374F';
        }

        return color;
    }

    _renderCriticalInfo() {
        if (this.state.result.status === STATE_CRITICAL_SUCCESS) {
            return (
                <Text style={styles.grey}>
                    <Text style={styles.boldGrey}>Bonus Roll(s): </Text>
                    {this.state.result.bonusRolls.join(', ')}
                </Text>
            );
        }

        if (this.state.result.status === STATE_CRITICAL_FAILURE) {
            return (
                <Text style={styles.grey}>
                    <Text style={styles.boldGrey}>Penalty Die: </Text>
                    {this.state.result.dice > 1 ? this.state.result.penaltyRoll : ''}
                </Text>
            );
        }

        return <Text />;
    }

    _renderRollButtonLabel() {
        let label = 'Roll';

        if (this.state.result === null) {
            return label;
        }

        return label + ' Again';
    }

    _renderResult() {
        if (this.state.result === null) {
            return null;
        }

        return (
            <View>
                <Animatable.View ref={this.handleViewRef}>
                    <Text style={[styles.grey, localStyles.rollResult, {color: this._getResultColor()}]}>{this._getTotal()}</Text>
                </Animatable.View>
                <Text style={styles.grey}>
                    <Text style={styles.boldGrey}>Rolls: </Text>
                    {this.state.result.dice > 1 ? this.state.result.rolls.join(', ') : ''}
                </Text>
                <Text style={styles.grey}>
                    <Text style={styles.boldGrey}>Wild Die: </Text>
                    {this.state.result.wildDieRoll}
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
                    label="Pips"
                    style={styles.picker}
                    textStyle={{fontSize: scale(12)}}
                    iosHeader="Select one"
                    mode="dropdown"
                    selectedValue={this.props.pips}
                    onValueChange={value => this.updatePips(value)}>
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
                    <Heading text="Roller" onBackButtonPress={() => this.props.navigation.navigate(this.props.route.params.from)} />
                    <View style={styles.contentPadded}>
                        {this._renderResult()}
                        <View>
                            <Slider
                                label="Dice:"
                                value={parseInt(this.props.dice, 10)}
                                step={1}
                                min={1}
                                max={60}
                                onValueChange={this.updateDice}
                                disabled={false}
                            />
                        </View>
                        {this._renderPipsPicker()}
                        <LogoButton label={this._renderRollButtonLabel()} onPress={() => this.roll()} />
                    </View>
                    <View style={{paddingBottom: 20}} />
                </Content>
            </Container>
        );
    }
}

const localStyles = ScaledSheet.create({
    rollResult: {
        fontSize: '90@s',
        fontWeight: 'bold',
    },
});

const mapStateToProps = state => {
    return {
        dice: state.dieRoller.dice,
        pips: state.dieRoller.pips,
        isLegend: state.settings.isLegend,
    };
};

const mapDispatchToProps = {
    updateRoller,
};

export default connect(mapStateToProps, mapDispatchToProps)(DieRollerScreen);
