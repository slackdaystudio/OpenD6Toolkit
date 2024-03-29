import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View, Switch} from 'react-native';
import {Text, Item, Input, Label, Icon} from 'native-base';
import {scale, verticalScale} from 'react-native-size-matters';
import Modal from 'react-native-modal';
import ErrorMessage from './ErrorMessage';
import Heading from './Heading';
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

export const MODE_ADD = 'ADD';

export const MODE_EDIT = 'EDIT';

export default class RanksDialog extends Component {
    static propTypes = {
        visible: PropTypes.bool.isRequired,
        optionKey: PropTypes.string.isRequired,
        item: PropTypes.object,
        mode: PropTypes.string.isRequired,
        onSave: PropTypes.func.isRequired,
        onClose: PropTypes.func.isRequired,
        onDelete: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.state = {
            totalRanks: 1,
            displayNote: '',
            excludeFromBuildCosts: false,
            errorMessage: null,
        };

        this.onDelete = this._onDelete.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.item !== null && prevProps.item !== this.props.item) {
            this.setState({
                totalRanks: this.props.item.totalRanks,
                displayNote: this.props.item.displayNote,
                excludeFromBuildCosts: this.props.item.excludeFromBuildCosts,
            });
        }
    }

    _updateDisplayNote(value) {
        this.setState({displayNote: value});
    }

    _toggleExcludeFromBuildCosts() {
        this.setState({excludeFromBuildCosts: !this.state.excludeFromBuildCosts});
    }

    _incrementRanks() {
        let newRanks = this.state.totalRanks + 1;

        this.setState({
            totalRanks: newRanks,
            errorMessage: null,
        });
    }

    _decrementRanks() {
        let newRanks = this.state.totalRanks - 1;

        if (newRanks < 1) {
            this.setState({errorMessage: 'Ranks may not be less than 1'});
        } else {
            this.setState({totalRanks: newRanks});
        }
    }

    _save() {
        let newItem = {...this.props.item};
        newItem.totalRanks = this.state.totalRanks;
        newItem.displayNote = this.state.displayNote;
        newItem.excludeFromBuildCosts = this.state.excludeFromBuildCosts;

        this.props.onSave(this.props.optionKey, newItem);
        this.props.onClose();
    }

    _onDelete() {
        this.props.onDelete(this.props.optionKey, this.props.item);
    }

    _renderFormControls() {
        if (this.props.item !== null && this.props.item.multipleRanks) {
            return (
                <View flexDirection="row" justifyContent="center" paddingBottom={verticalScale(20)}>
                    <View paddingRight={scale(30)}>
                        <Icon
                            type="FontAwesome"
                            name="minus-square"
                            style={[styles.grey, {fontSize: scale(25), color: '#f57e20', alignItems: 'flex-start'}]}
                            onPress={() => this._decrementRanks()}
                        />
                    </View>
                    <View>
                        <Text style={styles.grey}>{this.state.totalRanks}</Text>
                    </View>
                    <View paddingLeft={scale(30)}>
                        <Icon
                            type="FontAwesome"
                            name="plus-square"
                            style={[styles.grey, {fontSize: scale(25), color: '#f57e20', alignItems: 'flex-end'}]}
                            onPress={() => this._incrementRanks()}
                        />
                    </View>
                </View>
            );
        }

        return null;
    }

    _renderSaveButton() {
        if (this.props.item !== null) {
            return <Button label="Save" onPress={() => this._save()} minWidth={130} />;
        }

        return null;
    }

    _renderDeleteButton() {
        let label = this.props.mode === MODE_EDIT ? 'Delete' : 'Close';
        let action = this.props.mode === MODE_EDIT ? this.onDelete : this.props.onClose;

        if (action === null) {
            action = this.props.onClose;
        }

        return <Button label={label} onPress={() => action()} minWidth={130} />;
    }

    render() {
        return (
            <Modal
                isVisible={this.props.visible}
                swipeDirection={'right'}
                onSwipeComplete={() => this.props.onClose()}
                onBackButtonPress={() => this.props.onClose()}
                onBackdropPress={() => this.props.onClose()}>
                <View style={styles.modal}>
                    <Text style={styles.modalHeader}>{this.props.item === null ? 'Select Rank' : this.props.item.name}</Text>
                    <ErrorMessage errorMessage={this.state.errorMessage} />
                    <View flexDirection="column" style={styles.modalContent}>
                        <View flexDirection="row" paddingBottom={verticalScale(20)}>
                            <View flex={1} style={{alignSelf: 'center', paddingLeft: scale(10)}}>
                                <Text style={styles.grey}>Note</Text>
                            </View>
                            <View flex={4} style={{alignSelf: 'flex-end'}}>
                                <Item underline>
                                    <Input
                                        style={[styles.textInput, {maxWidth: scale(200)}]}
                                        maxLength={30}
                                        value={this.state.displayNote}
                                        onChangeText={value => this._updateDisplayNote(value)}
                                    />
                                </Item>
                            </View>
                        </View>
                        {this._renderFormControls()}
                        <View flexDirection="row" justifyContent="space-between">
                            <Text style={styles.grey}>Exclude from build costs?</Text>
                            <Switch
                                value={this.state.excludeFromBuildCosts}
                                onValueChange={() => this._toggleExcludeFromBuildCosts()}
                                thumbColor="#f57e20"
                                trackColor={{true: '#fde5d2', false: '#4f4e4e'}}
                            />
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
                            <View flexDirection="row" justifyContent="space-around" style={styles.buttonContainer}>
                                {this._renderSaveButton()}
                                {this._renderDeleteButton()}
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}

const localStyles = StyleSheet.create({
    row: {
        flex: 1,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
});
