import React from 'react';
import {View, Text} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import Heading from '../../Heading';
import {VirtualizedList} from '../../VirtualizedList';
import {StatsChart} from '../../chart/StatsChart';
import {Animated, AnimatedNumber} from '../../animated';
import styles from '../../../Styles';

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

export const LABEL_AVERAGE_ROLL = 'Average Roll';

export const LABEL_LOWEST_PENALTY_DICE_TOTAL = 'Lowest Penalty Dice Total';

const FLOATING_POINT_STATS = [LABEL_AVERAGE_ROLL, LABEL_LOWEST_PENALTY_DICE_TOTAL];

const _renderDieDistributionChart = stats => {
    if (stats.sum === 0) {
        return <View minHeight={200} />;
    }

    return <StatsChart distributions={stats.distributions} />;
};

const _renderHeading = heading => {
    if (heading === null) {
        return null;
    }

    return <Heading text={heading} />;
};

export const StatisticsTab = ({records, stats}) => {
    return (
        <VirtualizedList paddingTop={verticalScale(10)}>
            <Animated animationProps={{from: {opacity: 0, translateX: 150}, animate: {opacity: 1, translateX: 0}}}>
                {_renderDieDistributionChart(stats)}
            </Animated>
            {records.map((record, i) => {
                return (
                    <View key={`section-${i}`}>
                        {_renderHeading(record.heading)}
                        {record.stats.map((s, j) => {
                            let end = typeof s.value === 'function' ? s.value() : s.value;

                            if (!FLOATING_POINT_STATS.includes(s.label)) {
                                end = parseInt(end, 10);
                            }

                            return (
                                <View
                                    key={j}
                                    flexDirection="row"
                                    style={{height: verticalScale(30), paddingHorizontal: scale(20)}}
                                    alignItems="center"
                                    justifyContent="space-between">
                                    <View flex={4}>
                                        <Text style={styles.bold}>{s.label}</Text>
                                    </View>
                                    <View flex={1} alignItems="flex-end">
                                        <Text style={styles.text}>
                                            <AnimatedNumber animationProps={{end: end, duration: 1}} />
                                        </Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                );
            })}
            <View style={{paddingBottom: verticalScale(10)}} />
        </VirtualizedList>
    );
};
