import React from 'react';
import PropTypes from 'prop-types';
import {Pressable, Text, View} from 'react-native';
import {scale} from 'react-native-size-matters';
import {Icon} from './Icon';
import {common} from '../lib/Common';
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

export const DieCode = ({navigation, dice, label, showDice, style, elements}) => {
    const _roll = (autoRoll = true) => {
        navigation.navigate('DiceRoller', {dice: dice.dice, pips: dice.pips, rollStyle: dice.style, autoRoll: autoRoll});
    };

    const _renderElements = () => {
        if (elements === undefined) {
            return null;
        }

        return <>{elements}</>;
    };

    if (showDice) {
        return (
            <View flex={1} flexDirection="row" alignItems="center" justifyContent="flex-end">
                <Pressable
                    flex={1}
                    flexDirection="row"
                    justifyContent="flex-end"
                    alignItems="center"
                    onPress={() => _roll()}
                    onLongPress={() => _roll(false)}
                    style={({pressed}) => [{}, {opacity: pressed ? 0.1 : 1}]}>
                    <Text style={[styles.text, style]}>
                        {label ? `${label} ` : ''}
                        {dice.dice}D{dice.pips > 0 ? `+${dice.pips}` : ''}
                    </Text>
                    <Icon solid size={style.fontSize} color="" name={'dice'} style={[style, {paddingHorizontal: scale(8)}]} />
                </Pressable>
                {_renderElements()}
            </View>
        );
    }

    if (common.isEmptyObject(elements)) {
        return (
            <Text style={[styles.text, style]}>
                {label ? `${label} ` : ''}
                {dice.dice}D{dice.pips > 0 ? `+${dice.pips}` : ''}
            </Text>
        );
    }

    return (
        <View alignItems="center" justifyContent="flex-end">
            <Text style={[styles.text, style]}>
                {label ? `${label} ` : ''}
                {dice.dice}D{dice.pips > 0 ? `+${dice.pips}` : ''}
            </Text>
            {_renderElements()}
        </View>
    );
};

DieCode.propTypes = {
    navigation: PropTypes.object,
    dice: PropTypes.object.isRequired,
    label: PropTypes.string,
    showDice: PropTypes.bool,
    style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    elements: PropTypes.object,
};

DieCode.defaultProps = {
    label: '',
    showDice: false,
    style: {...styles.grey},
};
