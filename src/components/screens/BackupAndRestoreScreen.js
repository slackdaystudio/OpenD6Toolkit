import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet, ScrollView, View, TouchableHighlight, Image, Alert } from 'react-native';
import { Container, Content, Button, Text, Spinner, Card, CardItem, Body, Icon } from 'native-base';
import Header from '../Header';
import Heading from '../Heading';
import LogoButton from '../LogoButton';
import InfoDialog from '../InfoDialog';
import styles from '../../Styles';
import { file } from '../../lib/File';

export default class BackupAndRestoreScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            infoDialog: {
                visible: false,
                title: '',
                info: ''
            }
        };

        this.onBackup = this._onBackup.bind(this);
        this.onRestore = this._onRestore.bind(this);
        this.closeInfoDialog = this._closeInfoDialog.bind(this);
    }

    async _onBackup(location) {
        let result = {
            backupSuccess: false,
            backupName: null
        }

        try {
            result = await file.backup();
        } catch (error) {
            Toast.show({
                text: 'Error: ' + error.message,
                position: 'bottom',
                buttonText: 'OK',
                textStyle: {color: '#fde5d2'},
                buttonTextStyle: { color: '#f57e20' },
                duration: 3000
            });
        } finally {
            if (result.backupSuccess) {
                this.setState({
                    infoDialog: {
                        visible: true,
                        title: 'Backup Succeeded',
                        info: `The backup "${result.backupName}" has been created in your Download directory`
                    }
                });
            } else {
                this.setState({
                    infoDialog: {
                        visible: true,
                        title: 'Backup Failed',
                        info: `The backup failed: ${result.error}`
                    }
                });
            }
        }
    }

    async _onRestore() {
        let result = null;

        try {
            result = await file.restore();
        } catch (error) {
            Toast.show({
                text: 'Error: ' + error.message,
                position: 'bottom',
                buttonText: 'OK',
                textStyle: {color: '#fde5d2'},
                buttonTextStyle: { color: '#f57e20' },
                duration: 3000
            });
        } finally {
            if (result.loadSuccess) {
                this.setState({
                    infoDialog: {
                        visible: true,
                        title: 'Restore Succeeded',
                        info: `The backup "${result.backupName}" has been successfully restored`
                    }
                });
            } else {
                this.setState({
                    infoDialog: {
                        visible: true,
                        title: 'Restore Failed',
                        info: 'The restoration has failed'
                    }
                });
            }
        }
    }

    _closeInfoDialog() {
        let newState = {...this.state}
        newState.infoDialog.visible = false;

        this.setState(newState);
    }

	render() {
		return (
		  <Container style={styles.container}>
            <Header navigation={this.props.navigation} />
            <Content style={styles.content}>
                <Heading text='Backup' />
                <Text style={[styles.grey, {alignSelf: 'center'}]}>Backup all your characters and templates.</Text>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around'}}>
                    <LogoButton label='Backup' onPress={() => this.onBackup()} />
                </View>
                <View style={{paddingBottom: 20}} />
                <Heading text='Restore' />
                <Text style={[styles.grey, {alignSelf: 'center'}]}>Restore all your backed up characters and templates.</Text>
                <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-around'}}>
                    <LogoButton label='Restore' onPress={() => this.onRestore()} />
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