import React, { Component }  from 'react';
import PropTypes from 'prop-types'
import { StyleSheet, View, TouchableHighlight, Switch } from 'react-native';
import { Container, Content, Button, Text, Item, Input, Picker, Form, Label, Icon } from 'native-base';
import Modal from "react-native-modal";
import ErrorMessage from './ErrorMessage';
import Heading from './Heading';
import LogoButton from './LogoButton';
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
            excludeFromBuildCosts: false,
            errorMessage: null
        }

        this.onDelete = this._onDelete.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.item !== null && prevProps.item !== this.props.item) {
            this.setState({
                totalRanks: this.props.item.totalRanks,
                displayNote: this.props.item.displayNote,
                excludeFromBuildCosts: this.props.item.excludeFromBuildCosts
            });
        }
    }

    _updateDisplayNote(value) {
        this.setState({displayNote: value});
    }

    _toggleExcludeFromBuildCosts() {
        this.setState({excludeFromBuildCosts: !this.state.excludeFromBuildCosts});
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
        newItem.excludeFromBuildCosts = this.state.excludeFromBuildCosts;

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
                            name='minus-square'
                            style={[styles.grey, {fontSize: 30, color: '#f57e20', alignItems: 'flex-start'}]}
                            onPress={() => this._decrementRanks()}
                        />
                    </View>
                    <View style={localStyles.row}>
                        <Text style={styles.grey}>{this.state.totalRanks}</Text>
                    </View>
                    <View style={localStyles.row}>
                        <Icon
                            type='FontAwesome'
                            name='plus-square'
                            style={[styles.grey, {fontSize: 30, color: '#f57e20', alignItems: 'flex-end'}]}
                            onPress={() => this._incrementRanks()}
                        />
                    </View>
                </View>
            );
        }

        return null;
    }

    _renderSaveButton() {
        if (this.props.item !== null) {
            return <LogoButton label='Save' onPress={() => this._save()} maxWidth={130} />
        }

        return null;
    }

    _renderDeleteButton() {
        let label = this.props.mode === MODE_EDIT ? 'Delete' : 'Close';
        let action = this.props.mode === MODE_EDIT ? this.onDelete : this.props.onClose;

        if (action === null) {
            action = this.props.onClose;
        }

        return <LogoButton label={label} onPress={() => action()} maxWidth={130} />
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
                        <Item style={{flex: 1, justifyContent: 'space-between'}}>
                            <Label>Exclude from build costs?</Label>
                            <Switch
                                value={this.state.excludeFromBuildCosts}
                                onValueChange={() => this._toggleExcludeFromBuildCosts()}
                                thumbColor='#f57e20'
                                trackColor={{true: '#fde5d2', false: '#4f4e4e'}}
                            />
                        </Item>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around'}}>
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