import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Text, View} from 'react-native';
import {Button} from 'native-base';
import Modal from 'react-native-modal';
import {scale, verticalScale} from 'react-native-size-matters';
import {VirtualizedList} from '../components/VirtualizedList';
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

export default class ConfirmationDialog extends Component {
    static propTypes = {
        visible: PropTypes.bool.isRequired,
        title: PropTypes.string.isRequired,
        info: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        closeLabel: PropTypes.string,
        onOk: PropTypes.func,
        onClose: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            scrollOffset: 0,
        };
    }

    _renderOkButton() {
        if (typeof this.props.onOk === 'function') {
            return (
                <Button style={styles.button} onPress={() => this.props.onOk()}>
                    <Text uppercase={false} style={styles.buttonText}>
                        OK
                    </Text>
                </Button>
            );
        }

        return null;
    }

    render() {
        return (
            <Modal isVisible={this.props.visible} onBackButtonPress={() => this.props.onClose()} onBackdropPress={() => this.props.onClose()}>
                <View style={styles.modal}>
                    <Text style={styles.modalHeader}>{this.props.title}</Text>
                    <View style={styles.modalContent}>
                        <VirtualizedList>
                            {typeof this.props.info === 'string' ? (
                                <Text style={[styles.text, {paddingHorizontal: scale(10)}]}>{this.props.info}</Text>
                            ) : (
                                this.props.info()
                            )}
                        </VirtualizedList>
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
                            {this._renderOkButton()}
                            <Button style={styles.button} onPress={() => this.props.onClose()}>
                                <Text uppercase={false} style={styles.buttonText}>
                                    {this.props.onOk === null ? 'OK' : 'Cancel'}
                                </Text>
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}

ConfirmationDialog.defaultProps = {
    closeLabel: 'Cancel',
};
