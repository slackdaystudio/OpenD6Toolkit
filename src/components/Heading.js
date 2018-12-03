import React, { Component }  from 'react';
import PropTypes from 'prop-types'
import { Platform, StyleSheet, View, Image, TouchableHighlight } from 'react-native';
import { Button, Text, Header, Left, Right, Icon } from 'native-base';
import styles from '../Styles';

export default class Heading extends Component {
    static propTypes = {
        text: PropTypes.string.isRequired,
        onAddButtonPress: PropTypes.func,
        onBackButtonPress: PropTypes.func
    }

    _renderAddButton() {
        if (typeof this.props.onAddButtonPress === 'function') {
            return (
                <View style={{flex: 1, paddingTop: 3, justifyContent: 'space-around', alignItems: 'center'}}>
                    <Icon
                        type='FontAwesome'
                        name='plus-circle'
                        style={[styles.grey, {fontSize: 30, color: '#f57e20'}]}
                        onPress={() => this.props.onAddButtonPress()}
                    />
                </View>
            );
        }

        return <View style={{flex: 1}} />
    }

    _renderBackButton() {
        if (typeof this.props.onBackButtonPress === 'function') {
            return (
                <View style={{flex: 1, paddingTop: 3, justifyContent: 'space-around', alignItems: 'center'}}>
                    <Icon
                        type='FontAwesome'
                        name='arrow-circle-left'
                        style={[styles.grey, {fontSize: 30, color: '#f57e20'}]}
                        onPress={() => this.props.onBackButtonPress()}
                    />
                </View>
            );
        }

        return <View style={{flex: 1}} />
    }

	render() {
	    if (typeof this.props.onAddButtonPress === 'function' || typeof this.props.onBackButtonPress === 'function') {
	        return (
                <View style={[styles.rowStart, {backgroundColor: '#fde5d2', maxHeight: 53}]}>
                    {this._renderBackButton()}
                    <View style={{flex: 4, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={styles.heading}>{this.props.text}</Text>
                    </View>
                    {this._renderAddButton()}
                </View>
            );
	    }

		return (
            <View style={{flex: 1, backgroundColor: '#fde5d2', maxHeight: 53}}>
                <Text style={styles.heading}>{this.props.text}</Text>
            </View>
		);
	}
}