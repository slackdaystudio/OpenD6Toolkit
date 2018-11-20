import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { View, Image } from 'react-native';
import { Button, Text } from 'native-base';
import styles from '../Styles';

export default class LogoButton extends Component {
    static propTypes = {
        label: PropTypes.string.isRequired,
        onPress: PropTypes.func.isRequired,
        showLogo: PropTypes.bool,
        maxWidth: PropTypes.number
    }

    _renderLogo() {
        if (this.props.showLogo) {
            return (
               <View style={{flex: 1}}>
                    <Image source={require('../../public/d6_logo_White_30x30.png')}/>
                </View>
            )
        }

        return null;
    }

	render() {
		return (
            <View style={styles.buttonContainer}>
                <Button style={[styles.button, {maxWidth: this.props.maxWidth === null ? 170 : this.props.maxWidth}]} onPress={() => this.props.onPress()}>
                    {this._renderLogo()}
                    <Text uppercase={false} style={styles.buttonText}>{this.props.label}</Text>
                </Button>
            </View>
		);
	}
}

LogoButton.defaultProps = {
    showLogo: true,
    maxWidth: null
};