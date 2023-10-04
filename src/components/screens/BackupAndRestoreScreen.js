import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {BackHandler, Platform, StyleSheet, ScrollView, View, TouchableHighlight, Image, Alert} from 'react-native';
import {Container, Content, Button, Text, Spinner, Card, CardItem, Body, Icon} from 'native-base';
import {Header} from '../Header';
import Heading from '../Heading';
import LogoButton from '../LogoButton';
import InfoDialog from '../InfoDialog';
import styles from '../../Styles';
import {file} from '../../lib/File';
import {clearLoadedCharacter} from '../../reducers/builder';

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

class BackupAndRestoreScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        clearLoadedCharacter: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            infoDialog: {
                visible: false,
                title: '',
                info: '',
            },
        };

        this.onBackup = this._onBackup.bind(this);
        this.onRestore = this._onRestore.bind(this);
        this.closeInfoDialog = this._closeInfoDialog.bind(this);
    }

    async _onBackup(location) {
        let result = await file.backup();

        if (result.backupSuccess) {
            this.setState({
                infoDialog: {
                    visible: true,
                    title: 'Backup Succeeded',
                    info: `The backup "${result.backupName}" has been created in your ${result.backupFolder} directory`,
                },
            });
        } else {
            this.setState({
                infoDialog: {
                    visible: true,
                    title: 'Backup Failed',
                    info: `The backup failed: ${result.error}`,
                },
            });
        }
    }

    async _onRestore() {
        let result = await file.restore();

        if (result.loadSuccess) {
            this.props.clearLoadedCharacter();

            this.setState({
                infoDialog: {
                    visible: true,
                    title: 'Restore Succeeded',
                    info: `The backup "${result.backupName}" has been successfully restored`,
                },
            });
        } else if (!result.cancelled) {
            this.setState({
                infoDialog: {
                    visible: true,
                    title: 'Restore Failed',
                    info: `The restoration failed: ${result.error}`,
                },
            });
        }
    }

    _closeInfoDialog() {
        let newState = {...this.state};
        newState.infoDialog.visible = false;

        this.setState(newState);
    }

    render() {
        return (
            <Container style={styles.container}>
                <Header navigation={this.props.navigation} />
                <Content style={styles.content}>
                    <Heading text="Backup" onBackButtonPress={() => this.props.navigation.navigate('Home')} />
                    <Text style={[styles.grey, {alignSelf: 'center'}]}>Backup all your characters and templates.</Text>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around'}}>
                        <LogoButton label="Backup" onPress={() => this.onBackup()} />
                    </View>
                    <View style={{paddingBottom: 20}} />
                    <Heading text="Restore" />
                    <Text style={[styles.grey, {alignSelf: 'center'}]}>Restore all your backed up characters and templates.</Text>
                    <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-around'}}>
                        <LogoButton label="Restore" onPress={() => this.onRestore()} />
                    </View>
                    <View style={{paddingBottom: 20}} />
                    <InfoDialog
                        visible={this.state.infoDialog.visible}
                        title={this.state.infoDialog.title}
                        info={this.state.infoDialog.info}
                        onClose={this.closeInfoDialog}
                    />
                </Content>
            </Container>
        );
    }
}

const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = {
    clearLoadedCharacter,
};

export default connect(mapStateToProps, mapDispatchToProps)(BackupAndRestoreScreen);
