import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {View, Switch} from 'react-native';
import {Container, Content, Form, Item, Label} from 'native-base';
import {verticalScale} from 'react-native-size-matters';
import {Header} from '../Header';
import Heading from '../Heading';
import {Button} from '../Button';
import ConfirmationDialog from '../ConfirmationDialog';
import {statistics} from '../../lib/Statistics';
import styles from '../../Styles';
import {setSetting, resetSettings} from '../../reducers/settings';

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

const TYPE_SETTINGS = 0;

const TYPE_STATS = 1;

class SettingsScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        settings: PropTypes.object.isRequired,
        setSetting: PropTypes.func.isRequired,
        resetSettings: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            confirmationDialog: {
                type: -1,
                visible: false,
                title: '',
                info: '',
            },
        };

        this.onClose = this._closeConfirmationDialog.bind(this);
        this.onOk = this._resetConfirmed.bind(this);
    }

    _reset() {
        let newState = {...this.state};
        newState.confirmationDialog.type = TYPE_SETTINGS;
        newState.confirmationDialog.title = 'Reset Settings?';
        newState.confirmationDialog.info = 'Are you certain you wish to reset all your settings to default?';
        newState.confirmationDialog.visible = true;

        this.setState(newState);
    }

    _resetStats() {
        let newState = {...this.state};
        newState.confirmationDialog.type = TYPE_STATS;
        newState.confirmationDialog.title = 'Reset Statistics?';
        newState.confirmationDialog.info = 'Are you certain you wish to reset your statistics?';
        newState.confirmationDialog.visible = true;

        this.setState(newState);
    }

    _resetConfirmed() {
        this.state.confirmationDialog.type === TYPE_SETTINGS ? this.props.resetSettings() : this._clearStatsConfirm();

        this._closeConfirmationDialog();
    }

    _clearStatsConfirm() {
        statistics.init().catch(error => console.error(error));
    }

    _closeConfirmationDialog() {
        let newState = {...this.state};
        newState.confirmationDialog.visible = false;

        this.setState(newState);
    }

    render() {
        return (
            <Container style={styles.container}>
                <Header navigation={this.props.navigation} />
                <Content style={styles.content}>
                    <Heading text="Settings" />
                    <Form>
                        <Item style={{flex: 1, justifyContent: 'space-between', paddingVertical: verticalScale(20)}}>
                            <Label style={styles.grey}>Use Legend Rolls?</Label>
                            <Switch
                                value={this.props.settings.isLegend}
                                onValueChange={() => this.props.setSetting('isLegend', !this.props.settings.isLegend)}
                                thumbColor="#f57e20"
                                trackColor={{true: '#fde5d2', false: '#4f4e4e'}}
                            />
                        </Item>
                        <Item style={{flex: 1, justifyContent: 'space-between', paddingVertical: verticalScale(20)}}>
                            <Label style={styles.grey}>Use Attribute Maxima?</Label>
                            <Switch
                                value={this.props.settings.useMaxima}
                                onValueChange={() => this.props.setSetting('useMaxima', !this.props.settings.useMaxima)}
                                thumbColor="#f57e20"
                                trackColor={{true: '#fde5d2', false: '#4f4e4e'}}
                            />
                        </Item>
                    </Form>
                    <View style={{paddingBottom: 20}} />
                    <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-around'}}>
                        <Button label="Reset" onPress={() => this._reset()} />
                    </View>
                    <Heading text="Statistics" />
                    <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-around'}}>
                        <View style={{flex: 1, justifyContent: 'center', paddingVertical: verticalScale(20)}}>
                            <Label style={[styles.grey, {textAlign: 'center'}]}>
                                All statistics are stored anonymously on your local device and not transmitted or shared in any way.
                            </Label>
                            <Button label="Reset" onPress={() => this._resetStats()} />
                        </View>
                    </View>
                    <View style={{paddingBottom: 20}} />
                    <ConfirmationDialog
                        visible={this.state.confirmationDialog.visible}
                        title={this.state.confirmationDialog.title}
                        info={this.state.confirmationDialog.info}
                        onOk={this.onOk}
                        onClose={this.onClose}
                    />
                </Content>
            </Container>
        );
    }
}

const mapStateToProps = state => {
    return {
        settings: state.settings,
    };
};

const mapDispatchToProps = {
    setSetting,
    resetSettings,
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
