import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View} from 'react-native';
import {Text, Item, Input, Picker} from 'native-base';
import Modal from 'react-native-modal';
import {scale, verticalScale} from 'react-native-size-matters';
import ErrorMessage from './ErrorMessage';
import {Button} from './Button';
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

export default class AttributeDialog extends Component {
    static propTypes = {
        visible: PropTypes.bool.isRequired,
        identifier: PropTypes.string.isRequired,
        dice: PropTypes.string,
        modifierDice: PropTypes.string,
        pips: PropTypes.number,
        modifierPips: PropTypes.number,
        errorMessage: PropTypes.string,
        close: PropTypes.func,
        onSave: PropTypes.func,
        onUpdateDice: PropTypes.func,
        onUpdateModifierDice: PropTypes.func,
        onUpdatePips: PropTypes.func,
        onUpdateModifierPips: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.state = {
            dice: props.dice,
            modifierDice: props.modifierDice,
            pips: props.pips,
        };
    }

    _renderEditDieCode() {
        return (
            <View style={styles.modal}>
                <Text style={styles.modalHeader}>{'Edit ' + this.props.identifier}</Text>
                <ErrorMessage errorMessage={this.props.errorMessage} />
                <View flexDirection="column" style={styles.modalContent}>
                    <View flexDirection="row" justifyContent="space-between">
                        <View flex={4} style={{alignSelf: 'flex-end', paddingLeft: scale(10)}}>
                            <Text style={styles.grey}>Base</Text>
                        </View>
                        <View flex={1} style={{alignSelf: 'flex-end'}}>
                            <Item underline>
                                <Input
                                    style={styles.grey}
                                    keyboardType="numeric"
                                    maxLength={2}
                                    value={this.props.dice}
                                    onChangeText={value => this.props.onUpdateDice(value)}
                                />
                            </Item>
                        </View>
                    </View>
                    <View flexDirection="row">
                        <View flex={2}>
                            <Picker
                                inlinelabel
                                label="Pips"
                                style={[styles.picker, {fontSize: verticalScale(14)}]}
                                textStyle={styles.grey}
                                placeholderIconColor="#FFFFFF"
                                iosHeader="Select one"
                                mode="dropdown"
                                selectedValue={this.props.pips}
                                onValueChange={value => this.props.onUpdatePips(value)}>
                                <Item style={{color: styles.grey.color, fontSize: verticalScale(14)}} label="+0 pips" value={0} />
                                <Item style={{color: styles.grey.color, fontSize: verticalScale(14)}} label="+1 pip" value={1} />
                                <Item style={{color: styles.grey.color, fontSize: verticalScale(14)}} label="+2 pips" value={2} />
                            </Picker>
                        </View>
                    </View>
                    <View flexDirection="row" justifyContent="space-between" paddingBottom={verticalScale(10)}>
                        <View flex={4} style={{alignSelf: 'flex-end', paddingLeft: scale(10)}}>
                            <Text style={styles.grey}>Modifier</Text>
                        </View>
                        <View flex={1} style={{alignSelf: 'flex-end'}}>
                            <Item underline>
                                <Input
                                    underline
                                    style={styles.grey}
                                    keyboardType="numeric"
                                    maxLength={3}
                                    value={this.props.modifierDice}
                                    onChangeText={value => this.props.onUpdateModifierDice(value)}
                                />
                            </Item>
                        </View>
                    </View>
                    <View flex={1} flexDirection="column">
                        <View>
                            <Picker
                                inlinelabel
                                label="modifier Pips"
                                style={styles.picker}
                                textStyle={styles.grey}
                                placeholderIconColor="#FFFFFF"
                                iosHeader="Select one"
                                mode="dropdown"
                                selectedValue={this.props.modifierPips}
                                onValueChange={value => this.props.onUpdateModifierPips(value)}>
                                <Item label="-2 pips" value={-2} />
                                <Item label="-1 pips" value={-1} />
                                <Item label="+0 pips" value={0} />
                                <Item label="+1 pip" value={1} />
                                <Item label="+2 pips" value={2} />
                            </Picker>
                        </View>
                    </View>
                    <View
                        style={{
                            paddingVertical: verticalScale(10),
                            borderTopWidth: 1,
                            width: '100%',
                            backgroundColor: '#fff',
                            borderTopColor: '#f57e20',
                            borderBottomLeftRadius: 8,
                            borderBottomRightRadius: 8,
                        }}>
                        <Button label="Save" onPress={() => this.props.onSave(this.props.identifier)} />
                    </View>
                </View>
            </View>
        );
    }

    render() {
        return (
            <Modal
                isVisible={this.props.visible}
                swipeDirection={'right'}
                onSwipeComplete={() => this.props.close()}
                onBackButtonPress={() => this.props.close()}
                onBackdropPress={() => this.props.close()}>
                {this._renderEditDieCode()}
            </Modal>
        );
    }
}
