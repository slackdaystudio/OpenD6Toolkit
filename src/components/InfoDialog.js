import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, ScrollView} from 'react-native';
import {Text} from 'native-base';
import {verticalScale} from 'react-native-size-matters';
import Modal from 'react-native-modal';
import LogoButton from './LogoButton';
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

export default class InfoDialog extends Component {
    static propTypes = {
        visible: PropTypes.bool.isRequired,
        title: PropTypes.string.isRequired,
        info: PropTypes.string.isRequired,
        onClose: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            scrollOffset: 0,
        };
    }

    _handleOnScroll = event => {
        this.setState({
            scrollOffset: event.nativeEvent.contentOffset.y,
        });
    };

    _handleScrollTo = p => {
        if (this.scrollViewRef) {
            this.scrollViewRef.scrollTo(p);
        }
    };

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
                    <View style={[styles.modalContent, {minHeight: verticalScale(170)}]}>
                        <ScrollView
                            style={{maxHeight: verticalScale(165)}}
                            ref={ref => (this.scrollViewRef = ref)}
                            onScroll={this._handleOnScroll}
                            scrollEventThrottle={16}>
                            <Text style={styles.grey}>{this.props.info}</Text>
                        </ScrollView>
                        <LogoButton label="Close" onPress={() => this.props.onClose()} />
                    </View>
                </View>
            </Modal>
        );
    }
}
