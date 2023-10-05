import React, {useCallback, useState} from 'react';
import {ActivityIndicator, Text} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Header} from '../Header';
import {StatisticsTab, LABEL_AVERAGE_ROLL, LABEL_LOWEST_PENALTY_DICE_TOTAL} from './Statistics/StatisticsTab';
import {HighScoresTab} from './Statistics/HighScoresTab';
import {CONTEXTUALLY_INFINITE} from '../../lib/Statistics';
import {TYPE_CLASSIC, TYPE_LEGEND} from '../../lib/DieRoller';
import {common} from '../../lib/Common';
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

const getAverageRoll = stats => {
    if (stats.diceRolled === 0) {
        return 0;
    }

    return common.toExponentialNotation(stats.sum / stats.diceRolled, 1);
};

const getTotalRolls = stats => {
    return stats.highScores.reduce((total, score) => total + score.classicRolls + score.legendRolls + score.luckRolls, 0);
};

const getRollsByType = (type, stats) => {
    return stats.highScores.reduce((total, score) => {
        switch (type) {
            case TYPE_CLASSIC:
                return total + score.classicRolls;
            case TYPE_LEGEND:
                return total + score.legendRolls;
            default:
                return total;
        }
    }, 0);
};

const Tab = createMaterialTopTabNavigator();

export const StatisticsScreen = ({navigation}) => {
    const [stats, setStats] = useState(null);

    const [dieCode, setDieCode] = useState();

    const getRecords = useCallback(
        () =>
            stats === null
                ? []
                : [
                      {
                          heading: null,
                          stats: [
                              {label: 'Total Rolls Made', value: getTotalRolls(stats)},
                              {label: '  · Classic', value: getRollsByType(TYPE_CLASSIC, stats)},
                              {label: '  · Successes', value: getRollsByType(TYPE_LEGEND, stats)},
                              {label: 'Total Dice Rolled', value: stats.diceRolled},
                              {label: 'Total Face Value', value: stats.sum},
                              {label: 'Largest Amount of Dice Rolled', value: stats.largestDieRoll},
                              {label: 'Largest Roll', value: stats.largestSum},
                              {
                                  label: LABEL_AVERAGE_ROLL,
                                  value: getAverageRoll(stats),
                              },
                          ],
                      },
                      {
                          heading: 'Crit Successes',
                          stats: [
                              {label: 'Total Critical Successes', value: stats.criticalSuccesses},
                              {label: 'Bonus Dice Rolled', value: stats.bonusDiceRolled},
                              {label: 'Bonus Dice Total', value: stats.bonusDiceTotal},
                              {label: 'Largest Bonus Dice Total', value: stats.largestCriticalSuccess},
                              {
                                  label: 'Lowest Bonus Dice Total',
                                  value: stats.lowestCriticalSuccess === CONTEXTUALLY_INFINITE ? 0 : stats.lowestCriticalSuccess,
                              },
                          ],
                      },
                      {
                          heading: 'Crit Failures',
                          stats: [
                              {label: 'Total Critical Failures', value: stats.criticalFailures},
                              {label: 'Penalty Dice Rolled', value: stats.penaltyDiceRolled},
                              {label: 'Penalty Dice Total', value: stats.penaltyDiceTotal},
                              {label: 'Largest Penatly Dice Total', value: stats.largestCriticalFailure},
                              {
                                  label: LABEL_LOWEST_PENALTY_DICE_TOTAL,
                                  value: stats.lowestCriticalFailure === CONTEXTUALLY_INFINITE ? 0 : stats.lowestCriticalFailure || 0,
                              },
                          ],
                      },
                  ],
        [stats],
    );

    useFocusEffect(
        useCallback(() => {
            _loadStats();

            return () => {};
        }, []),
    );

    const _loadStats = () => {
        AsyncStorage.getItem('statistics')
            .then(s => {
                setStats(JSON.parse(s));
            })
            .catch(error => {
                console.error(error);
            });
    };

    if (stats === null) {
        return (
            <>
                <Header navigation={navigation} />
                <ActivityIndicator color={'#4f4e4e'} />
            </>
        );
    }

    if (stats.diceRolled === 0) {
        return (
            <>
                <Header navigation={navigation} />
                <Text style={[styles.grey, {textAlign: 'center'}]}>You have no rolls on record; go roll some dice!</Text>
            </>
        );
    }

    return (
        <>
            <Header navigation={navigation} />
            <Tab.Navigator
                sceneContainerStyle={{backgroundColor: styles.container.backgroundColor}}
                screenOptions={{
                    tabBarLabelStyle: {color: styles.grey.color},
                    tabBarStyle: {backgroundColor: styles.container.backgroundColor},
                    tabBarIndicatorStyle: {backgroundColor: styles.container.backgroundColor},
                    swipeEnabled: false,
                }}>
                <Tab.Screen options={{animationEnabled: false}} name="Stats">
                    {() => <StatisticsTab records={getRecords()} stats={stats} />}
                </Tab.Screen>
                <Tab.Screen options={{animationEnabled: false}} name="High Scores">
                    {() => <HighScoresTab dieCode={dieCode} stats={stats} setDieCode={setDieCode} />}
                </Tab.Screen>
            </Tab.Navigator>
        </>
    );
};
