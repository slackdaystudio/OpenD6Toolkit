import React, {memo} from 'react';
import PropTypes from 'prop-types';
import {useNavigation} from '@react-navigation/native';
import {View, Text} from 'react-native';
import {verticalScale} from 'react-native-size-matters';
import {Die} from './animated';
import {RollTotal} from './RollTotal';
import {DieCode} from './DieCode';
import {STATE_CRITICAL_FAILURE, STATE_CRITICAL_SUCCESS} from '../lib/DieRoller';
import styles from '../Styles';

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

const DICE_ANIMATION_CUTOFF = 20;

export const RollResults = memo(function RollResult({roll, dice, pips, modifier, rollStyle, totalDiceRolled}) {
    const navigation = useNavigation();

    const _renderCriticalInfo = () => {
        if (roll.status === STATE_CRITICAL_SUCCESS) {
            return roll.bonusRolls.map((r, i) => {
                return _renderDie(r, `roll-bonus-${i}-${roll.uuid}`, false, true);
            });
        }

        if (roll.status === STATE_CRITICAL_FAILURE) {
            if (roll.dice > 1) {
                return _renderDie(roll.penaltyRoll, `roll-penalty-${roll.uuid}`, false, true);
            }

            return null;
        }

        return <Text />;
    };

    const _renderDie = (face, key, isWild = false, isBonus = false) => {
        return (
            <Die key={key} face={face} status={roll.status} isWild={isWild} isBonus={isBonus} isAnimationsEnabled={totalDiceRolled <= DICE_ANIMATION_CUTOFF} />
        );
    };

    return (
        <View key={`roll-${Math.random()}`} paddingTop={verticalScale(10)}>
            <View flexDirection="row" style={{minHeight: verticalScale(95)}} alignItems="flex-start">
                <RollTotal roll={roll} pips={pips} modifier={modifier} rollStyle={rollStyle} />
            </View>
            <View>
                <Text style={styles.textSmall}>
                    Rolled{' '}
                    <DieCode navigation={navigation} dice={{dice: dice, pips: pips, rollStyle: rollStyle}} style={[styles.textSmall, {paddingTop: 10}]} />
                    {modifier !== 0 ? (modifier > 0 ? ` with a +${modifier} modifier` : ` with a ${modifier} modifer`) : ''}
                </Text>
            </View>
            <View flexDirection="row" flexWrap="wrap">
                {roll.rolls.map((r, i) => {
                    return _renderDie(r, `roll-${i}-${roll.uuid}`);
                })}
                {_renderDie(roll.wildDieRoll, `roll-wild-die-${roll.uuid}`, true)}
                {_renderCriticalInfo(roll)}
            </View>
        </View>
    );
});

RollResults.propTypes = {
    roll: PropTypes.object.isRequired,
    dice: PropTypes.number.isRequired,
    pips: PropTypes.number.isRequired,
    modifier: PropTypes.number.isRequired,
    rollStyle: PropTypes.number.isRequired,
    totalDiceRolled: PropTypes.number.isRequired,
};
