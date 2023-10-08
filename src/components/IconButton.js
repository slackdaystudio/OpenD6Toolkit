import React from 'react';
import PropTypes from 'prop-types';
import {Text, View} from 'react-native';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {scale, verticalScale} from 'react-native-size-matters';
import {Icon} from './Icon';

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
export const TEXT_LEFT = 0;

export const TEXT_RIGHT = 1;

export const TEXT_TOP = 3;

export const TEXT_BOTTOM = 4;

export const IconButton = ({label, textPos, icon, iconColor, onPress, onLongPress, textStyle}) => {
    switch (textPos) {
        case TEXT_LEFT:
            return (
                <TouchableHighlight onPress={onPress} onLongPress={onLongPress} underlayColor={'#e8b9b9'} style={{borderRadius: 10}}>
                    <View alignContent="center" alignItems="center" textAlign="center">
                        <Text style={[textStyle, {textAlign: 'center'}]}>{label}</Text>
                        <Icon solid size={verticalScale(32)} style={{textAlign: 'center', paddingLeft: scale(5)}} name={icon} color={iconColor} />
                    </View>
                </TouchableHighlight>
            );
        case TEXT_RIGHT:
            return (
                <TouchableHighlight onPress={onPress} onLongPress={onLongPress} underlayColor={'#e8b9b9'} style={{borderRadius: 10}}>
                    <View alignContent="center" alignItems="center" textAlign="center">
                        <Icon solid size={verticalScale(32)} style={{textAlign: 'center', paddingRight: scale(5)}} name={icon} color={iconColor} />
                        <Text style={[textStyle, {textAlign: 'center'}]}>{label}</Text>
                    </View>
                </TouchableHighlight>
            );
        case TEXT_TOP:
            return (
                <TouchableHighlight onPress={onPress} onLongPress={onLongPress} underlayColor={'#e8b9b9'} style={{borderRadius: 10}}>
                    <View alignContent="center" alignItems="center" textAlign="center">
                        <Text style={[textStyle, {textAlign: 'center'}]}>{label}</Text>
                        <Icon solid size={verticalScale(32)} style={{textAlign: 'center', paddingTop: verticalScale(5)}} name={icon} color={iconColor} />
                    </View>
                </TouchableHighlight>
            );
        default:
            return (
                <TouchableHighlight
                    onPress={onPress}
                    onLongPress={onLongPress}
                    underlayColor={'#e8b9b9'}
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        minWidth: scale(85),
                        minHeight: scale(85),
                    }}>
                    <View>
                        <Icon solid size={verticalScale(32)} style={{textAlign: 'center', paddingBottom: verticalScale(5)}} name={icon} color={iconColor} />
                        <Text style={[textStyle, {textAlign: 'center'}]}>{label}</Text>
                    </View>
                </TouchableHighlight>
            );
    }
};

IconButton.propTypes = {
    label: PropTypes.string.isRequired,
    textPos: PropTypes.number.isRequired,
    icon: PropTypes.string.isRequired,
    iconColor: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    onLongPress: PropTypes.func,
    textStyle: PropTypes.object,
};

IconButton.defaultProps = {
    textStyle: {
        fontWeight: 'bold',
        color: '#f57e20',
        fontSize: verticalScale(14),
    },
};
