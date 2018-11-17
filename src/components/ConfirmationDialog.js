import React, { Component }  from 'react';
import PropTypes from 'prop-types'
import { StyleSheet, View, ScrollView } from 'react-native';
import { Container, Content, Button, Text } from 'native-base';
import Modal from "react-native-modal";
import styles from '../Styles';
import Heading from './Heading';

export default class ConfirmationDialog extends Component {
    static propTypes = {
        visible: PropTypes.bool.isRequired,
        title: PropTypes.string.isRequired,
        info: PropTypes.string.isRequired,
        onOk: PropTypes.func.isRequired,
        onClose: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            scrollOffset: 0
        }
    }

    _handleOnScroll = event => {
        this.setState({
            scrollOffset: event.nativeEvent.contentOffset.y
        });
    };

    _handleScrollTo = p => {
        if (this.scrollViewRef) {
            this.scrollViewRef.scrollTo(p);
        }
    }

	render() {
        return (
            <Modal
                isVisible={this.props.visible}
                onBackButtonPress={() => this.props.onClose()}
                onBackdropPress={() => this.props.onClose()}
                scrollTo={this._handleScrollTo}
                scrollOffsetMax={300 - 200}
            >
                <View style={styles.modal}>
                    <Heading text={this.props.title} />
                    <View style={[styles.modalContent, {minHeight: 170}]}>
                        <ScrollView
                            ref={ref => (this.scrollViewRef = ref)}
                            onScroll={this._handleOnScroll}
                            scrollEventThrottle={16}
                        >
                            <Text style={styles.grey}>{this.props.info}</Text>
                        </ScrollView>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around'}}>
                            <View style={[styles.buttonContainer, {paddingRight: 5}]}>
                                <Button style={styles.button} onPress={() => this.props.onOk()}>
                                    <Text uppercase={false} style={styles.buttonText}>OK</Text>
                                </Button>
                            </View>
                            <View style={[styles.buttonContainer, {paddingLeft: 5}]}>
                                <Button style={styles.button} onPress={() => this.props.onClose()}>
                                    <Text uppercase={false} style={styles.buttonText}>Cancel</Text>
                                </Button>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        );
	}
}
