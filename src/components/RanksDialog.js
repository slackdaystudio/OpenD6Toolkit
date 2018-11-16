import React, { Component }  from 'react';
import PropTypes from 'prop-types'
import { StyleSheet, View, TouchableHighlight } from 'react-native';
import { Container, Content, Button, Text, Item, Input, Picker, Form, Label, Icon } from 'native-base';
import Modal from "react-native-modal";
import ErrorMessage from './ErrorMessage';
import Heading from './Heading';
import styles from '../Styles';

export const MODE_ADD = 'ADD';

export const MODE_EDIT = 'EDIT';

export default class RanksDialog extends Component {
    static propTypes = {
        visible: PropTypes.bool.isRequired,
        optionKey: PropTypes.string.isRequired,
        item: PropTypes.object,
        mode: PropTypes.string.isRequired,
        onSave: PropTypes.func.isRequired,
        onClose: PropTypes.func.isRequired,
        onDelete: PropTypes.func
    }

    constructor(props) {
        super(props);

        this.state = {
            totalRanks: 1,
            displayNote: '',
            errorMessage: null
        }

        this.onDelete = this._onDelete.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.item !== null && prevProps.item !== this.props.item) {
            this.setState({
                totalRanks: this.props.item.totalRanks,
                displayNote: this.props.item.displayNote
            });
        }
    }

    _updateDisplayNote(value) {
        this.setState({displayNote: value});
    }

    _incrementRanks() {
        let newRanks = this.state.totalRanks + 1;

        this.setState({
            totalRanks: newRanks,
            errorMessage: null
        });
    }

    _decrementRanks() {
        let newRanks = this.state.totalRanks - 1;

        if (newRanks < 1) {
            this.setState({errorMessage: 'Ranks may not be less than 1'});
        } else {
            this.setState({totalRanks: newRanks});
        }
    }

    _save() {
        let newItem = {...this.props.item}
        newItem.totalRanks = this.state.totalRanks;
        newItem.displayNote = this.state.displayNote;

        this.props.onSave(this.props.optionKey, newItem);
        this.props.onClose();
    }

    _onDelete() {
        this.props.onDelete(this.props.optionKey, this.props.item);
    }

    _renderFormControls() {
        if (this.props.item !== null && this.props.item.multipleRanks) {
            return (
                <View style={styles.rowStart}>
                    <View style={localStyles.row}>
                        <Icon
                            type='FontAwesome'
                            name='plus-square'
                            style={[styles.grey, {fontSize: 30, color: '#f57e20', alignItems: 'flex-end'}]}
                            onPress={() => this._incrementRanks()}
                        />
                    </View>
                    <View style={localStyles.row}>
                        <Text style={styles.grey}>{this.state.totalRanks}</Text>
                    </View>
                    <View style={localStyles.row}>
                        <Icon
                            type='FontAwesome'
                            name='minus-square'
                            style={[styles.grey, {fontSize: 30, color: '#f57e20', alignItems: 'flex-start'}]}
                            onPress={() => this._decrementRanks()}
                        />
                    </View>
                </View>
            );
        }

        return null;
    }

    _renderSaveButton() {
        if (this.props.item !== null) {
            return (
                <View style={[styles.buttonContainer, styles.row]}>
                    <Button block style={styles.modalButton} onPress={() => this._save()}>
                        <Text uppercase={false}>Save</Text>
                    </Button>
                </View>
            );
        }

        return null;
    }

    _renderDeleteButton() {
        let label = this.props.mode === MODE_EDIT ? 'Delete' : 'Close';
        let action = this.props.mode === MODE_EDIT ? this.onDelete : this.props.onClose;

        if (action === null) {
            action = this.props.onClose;
        }

        return (
            <View style={[styles.buttonContainer, styles.row]}>
                <Button block style={styles.modalButton} onPress={() => action()}>
                    <Text uppercase={false}>{label}</Text>
                </Button>
            </View>
        );
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
                <View style={styles.modal}>
                    <Heading text={this.props.item === null ? 'Select Rank' : this.props.item.name} />
                    <View style={styles.modalContent}>
                        <ErrorMessage errorMessage={this.state.errorMessage} />
                        <Item stackedLabel>
                            <Label>Note</Label>
                            <Input
                                style={[styles.grey, {maxWidth: 250}]}
                                maxLength={30}
                                value={this.state.displayNote}
                                onChangeText={(value) => this._updateDisplayNote(value)}
                            />
                        </Item>
                        {this._renderFormControls()}
                        <View style={styles.rowStart}>
                            {this._renderSaveButton()}
                            {this._renderDeleteButton()}
                        </View>
                    </View>
                </View>
            </Modal>
        );
	}
}

const localStyles = StyleSheet.create({
	row: {
	    flex: 1,
	    alignSelf: 'center',
	    alignItems:'center',
	    justifyContent: 'flex-end'
	}
});