import React from 'react';
import {PropTypes} from 'prop-types';
import {View, Text} from 'react-native';
import {useSelector} from 'react-redux';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import {Animated, AnimatedNumber} from './animated';
import {dieRoller, STATE_CRITICAL_SUCCESS, STATE_CRITICAL_FAILURE, TYPE_LEGEND, TYPE_LUCK} from '../lib/DieRoller';
import {statistics} from '../lib/Statistics';
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

const statBlockFormatter = percentage => {
    if (isNaN(percentage)) {
        return '0.0';
    } else if (percentage < 0.0) {
        return `▼${percentage.toFixed(1).substring(1)}%`;
    } else {
        return `▲${percentage.toFixed(1)}%`;
    }
};

const getRollPercentageColor = percentage => {
    return percentage < 0.0 ? '#B5374F' : '#61B33E';
};

const getTotal = (roll, pips, modifier, rollStyle) => {
    let total = 0;

    switch (rollStyle) {
        case TYPE_LEGEND:
            total = getTotalSuccesses(roll);
            break;
        case TYPE_LUCK:
            total = getTotalLuck(roll);
            break;
        default:
            total = getClassicTotal(roll, pips, modifier);
    }

    return total;
};

const getClassicTotal = (roll, pips, modifier) => {
    const totalWithModifier = dieRoller.getClassicTotal(roll, pips) + modifier;

    return totalWithModifier < 0 ? 0 : totalWithModifier;
};

const getTotalSuccesses = roll => {
    return dieRoller.getTotalSuccesses(roll);
};

const getTotalLuck = roll => {
    return dieRoller.getTotalLuck(roll);
};

const getResultColor = roll => {
    let color = styles.grey.color;

    if (roll.status === STATE_CRITICAL_SUCCESS) {
        color = '#61B33E';
    } else if (roll.status === STATE_CRITICAL_FAILURE) {
        color = '#B5374F';
    }

    return color;
};

export const RollTotal = ({roll, pips, modifier, rollStyle}) => {
    const showAnimations = useSelector(state => state.settings.animations);

    const percentage = statistics.getPercentage(roll, pips);

    const _renderResult = () => {
        return (
            <View flexDirection="row" style={{justifyContent: 'flex-end'}}>
                <Text style={[localStyles.rollResult, {alignSelf: 'center', color: getResultColor(roll)}]}>
                    <AnimatedNumber
                        animationProps={{
                            end: getTotal(roll, pips, modifier, rollStyle),
                        }}
                    />
                </Text>
                <Animated animationProps={{from: {opacity: 0, translateX: 150}, animate: {opacity: 1, translateX: 0}}}>
                    <View>
                        <Text
                            style={{
                                color: getRollPercentageColor(percentage),
                                fontSize: verticalScale(30),
                                lineHeight: verticalScale(31),
                            }}>
                            <AnimatedNumber
                                animationProps={{
                                    end: showAnimations ? percentage : statBlockFormatter(percentage),
                                }}
                                formatter={val => statBlockFormatter(val)}
                            />
                        </Text>
                        <View>{_renderCriticalStats(roll)}</View>
                    </View>
                </Animated>
            </View>
        );
    };

    const _renderCriticalStats = () => {
        if (roll.status === STATE_CRITICAL_SUCCESS) {
            let bonusDiceStats = dieRoller.getBonusPoints(roll);

            let bonusDieStat = (
                <Text style={styles.textSmall}>
                    {bonusDiceStats} point{bonusDiceStats > 1 ? 's' : ''} added from bonus dice!
                </Text>
            );

            if (rollStyle === TYPE_LEGEND) {
                bonusDiceStats = dieRoller.getBonusSuccesses(roll);

                bonusDieStat = (
                    <Text style={styles.textSmall}>
                        {bonusDiceStats} success{bonusDiceStats > 1 ? 'es' : ''} added from bonus dice!
                    </Text>
                );
            } else if (rollStyle === TYPE_LUCK) {
                bonusDiceStats = dieRoller.getBonusLuck(roll);

                bonusDieStat = (
                    <Text style={styles.textSmall}>
                        {bonusDiceStats} luck point{bonusDiceStats !== 1 ? 's' : ''} added from bonus dice!
                    </Text>
                );
            }

            return (
                <View>
                    <Text style={styles.textSmall}>Critical Success!</Text>
                    <Text style={styles.textSmall}>
                        {roll.bonusRolls.length} bonus {roll.bonusRolls.length > 1 ? 'dice were' : 'die was'} rolled!
                    </Text>
                    {bonusDieStat}
                </View>
            );
        } else if (roll.status === STATE_CRITICAL_FAILURE) {
            return (
                <View>
                    <Text style={styles.textSmall}>Critical Failure!</Text>
                    <Text style={styles.textSmall}>{roll.penaltyRoll + 1} points were subtracted.</Text>
                </View>
            );
        }

        return null;
    };

    return _renderResult(roll);
};

RollTotal.propTypes = {
    roll: PropTypes.object.isRequired,
    pips: PropTypes.number.isRequired,
    modifier: PropTypes.number.isRequired,
    rollStyle: PropTypes.number.isRequired,
};

const localStyles = ScaledSheet.create({
    rollResult: {
        fontFamily: 'Raleway-Bold',
        fontWeight: 'bold',
        fontSize: '95@vs',
        lineHeight: '96@vs',
    },
});
