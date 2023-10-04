import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Switch} from 'react-native';
import {Text, Item, Label, Input} from 'native-base';
import {scale} from 'react-native-size-matters';
import Heading from '../Heading';
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
        updateDefenseSystem: PropTypes.func.isRequired,
        updateStaticDefense: PropTypes.func.isRequired,
    };

    _updateStaticDefense(name, value) {
        let rating = '';

        if (value === '' || value === '-') {
            rating = value;
        } else {
            rating = parseInt(value, 10) || 0;

            if (rating > 999) {
                rating = 999;
            } else if (rating < 0) {
                rating = 0;
            }
        }

        this.props.updateStaticDefense(name, rating);
    }

    _renderPassiveDefense() {
        return (
            <View style={{flex: 1, alignItems: 'center', paddingTop: scale(30)}}>
                <Text style={styles.grey}>
                    <Text style={styles.boldGrey}>Base Target Number:</Text> 10
                </Text>
            </View>
        );
    }

    _renderStaticDefenses() {
        return (
            <View>
                <View style={styles.titleContainer}>
                    <View style={{paddingLeft: 30}}>
                        <Item stackedLabel style={{width: scale(120)}}>
                            <Label style={{fontSize: scale(10)}}>Block</Label>
                            <Input
                                style={styles.textInput}
                                keyboardType="numeric"
                                maxLength={4}
                                value={this.props.character.defenses.staticDefenses.block.toString()}
                                onChangeText={value => this._updateStaticDefense('block', value)}
                            />
                        </Item>
                    </View>
                    <View style={{paddingRight: 30}}>
                        <Item stackedLabel style={{width: scale(120)}}>
                            <Label style={{fontSize: scale(10)}}>Dodge</Label>
                            <Input
                                style={styles.textInput}
                                keyboardType="numeric"
                                maxLength={4}
                                value={this.props.character.defenses.staticDefenses.dodge.toString()}
                                onChangeText={value => this._updateStaticDefense('dodge', value)}
                            />
                        </Item>
                    </View>
                </View>
                <View style={styles.titleContainer}>
                    <View style={{paddingLeft: 30}}>
                        <Item stackedLabel style={{width: scale(120)}}>
                            <Label style={{fontSize: scale(10)}}>Parry</Label>
                            <Input
                                style={styles.textInput}
                                keyboardType="numeric"
                                maxLength={4}
                                value={this.props.character.defenses.staticDefenses.parry.toString()}
                                onChangeText={value => this._updateStaticDefense('parry', value)}
                            />
                        </Item>
                    </View>
                    <View style={{paddingRight: 30}}>
                        <Item stackedLabel style={{width: scale(120)}}>
                            <Label style={{fontSize: scale(10)}}>Soak</Label>
                            <Input
                                style={styles.textInput}
                                keyboardType="numeric"
                                maxLength={4}
                                value={this.props.character.defenses.staticDefenses.soak.toString()}
                                onChangeText={value => this._updateStaticDefense('soak', value)}
                            />
                        </Item>
                    </View>
                </View>
            </View>
        );
    }

    _renderDefenses() {
        if (this.props.character.defenses.useStaticDefenses) {
            return this._renderStaticDefenses();
        }

        return this._renderPassiveDefense();
    }

    render() {
        return (
            <View>
                <Heading text="Defenses" />
                <View style={styles.titleContainer}>
                    <Text style={[styles.grey, {paddingLeft: 30}]}>Use Static Defenses?</Text>
                    <View style={{paddingRight: 30}}>
                        <Switch
                            value={this.props.character.defenses.useStaticDefenses}
                            onValueChange={() => this.props.updateDefenseSystem()}
                            thumbColor="#f57e20"
                            trackColor={{true: '#fde5d2', false: '#4f4e4e'}}
                        />
                    </View>
                </View>
                {this._renderDefenses()}
                <View style={{paddingBottom: 20}} />
            </View>
        );
    }
}
