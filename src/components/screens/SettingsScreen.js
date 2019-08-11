import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Alert, BackHandler, Platform, StyleSheet, ScrollView, View, Switch } from 'react-native';
import { Container, Content, Button, Text, Form, Item, Label } from 'native-base';
import { verticalScale } from 'react-native-size-matters';
import Header from '../Header';
import Heading from '../Heading';
import LogoButton from '../LogoButton';
import ConfirmationDialog from '../ConfirmationDialog';
import styles from '../../Styles';
import { settings as appSettings } from '../../lib/Settings';
import { setSetting, resetSettings } from '../../reducers/settings';

class SettingsScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        settings: PropTypes.object.isRequired,
        setSetting: PropTypes.func.isRequired,
        resetSettings: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            confirmationDialog: {
                visible: false,
                title: 'Reset Settings?',
                info: 'Are you certain you wish to reset all your settings to default?'
            }
        };

        this.onClose = this._closeConfirmationDialog.bind(this);
        this.onOk = this._resetConfirmed.bind(this);
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.navigate('Home');

            return true;
        });
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }

    _reset(attribute) {
        let newState = {...this.state};
        newState.confirmationDialog.visible = true;

        this.setState(newState);
    }

    _resetConfirmed() {
        this.props.resetSettings();

        this._closeConfirmationDialog()
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
                <Heading text='Settings' onBackButtonPress={() => this.props.navigation.navigate('Home')} />
                <Form>
                    <Item style={{flex: 1, justifyContent: 'space-between', paddingVertical: verticalScale(20)}}>
                        <Label style={styles.grey}>Use Legend Rolls?</Label>
                        <Switch
                            value={this.props.settings.isLegend}
                            onValueChange={() => this.props.setSetting('isLegend', !this.props.settings.isLegend)}
                            thumbColor='#f57e20'
                            trackColor={{true: '#fde5d2', false: '#4f4e4e'}}
                        />
                    </Item>
                    <Item style={{flex: 1, justifyContent: 'space-between', paddingVertical: verticalScale(20)}}>
                        <Label style={styles.grey}>Use Attribute Maxima?</Label>
                        <Switch
                            value={this.props.settings.useMaxima}
                            onValueChange={() => this.props.setSetting('useMaxima', !this.props.settings.useMaxima)}
                            thumbColor='#f57e20'
                            trackColor={{true: '#fde5d2', false: '#4f4e4e'}}
                        />
                    </Item>
                </Form>
                <View style={{paddingBottom: 20}} />
                <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-around'}}>
                    <LogoButton label='Reset' onPress={() => this._reset()} />
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

const localStyles = StyleSheet.create({
	row: {
	    flex: 1,
	    alignSelf: 'center',
	    alignItems:'center',
	    justifyContent: 'flex-end'
	}
});

const mapStateToProps = state => {
    return {
        settings: state.settings
    };
}

const mapDispatchToProps = {
    setSetting,
    resetSettings
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
