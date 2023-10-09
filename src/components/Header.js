import React from 'react';
import PropTypes from 'prop-types';
import {BackHandler, Platform, View, Image, TouchableHighlight, StatusBar} from 'react-native';
import {ScaledSheet, scale, verticalScale} from 'react-native-size-matters';
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

export const EXIT_APP = '0';

export const Header = ({navigation, backScreen}) => {
    const _onBackButtonPress = () => {
        if (backScreen === EXIT_APP) {
            BackHandler.exitApp();

            return true;
        }

        if (backScreen === null || backScreen === undefined) {
            navigation.goBack();

            return true;
        }

        navigation.navigate(backScreen);
    };

    return (
        <View flex={1} style={{maxHeight: verticalScale(Platform.OS === 'ios' ? 65 : 65)}}>
            <StatusBar backgroundColor="#f57e20" barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} />
            <View flex={0} flexGrow={1} flexDirection="row" justifyContent="space-around" style={localStyles.logo}>
                <Icon
                    solid
                    name="chevron-left"
                    size={verticalScale(18)}
                    onPress={() => _onBackButtonPress()}
                    style={{color: '#fff', paddingTop: verticalScale(15)}}
                />
                <TouchableHighlight underlayColor="#fde5d2" onPress={() => navigation.navigate('Home')}>
                    <Image style={{height: scale(47), width: scale(42)}} source={require('../../public/d6_logo_White_512x512.png')} />
                </TouchableHighlight>
                <Icon
                    solid
                    name="bars"
                    size={verticalScale(18)}
                    onPress={() => navigation.toggleDrawer()}
                    style={{color: '#fff', paddingTop: verticalScale(15)}}
                />
            </View>
        </View>
    );
};

Header.propTypes = {
    navigation: PropTypes.object.isRequired,
    backScreen: PropTypes.string,
};

const localStyles = ScaledSheet.create({
    logo: {
        backgroundColor: '#f57e20',
        ...Platform.select({
            ios: {
                paddingTop: '10@vs',
            },
        }),
    },
});
