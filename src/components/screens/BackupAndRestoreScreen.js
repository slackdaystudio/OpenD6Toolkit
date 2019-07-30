import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet, ScrollView, View, TouchableHighlight, Image } from 'react-native';
import { Container, Content, Button, Text, Spinner, Card, CardItem, Body, Icon } from 'native-base';
import Header from '../Header';
import Heading from '../Heading';
import LogoButton from '../LogoButton';
import styles from '../../Styles';
import { file } from '../../lib/File';

export default class BackupAndRestoreScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);

        this.onBackup = this._onBackup.bind(this);
        this.onRestore = this._onRestore.bind(this);
    }

    _onBackup(location) {
        if (Platform.OS === 'android') {
            file.backup();
        }
    }

    _onRestore() {
        return null;
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
            </Content>
	      </Container>
		);
	}
}