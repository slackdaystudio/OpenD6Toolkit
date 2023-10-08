import React from 'react';
import PropTypes from 'prop-types';
import {Pressable, Text, View} from 'react-native';
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

export const Button = ({label, onPress, disabled, small}) => {
    return (
        <View style={styles.buttonContainer}>
            <Pressable flexDirection="row" onPress={disabled ? null : onPress} style={({pressed}) => [{}, {opacity: pressed ? 0.1 : 1}]}>
                <View style={small ? styles.buttonSmall : styles.button}>
                    <Text style={styles.buttonText}>{label}</Text>
                </View>
            </Pressable>
        </View>
    );
};

Button.propTypes = {
    label: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    small: PropTypes.bool,
};

Button.defaulProps = {
    disabled: false,
    small: false,
};
