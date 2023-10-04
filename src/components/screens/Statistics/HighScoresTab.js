import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import {Card} from '../../Card';
import {HighScoreChart} from '../../chart/HighScoreChart';
import ConfirmationDialog from '../../ConfirmationDialog';
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

const _renderCardHeading = header => {
    return (
        <View flex={1} flexDirection="row" alignItems="center" justifyContent="space-between">
            <View flex={1}>
                <Text style={[styles.textHeader, {paddingLeft: scale(3)}]}>{header.dieCode}D</Text>
            </View>
            <View flex={1} alignItems="flex-end">
                <Text style={[styles.textHeader, {paddingRight: scale(3)}]}>x{header.classicRolls + header.legendRolls}</Text>
            </View>
        </View>
    );
};

const _renderCardBody = header => {
    return (
        <View flex={0} paddingTop={verticalScale(10)}>
            <View flex={1.5} flexDirection="row" alignItems="center">
                <View flex={1.25} />
                <View flex={1} borderBottomColor={styles.grey.color} borderBottomWidth={0.25}>
                    <Text style={[styles.textSmallHeader, {alignSelf: 'center'}]}>Rolls</Text>
                </View>
                <View flex={1} borderBottomColor={styles.grey.color} borderBottomWidth={0.25}>
                    <Text style={[styles.textSmallHeader, {alignSelf: 'center'}]}>High</Text>
                </View>
                <View flex={1} borderBottomColor={styles.grey.color} borderBottomWidth={0.25}>
                    <Text style={[styles.textSmallHeader, {alignSelf: 'center'}]}>Sum</Text>
                </View>
                <View flex={1} borderBottomColor={styles.grey.color} borderBottomWidth={0.25}>
                    <Text style={[styles.textSmallHeader, {alignSelf: 'center'}]}>Average</Text>
                </View>
            </View>
            <View flex={1.5} flexDirection="row">
                <View flex={1.25} borderBottomColor={styles.grey.color} borderBottomWidth={0.25}>
                    <Text style={[styles.textSmallHeader, {lineHeight: verticalScale(16), paddingLeft: scale(3)}]}>Classic</Text>
                </View>
                <View flex={1} borderBottomColor={styles.grey.color} borderBottomWidth={0.25}>
                    <Text style={[styles.textSmall, {alignSelf: 'center'}]}>{header.classicRolls}</Text>
                </View>
                <View flex={1} borderBottomColor={styles.grey.color} borderBottomWidth={0.25}>
                    <Text style={[styles.textSmall, {alignSelf: 'center'}]}>{header.classicHighScore}</Text>
                </View>
                <View flex={1} borderBottomColor={styles.grey.color} borderBottomWidth={0.25}>
                    <Text style={[styles.textSmall, {alignSelf: 'center'}]}>{header.totalClassic}</Text>
                </View>
                <View flex={1} borderBottomColor={styles.grey.color} borderBottomWidth={0.25}>
                    <Text style={[styles.textSmall, {alignSelf: 'center'}]}>
                        {(header.totalClassic / (header.classicRolls === 0 ? 1 : header.classicRolls)).toFixed(1)}
                    </Text>
                </View>
            </View>
            <View flex={1.5} flexDirection="row">
                <View flex={1.25} borderBottomColor={styles.grey.color} borderBottomWidth={0.25}>
                    <Text style={[styles.textSmallHeader, {lineHeight: verticalScale(16), paddingLeft: scale(3)}]}>Legend</Text>
                </View>
                <View flex={1} borderBottomColor={styles.grey.color} borderBottomWidth={0.25}>
                    <Text style={[styles.textSmall, {alignSelf: 'center'}]}>{header.legendRolls}</Text>
                </View>
                <View flex={1} borderBottomColor={styles.grey.color} borderBottomWidth={0.25}>
                    <Text style={[styles.textSmall, {alignSelf: 'center'}]}>{header.legendHighScore}</Text>
                </View>
                <View flex={1} borderBottomColor={styles.grey.color} borderBottomWidth={0.25}>
                    <Text style={[styles.textSmall, {alignSelf: 'center'}]}>{header.totalLegend}</Text>
                </View>
                <View flex={1} borderBottomColor={styles.grey.color} borderBottomWidth={0.25}>
                    <Text style={[styles.textSmall, {alignSelf: 'center'}]}>
                        {(header.totalLegend / (header.legendRolls === 0 ? 1 : header.legendRolls)).toFixed(1)}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const _renderCardFooter = header => {
    return (
        <View flex={1} alignItems="center" justifyContent="space-evenly">
            <View flexDirection="row">
                <View flex={1} />
                <View flex={2} alignItems="center" justifyContent="center">
                    <Text style={[styles.boldSmall, {textAlign: 'center'}]}>Criticals</Text>
                </View>
            </View>
            <View flex={1} flexDirection="row">
                <View flex={1} alignItems="center">
                    <Text style={[styles.textSmall, {verticalAlign: 'bottom'}]}>
                        <Text style={styles.boldSmall}>Normal: </Text>
                        {header.normalRolls}
                    </Text>
                </View>
                <View flex={1} alignItems="center">
                    <Text style={styles.textSmall}>
                        <Text style={styles.boldSmall}>Success: </Text>
                        {header.critSuccessRolls}
                    </Text>
                </View>
                <View flex={1} alignItems="center">
                    <Text style={styles.textSmall}>
                        <Text style={styles.boldSmall}>Failure: </Text>
                        {header.critFailureRolls}
                    </Text>
                </View>
            </View>
        </View>
    );
};

export const HighScoresTab = ({dieCode, stats, setDieCode}) => {
    const [highScore, setHighScore] = useState();

    useEffect(() => {
        setHighScore(stats.highScores.find(a => a.dieCode === dieCode));
    }, [dieCode, stats.highScores]);

    const renderHighScore = () => {
        return <Card heading={_renderCardHeading(highScore)} body={_renderCardBody(highScore)} footer={_renderCardFooter(highScore)} />;
    };

    if (stats.highScores.length > 0) {
        return (
            <>
                <HighScoreChart highScores={stats.highScores} onPress={val => setDieCode(val)} />
                <ConfirmationDialog
                    visible={highScore !== undefined}
                    title={`Breakdown for ${highScore === undefined ? '' : `${highScore.dieCode}D`}`}
                    info={highScore === undefined ? '' : () => renderHighScore()}
                    onClose={() => setDieCode(undefined)}
                />
            </>
        );
    }

    return <Text style={[styles.text, {textAlign: 'center'}]}>You have no rolls on record; go roll some dice!</Text>;
};