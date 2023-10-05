import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, TouchableHighlight} from 'react-native';
import {Text, List, ListItem, Right, Body} from 'native-base';
import styles from '../../Styles';
import Heading from '../Heading';
import {character} from '../../lib/Character';

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

export default class Specializations extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        character: PropTypes.object.isRequired,
        updateRoller: PropTypes.func.isRequired,
    };

    _rollSpecializationDice(specialization) {
        let attribute = character.getAttributeBySkill(specialization.skillName, this.props.character.attributes);
        let attributeDieCode = character.getDieCode(this.props.character, attribute.name);
        let specializationDieCode = {
            dice: specialization.dice,
            modifierDice: 0,
            pips: specialization.pips,
            modifierPips: 0,
        };

        this._rollSkillDice(attributeDieCode, specializationDieCode);
    }

    _rollSkillDice(attributeDieCode, skillDieCode) {
        let combinedDieCodes = {
            dice: parseInt(attributeDieCode.dice, 10) + parseInt(skillDieCode.dice, 10),
            modifierDice: parseInt(attributeDieCode.modifierDice, 10) + parseInt(skillDieCode.modifierDice, 10),
            pips: parseInt(attributeDieCode.pips, 10) + parseInt(skillDieCode.pips, 10),
            modifierPips: parseInt(attributeDieCode.modifierPips, 10) + parseInt(skillDieCode.modifierPips, 10),
        };

        let totalDieCode = character.getTotalDieCode(combinedDieCodes);

        if (totalDieCode.dice >= 1) {
            this.props.updateRoller(totalDieCode.dice, totalDieCode.pips);
            this.props.navigation.navigate('DieRoller');
        }
    }

    render() {
        if (this.props.character.specializations.length === 0) {
            return (
                <View>
                    <Heading text="Specializations" onAddButtonPress={() => this.props.navigation.navigate('Specialization', {specialization: null})} />
                    <List>
                        <ListItem key={'specialization-none'} noIndent>
                            <Body>
                                <Text style={styles.grey}>None</Text>
                            </Body>
                        </ListItem>
                    </List>
                </View>
            );
        }

        return (
            <View>
                <Heading text="Specializations" onAddButtonPress={() => this.props.navigation.navigate('Specialization', {specialization: null})} />
                <List>
                    {this.props.character.specializations.map((specialization, index) => {
                        return (
                            <ListItem key={'specialization-' + index} noIndent>
                                <Body>
                                    <TouchableHighlight
                                        underlayColor="#ffffff"
                                        onPress={() => this.props.navigation.navigate('Specialization', {specialization: specialization})}>
                                        <View style={{paddingTop: 10, paddingBottom: 10}}>
                                            <Text style={[styles.grey, styles.big]}>{specialization.skillName + ': ' + specialization.name}</Text>
                                        </View>
                                    </TouchableHighlight>
                                </Body>
                                <Right>
                                    <TouchableHighlight underlayColor="#ffffff" onPress={() => this._rollSpecializationDice(specialization)}>
                                        <View style={{paddingLeft: 20, paddingTop: 10, paddingBottom: 10}}>
                                            <Text style={[styles.grey, {lineHeight: 30}]}>
                                                {specialization.dice + 'D' + (specialization.pips > 0 ? '+' + specialization.pips : '')}
                                            </Text>
                                        </View>
                                    </TouchableHighlight>
                                </Right>
                            </ListItem>
                        );
                    })}
                </List>
            </View>
        );
    }
}
