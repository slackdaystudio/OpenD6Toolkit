import React from 'react';
import {Text, View} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import {PieChart} from 'react-native-gifted-charts';
import {Icon} from '../Icon';
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

export const StatsChart = ({distributions, onPress}) => {
    const colors = ['#2E7D32', '#4527A0', '#FF6F00', '#1565C0', '#FFA726', '#B71C1C'];

    const data = Object.keys(distributions).map((key, i) => {
        return {
            value: distributions[key],
            color: colors[i],
            text: distributions[key].toString(),
            faceName: key,
        };
    });

    const getCenterText = () => {
        return (
            <>
                <View paddingHorizontal={scale(3)}>
                    <Text style={[styles.bold, {textAlign: 'center'}]}>{data.reduce((total, current) => total + parseInt(current.text, 10), 0)}</Text>
                </View>
                <View paddingHorizontal={scale(3)} textAlign="center">
                    <Text style={[styles.textSmallHeader, {textAlign: 'center'}]}>Total Dice Rolled</Text>
                </View>
            </>
        );
    };

    return (
        <>
            <Text style={[styles.textHeader, {textAlign: 'center', paddingVertical: verticalScale(10)}]}>Dice Face Distributions</Text>
            <View alignItems="center" justifyContent="center" paddingBottom={verticalScale(15)}>
                <Text style={[styles.chartLegend, {textAlign: 'center', paddingBottom: verticalScale(5)}]}>Legend</Text>
                <View width={scale(150)} flexDirection="row" justifyContent={'space-around'}>
                    {data.map((d, i) => {
                        return <Icon key={`face-${i}`} solid size={verticalScale(20)} color={d.color} name={`dice-${d.faceName}`} />;
                    })}
                </View>
            </View>
            <View alignItems="center" justifyContent="center">
                <View paddingLeft={scale(30)}>
                    <PieChart
                        donut
                        innerCircleColor={styles.container.backgroundColor}
                        showText
                        data={data}
                        textColor={styles.container.backgroundColor}
                        fontWeight="bold"
                        radius={scale(120)}
                        labelsPosition="outward"
                        centerLabelComponent={getCenterText}
                    />
                </View>
            </View>
        </>
    );
};
