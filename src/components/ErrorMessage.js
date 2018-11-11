import React, { Component }  from 'react';
import PropTypes from 'prop-types'
import { StyleSheet, View, } from 'react-native';
import { Text} from 'native-base';
import styles from '../Styles';

export default class AttributeDialog extends Component {
    static propTypes = {
        errorMessage: PropTypes.string
    }

	render() {
        if (this.props.errorMessage === null) {
            return null;
        }

        return (
            <View style={localStyles.errorMessage}>
                <Text style={{color: '#bc1212', alignSelf: 'center'}}>{this.props.errorMessage}</Text>
            </View>
        );
	}
}

const localStyles = StyleSheet.create({
    errorMessage: {
        borderWidth: 1,
        borderRadius: 4,
        borderColor: '#bc1212',
        backgroundColor: '#e8b9b9',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
        fontSize: 20,
        lineHeight: 25
    }
});
