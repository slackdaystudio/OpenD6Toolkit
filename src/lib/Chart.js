import React from 'react';
import {View} from 'react-native';
import {PieChart} from 'react-native-svg-charts';
import {Circle, G, Line, Text} from 'react-native-svg';
import {scale} from 'react-native-size-matters';

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

class Chart {
    renderDieDistributionChart(distributions) {
        let pieData = [
            {
                value: distributions.one,
                svg: {fill: '#ed7e78'},
                key: 'pie-1',
                label: '1',
            },
            {
                value: distributions.two,
                svg: {fill: '#8b8ee5'},
                key: 'pie-2',
                label: '2',
            },
            {
                value: distributions.three,
                svg: {fill: '#35a06e'},
                key: 'pie-3',
                label: '3',
            },
            {
                value: distributions.four,
                svg: {fill: '#668df9'},
                key: 'pie-4',
                label: '4',
            },
            {
                value: distributions.five,
                svg: {fill: '#e5b404'},
                key: 'pie-5',
                label: '5',
            },
            {
                value: distributions.six,
                svg: {fill: '#f57e20'},
                key: 'pie-6',
                label: '6',
            },
        ];

        const Labels = ({slices}) => {
            return slices.map((slice, index) => {
                const {labelCentroid, pieCentroid, data} = slice;
                return (
                    <G key={index}>
                        <Line x1={labelCentroid[0]} y1={labelCentroid[1]} x2={pieCentroid[0]} y2={pieCentroid[1]} stroke={data.svg.fill} />
                        <Circle cx={labelCentroid[0]} cy={labelCentroid[1]} r={scale(15)} fill={data.svg.fill} />
                        <Text stroke="#383834" fontSize={scale(12).toString()} x={labelCentroid[0] / 2} y={labelCentroid[1] / 2 + scale(5)} textAnchor="middle">
                            {data.value}
                        </Text>
                        <Text stroke="#383834" fontSize={scale(12).toString()} x={labelCentroid[0]} y={labelCentroid[1] + scale(5)} textAnchor="middle">
                            {data.label}
                        </Text>
                    </G>
                );
            });
        };

        return (
            <View>
                <PieChart
                    style={{height: scale(200)}}
                    data={pieData}
                    spacing={0}
                    innerRadius={scale(20)}
                    outerRadius={scale(55)}
                    labelRadius={scale(80)}
                    sort={(a, b) => a.label.localeCompare(b.label)}>
                    <Labels />
                </PieChart>
            </View>
        );
    }
}

export let chart = new Chart();
