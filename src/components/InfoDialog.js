import React, { Component }  from 'react';
import PropTypes from 'prop-types'
import { StyleSheet, View, ScrollView } from 'react-native';
import { Container, Content, Button, Text } from 'native-base';
import { verticalScale } from 'react-native-size-matters';
import Modal from "react-native-modal";
import Heading from './Heading';
import LogoButton from './LogoButton';
import styles from '../Styles';

export default class InfoDialog extends Component {
    static propTypes = {
        visible: PropTypes.bool.isRequired,
        title: PropTypes.string.isRequired,
        info: PropTypes.string.isRequired,
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
                    <View style={[styles.modalContent, {minHeight: verticalScale(170)}]}>
                        <ScrollView
                            style={{maxHeight: verticalScale(165)}}
                            ref={ref => (this.scrollViewRef = ref)}
                            onScroll={this._handleOnScroll}
                            scrollEventThrottle={16}
                        >
                            <Text style={styles.grey}>{this.props.info}</Text>
                        </ScrollView>
                        <LogoButton label='Close' onPress={() => this.props.onClose()} />
                    </View>
                </View>
            </Modal>
        );
	}
}
