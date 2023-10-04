import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Text, View} from 'react-native';
import {Button} from 'native-base';
import Modal from 'react-native-modal';
import {scale, verticalScale} from 'react-native-size-matters';
import {VirtualizedList} from '../components/VirtualizedList';
import styles from '../Styles';

// Copyright (C) Slack Day Studio - All Rights Reserved
// Unauthorized copying of this file, via any medium is strictly prohibited
// Proprietary and confidential
// Written by Phil Guinchard <phil.guinchard@gmail.com>, January 2021

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
            <Modal
                isVisible={this.props.visible}
                onBackButtonPress={() => this.props.onClose()}
                onBackdropPress={() => this.props.onClose()}
                scrollTo={this._handleScrollTo}
                scrollOffsetMax={300 - 200}>
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
                        {this._renderOkButton()}
                        <View style={styles.buttonContainer}>
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
