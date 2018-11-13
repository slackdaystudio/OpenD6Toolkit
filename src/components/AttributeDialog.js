import React, { Component }  from 'react';
import PropTypes from 'prop-types'
import { StyleSheet, View, TouchableHighlight } from 'react-native';
import { Container, Content, Button, Text, Item, Input, Picker, Form, Label } from 'native-base';
import Modal from "react-native-modal";
import ErrorMessage from './ErrorMessage';
import styles from '../Styles';

export default class AttributeDialog extends Component {
    static propTypes = {
        visible: PropTypes.bool.isRequired,
        identifier: PropTypes.string.isRequired,
        dice: PropTypes.string,
        modifierDice: PropTypes.string,
        pips: PropTypes.number,
        modifierPips: PropTypes.number,
        errorMessage: PropTypes.string,
        close: PropTypes.func,
        onSave: PropTypes.func,
        onUpdateDice: PropTypes.func,
        onUpdateModifierDice: PropTypes.func,
        onUpdatePips: PropTypes.func,
        onUpdateModifierPips: PropTypes.func
    }

    constructor(props) {
        super(props);

        this.state = {
            dice: props.dice,
            modifierDice: props.modifierDice,
            pips: props.pips
        }
    }

    _renderEditDieCode() {
        return (
            <View style={localStyles.modalContent}>
                <Text style={[styles.heading, {paddingTop: 0}]}>Edit {this.props.identifier}</Text>
                <ErrorMessage errorMessage={this.props.errorMessage} />
                <View style={localStyles.rowStart}>
                    <View style={localStyles.row}>
                        <Text style={styles.grey}>Base</Text>
                    </View>
                    <View style={localStyles.row}>
                        <Item underline>
                            <Input
                                style={styles.grey}
                                keyboardType='numeric'
                                maxLength={2}
                                value={this.props.dice}
                                onChangeText={(value) => this.props.onUpdateDice(value)}
                            />
                        </Item>
                    </View>
                    <View style={localStyles.row, {flex: 2}}>
                        <Picker
                            inlinelabel
                            label='Pips'
                            style={styles.grey}
                            textStyle={styles.grey}
                            placeholderIconColor="#FFFFFF"
                            iosHeader="Select one"
                            mode="dropdown"
                            selectedValue={this.props.pips}
                            onValueChange={(value) => this.props.onUpdatePips(value)}
                        >
                            <Item label="+0 pips" value={0} />
                            <Item label="+1 pip" value={1} />
                            <Item label="+2 pips" value={2} />
                        </Picker>
                    </View>
                </View>
                <View style={localStyles.rowStart}>
                    <View style={localStyles.row}>
                        <Text style={styles.grey}>Modifier</Text>
                    </View>
                    <View style={localStyles.row}>
                        <Item underline>
                            <Input
                                underline
                                style={styles.grey}
                                keyboardType='numeric'
                                maxLength={3}
                                value={this.props.modifierDice}
                                onChangeText={(value) => this.props.onUpdateModifierDice(value)}
                            />
                        </Item>
                    </View>
                    <View style={localStyles.row, {flex: 2}}>
                        <Picker
                            inlinelabel
                            label='modifier Pips'
                            style={styles.grey}
                            textStyle={styles.grey}
                            placeholderIconColor="#FFFFFF"
                            iosHeader="Select one"
                            mode="dropdown"
                            selectedValue={this.props.modifierPips}
                            onValueChange={(value) => this.props.onUpdateModifierPips(value)}
                        >
                            <Item label="-2 pips" value={-2} />
                            <Item label="-1 pips" value={-1} />
                            <Item label="+0 pips" value={0} />
                            <Item label="+1 pip" value={1} />
                            <Item label="+2 pips" value={2} />
                        </Picker>
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    <Button block style={styles.button} onPress={() => this.props.onSave(this.props.identifier)}>
                        <Text uppercase={false}>Save</Text>
                    </Button>
                </View>
            </View>
        );
    }

	render() {
        return (
            <Modal
                isVisible={this.props.visible}
                swipeDirection={'right'}
                onSwipe={() => this.props.close()}
                onBackButtonPress={() => this.props.close()}
                onBackdropPress={() => this.props.close()}
            >
                {this._renderEditDieCode()}
            </Modal>
        );
	}
}

const localStyles = StyleSheet.create({
	rowStart: {
        flex: 1,
        alignSelf: 'stretch',
        flexDirection: 'row'
	},
	row: {
	    flex: 1,
	    alignSelf: 'center',
	},
	modalContent: {
        backgroundColor: '#111111',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#1e1e1e',
        minHeight: 300
    },
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
