import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Platform, StyleSheet, ScrollView, View, TouchableHighlight } from 'react-native';
import { Container, Content, Button, Text, Spinner, Card, CardItem, Body, Icon } from 'native-base';
import Header from '../Header';
import Heading from '../Heading';
import styles from '../../Styles';
import { file } from '../../lib/File';

class HomeScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        character: PropTypes.object
    }

    _onBuilderPress() {
        if (this.props.character == null || this.props.character.template == null) {
            this.props.navigation.navigate('TemplateSelect');
        } else {
            this.props.navigation.navigate('Builder');
        }
    }

    _onTemplateUploadPress() {
        file.loadGameTemplate(() => {}, () => {});
    }

	render() {
		return (
		  <Container style={styles.container}>
            <Header navigation={this.props.navigation} />
            <Content style={styles.content}>
                <Heading text='Roller' />
                <Text style={[styles.grey, {alignSelf: 'center'}]}>Use the die roller to resolve actions in OpenD6.</Text>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around'}}>
                    <View style={styles.buttonContainer}>
                        <Button style={styles.button} onPress={() => this.props.navigation.navigate('DieRoller')}>
                            <Text uppercase={false} style={styles.buttonText}>Roller</Text>
                        </Button>
                    </View>
                </View>
                <Heading text='Builder' />
                <Text style={[styles.grey, {alignSelf: 'center'}]}>Build a character using the OpenD6 game rules.</Text>
                <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-around'}}>
                    <View style={styles.buttonContainer}>
                        <Button style={styles.button} onPress={() => this._onBuilderPress()}>
                            <Text uppercase={false} style={styles.buttonText}>Builder</Text>
                        </Button>
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button style={styles.button} onPress={() => this.props.navigation.navigate('LoadCharacter')}>
                            <Text uppercase={false} style={styles.buttonText}>Load</Text>
                        </Button>
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button style={styles.button} onPress={() => this.props.navigation.navigate('TemplateSelect')}>
                            <Text uppercase={false} style={styles.buttonText}>New</Text>
                        </Button>
                    </View>
                </View>
                <Heading text='Templates' />
                <Text style={[styles.grey, {alignSelf: 'center'}]}>Upload a game template to use to build a character.</Text>
                <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-around'}}>
                    <View style={styles.buttonContainer}>
                        <Button style={styles.button} onPress={() => this._onTemplateUploadPress()}>
                            <Text uppercase={false} style={styles.buttonText}>Upload</Text>
                        </Button>
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button style={styles.button} onPress={() => this.props.navigation.navigate('TemplateDelete')}>
                            <Text uppercase={false} style={styles.buttonText}>Delete</Text>
                        </Button>
                    </View>
                </View>
                <View style={{paddingBottom: 20}} />
            </Content>
	      </Container>
		);
	}
}

const mapStateToProps = state => {
    return {
        character: state.builder.character
    };
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);