import React from 'react';
import {Platform, Text, View} from 'react-native';
import {BarChart} from 'react-native-gifted-charts';
import {scale, verticalScale} from 'react-native-size-matters';
import {VirtualizedList} from '../VirtualizedList';
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

export const HighScoreChart = ({highScores, onPress}) => {
    const barData = highScores
        .sort((a, b) => a.dieCode < b.dieCode)
        .map(hs => {
            return {
                stacks: [
                    {value: hs.classicRolls, color: '#1565C0'},
                    {value: hs.legendRolls, color: '#4527A0'},
                ],
                label: `${hs.dieCode}D`,
                labelTextStyle: styles.grey,
                onPress: () => onPress(hs.dieCode),
            };
        });

    return (
        <VirtualizedList>
            <Text style={[styles.textHeader, {textAlign: 'center', paddingTop: verticalScale(10)}]}>Rolls by Die Code</Text>
            <Text style={[styles.note, {textAlign: 'center', paddingHorizontal: scale(10), paddingBottom: verticalScale(10)}]}>
                Touch a bar to see a detailed breakdown
            </Text>
            <View width={scale(250)} alignSelf="center" alignContent="center">
                <Text style={[styles.chartLegend, {textAlign: 'center'}]}>Legend</Text>
                <View width={scale(250)} flexDirection="row" justifyContent="space-evenly" paddingBottom={verticalScale(10)}>
                    <View flexDirection="row" alignItems="center">
                        <View
                            style={{
                                width: verticalScale(10),
                                height: verticalScale(10),
                                backgroundColor: '#1565C0',
                                marginRight: verticalScale(5),
                            }}
                        />
                        <Text style={styles.textSmall}>Classic</Text>
                    </View>
                    <View flexDirection="row" alignItems="center">
                        <View
                            style={{
                                width: verticalScale(10),
                                height: verticalScale(10),
                                backgroundColor: '#4527A0',
                                marginRight: verticalScale(5),
                            }}
                        />
                        <Text style={styles.textSmall}>Legend</Text>
                    </View>
                </View>
            </View>
            <View
                height={verticalScale((Platform.OS === 'ios' ? 35 : 42) * highScores.length) + verticalScale(75)}
                minHeight={verticalScale(300)}
                paddingHorizontal={scale(10)}
                paddingTop={verticalScale(10)}>
                <BarChart
                    horizontal
                    xAxisColor={styles.grey.color}
                    yAxisColor={styles.grey.color}
                    yAxisTextStyle={{color: styles.grey.color}}
                    frontColor={styles.grey.color}
                    width={scale(10 * 28)}
                    shiftX={verticalScale(10)}
                    noOfSections={10}
                    stackData={barData}
                    isAnimated
                />
            </View>
        </VirtualizedList>
    );
};