import React, {useState, useCallback} from 'react';
import PropTypes from 'prop-types';
import {useFocusEffect} from '@react-navigation/native';
import {View} from 'react-native';
import {Text, Item, Input} from 'native-base';
import {default as RNSlider} from '@react-native-community/slider';
import {ScaledSheet, scale, verticalScale} from 'react-native-size-matters';
import styles from '../Styles';

// Copyright 2018-Present Philip J. Guinchard
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

export const DieSlider = ({label, value, step, min, max, disabled, valueKey, onValueChange, toggleTabsLocked}) => {
    const [textValue, setTextValue] = useState(value);

    useFocusEffect(
        useCallback(() => {
            setTextValue(value.toString());
        }, [value]),
    );

    const _isFraction = () => {
        return step < 1;
    };

    const _isInputValid = val => {
        if (val === '' || val === '-') {
            _onValueChange(0);

            return false;
        }

        if (_isFraction()) {
            return /^(-)?[0-9](\.(25|50|5|75|0))?$/.test(val);
        }

        return /^(-)?[0-9]*$/.test(val);
    };

    const _onTextValueChange = (val, end = false) => {
        if (_isInputValid(val) && val % step === 0.0) {
            if (val < min) {
                val = min;
            } else if (val > max) {
                val = max;
            }

            _onValueChange(val, end);
        }
    };

    const _onValueChange = (val, end) => {
        val = parseNum(val);

        setTextValue(val);

        if (end) {
            if (typeof valueKey === 'string') {
                onValueChange(valueKey, val);
            } else {
                onValueChange(val);
            }
        }
    };

    const parseNum = text => {
        return _isFraction() ? parseFloat(text) : parseInt(text, 10);
    };

    return (
        <View style={{paddingHorizontal: scale(20)}}>
            <View style={localStyles.titleContainer}>
                <Text style={styles.grey}>{label}</Text>
                <View style={{width: _isFraction() ? scale(50) : scale(40)}}>
                    <Item>
                        <Input
                            style={styles.grey}
                            keyboardType="numeric"
                            maxLength={_isFraction() ? 5 : 3}
                            defaultValue={textValue.toString()}
                            onEndEditing={event => _onTextValueChange(event.nativeEvent.text, true)}
                        />
                    </Item>
                </View>
            </View>
            <View>
                <RNSlider
                    style={{height: verticalScale(35)}}
                    value={parseNum(textValue)}
                    step={step}
                    minimumValue={min}
                    maximumValue={max}
                    onValueChange={val => _onTextValueChange(val.toString())}
                    onSlidingStart={() => toggleTabsLocked(true)}
                    onSlidingComplete={val => {
                        toggleTabsLocked(false);

                        _onTextValueChange(val.toString(), true);
                    }}
                    disabled={disabled}
                    minimumTrackTintColor="#de8743"
                    maximumTrackTintColor="#874d1f"
                    thumbTintColor="#f57e20"
                />
            </View>
        </View>
    );
};

DieSlider.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    step: PropTypes.number.isRequired,
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    disabled: PropTypes.bool,
    valueKey: PropTypes.string,
    onValueChange: PropTypes.func.isRequired,
    toggleTabsLocked: PropTypes.func,
};

DieSlider.defaultProps = {
    toggleTabsLocked: () => {},
    disabled: false,
};

const localStyles = ScaledSheet.create({
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '10@vs',
    },
});

export default DieSlider;
