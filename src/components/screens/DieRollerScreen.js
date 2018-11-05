import React, { Component }  from 'react';
import { Platform, StyleSheet, ScrollView, View, TouchableHighlight } from 'react-native';
import { Container, Content, Button, Text, Spinner, Card, CardItem, Body, Icon } from 'native-base';
import Header from '../Header';
import styles from '../../Styles';

export default class DieRollerScreen extends Component {
	render() {
		return (
		  <Container style={styles.container}>
            <Header navigation={this.props.navigation} />
            <Content style={styles.content}>
                <View style={{paddingBottom: 20}} />
            </Content>
	      </Container>
		);
	}
}