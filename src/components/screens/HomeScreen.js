import React, { Component }  from 'react';
import PropTypes from 'prop-types'
import { Platform, StyleSheet, ScrollView, View, TouchableHighlight } from 'react-native';
import { Container, Content, Button, Text, Spinner, Card, CardItem, Body, Icon } from 'native-base';
import Header from '../Header';
import styles from '../../Styles';

export default class HomeScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired
    }

	render() {
		return (
		  <Container style={styles.container}>
            <Header navigation={this.props.navigation} />
            <Content style={styles.content}>
                <Text style={styles.heading}>Roller</Text>
                <Text style={styles.grey}>Use the die roller to resolve actions in OpenD6.</Text>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around'}}>
                    <View style={styles.buttonContainer}>
                        <Button style={styles.button} onPress={() => this.props.navigation.navigate('DieRoller')}>
                            <Text uppercase={false} style={styles.buttonText}>Roller</Text>
                        </Button>
                    </View>
                </View>
                <Text style={styles.heading}>Builder</Text>
                <Text style={styles.grey}>Build a character using the OpenD6 game rules.</Text>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around'}}>
                    <View style={styles.buttonContainer}>
                        <Button style={styles.button} onPress={() => this.props.navigation.navigate('Builder')}>
                            <Text uppercase={false} style={styles.buttonText}>Builder</Text>
                        </Button>
                    </View>
                </View>
                <View style={{paddingBottom: 20}} />
            </Content>
	      </Container>
		);
	}
}