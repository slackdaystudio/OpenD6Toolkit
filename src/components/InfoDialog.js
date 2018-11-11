import React, { Component }  from 'react';
import PropTypes from 'prop-types'
import { StyleSheet, View } from 'react-native';
import { Container, Content, Button, Text } from 'native-base';
import Modal from "react-native-modal";
import styles from '../Styles';

export default class InfoDialog extends Component {
    static propTypes = {
        visible: PropTypes.bool.isRequired,
        identifier: PropTypes.string.isRequired,
        info: PropTypes.string.isRequired,
        onClose: PropTypes.func.isRequired
    }

	render() {
        return (
            <Modal
                isVisible={this.props.visible}
                swipeDirection={'right'}
                onSwipe={() => this.props.onClose()}
                onBackButtonPress={() => this.props.onClose()}
                onBackdropPress={() => this.props.onClose()}
            >
                <View style={localStyles.modalContent}>
                    <Text style={[styles.heading, {paddingTop: 0}]}>{this.props.identifier}</Text>
                    <Text style={styles.grey}>{this.props.info}</Text>
                    <View style={styles.buttonContainer}>
                        <Button block style={styles.button} onPress={() => this.props.onClose()}>
                            <Text uppercase={false}>Close</Text>
                        </Button>
                    </View>
                </View>
            </Modal>
        );
	}
}

const localStyles = StyleSheet.create({
	modalContent: {
        backgroundColor: '#111111',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#1e1e1e',
        minHeight: 300
    }
});
