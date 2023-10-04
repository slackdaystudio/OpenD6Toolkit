import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View} from 'react-native';
import {Form, Item, Label, Input} from 'native-base';
import {scale} from 'react-native-size-matters';
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

export default class Appearance extends Component {
    static propTypes = {
        character: PropTypes.object.isRequired,
        updateAppearance: PropTypes.func.isRequired,
    };

    render() {
        return (
            <View>
                <Form>
                    <Item stackedLabel>
                        <Label style={{fontSize: scale(10)}}>Name</Label>
                        <Input
                            style={styles.textInput}
                            maxLength={64}
                            value={this.props.character.name}
                            onChangeText={value => this.props.updateAppearance('name', value)}
                        />
                    </Item>
                    <Item stackedLabel>
                        <Label style={{fontSize: scale(10)}}>Species</Label>
                        <Input
                            style={styles.textInput}
                            maxLength={30}
                            value={this.props.character.species}
                            onChangeText={value => this.props.updateAppearance('species', value)}
                        />
                    </Item>
                </Form>
                <View style={{paddingBottom: 20}} />
            </View>
        );
    }
}
