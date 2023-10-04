import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View} from 'react-native';
import {Text} from 'native-base';

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

export default class ErrorMessage extends Component {
    static propTypes = {
        errorMessage: PropTypes.string,
    };

    render() {
        if (this.props.errorMessage === null) {
            return null;
        }

        return (
            <View style={localStyles.errorMessage}>
                <Text style={{color: '#bc1212', alignSelf: 'center'}}>{this.props.errorMessage}</Text>
            </View>
        );
    }
}

const localStyles = StyleSheet.create({
    errorMessage: {
        borderWidth: 1,
        borderRadius: 4,
        borderColor: '#bc1212',
        backgroundColor: '#e8b9b9',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
        fontSize: 20,
        lineHeight: 25,
    },
});
