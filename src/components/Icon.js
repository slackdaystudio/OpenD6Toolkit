import React from 'react';
import PropTypes from 'prop-types';
import {Pressable, View} from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {verticalScale} from 'react-native-size-matters';

// Copyright (C) Slack Day Studio - All Rights Reserved
// Unauthorized copying of this file, via any medium is strictly prohibited
// Proprietary and confidential
// Written by Phil Guinchard <phil.guinchard@gmail.com>, January 2021

export const Icon = ({name, size, color, onPress, onLongPress, ...rest}) => {
    if (typeof onPress === 'function') {
        return (
            <Pressable active onPress={() => onPress()} onLongPress={() => onLongPress()} style={({pressed}) => [{}, {opacity: pressed ? 0.1 : 1}]}>
                <View alignItems="center" justifyContent="center">
                    <FontAwesome6 name={name} size={size} color={color} {...rest} />
                </View>
            </Pressable>
        );
    }

    return <FontAwesome6 name={name} size={size} color={color} {...rest} />;
};

Icon.propTypes = {
    name: PropTypes.string.isRequired,
    size: PropTypes.number,
    color: PropTypes.string,
    onPress: PropTypes.func,
};

Icon.defaultProps = {
    size: verticalScale(14),
    color: '#fff',
};