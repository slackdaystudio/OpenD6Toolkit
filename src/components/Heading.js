import React, { Component }  from 'react';
import PropTypes from 'prop-types'
import { Platform, StyleSheet, View, Image, TouchableHighlight } from 'react-native';
import { Button, Text, Header, Left, Right, Icon } from 'native-base';
import styles from '../Styles';

export default class Heading extends Component {
    static propTypes = {
        text: PropTypes.string.isRequired
    }

	render() {
		return (
            <View style={{flex: 1, backgroundColor: '#fde5d2'}}>
                <Text style={styles.heading}>{this.props.text}</Text>
            </View>
		);
	}
}