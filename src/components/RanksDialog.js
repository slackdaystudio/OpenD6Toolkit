import React, { Component }  from 'react';
import PropTypes from 'prop-types'
import { StyleSheet, View, TouchableHighlight } from 'react-native';
import { Container, Content, Button, Text, Item, Input, Picker, Form, Label, Icon } from 'native-base';
import Modal from "react-native-modal";
import ErrorMessage from './ErrorMessage';
import styles from '../Styles';

export const MODE_ADD = 'ADD';

export const MODE_EDIT = 'EDIT';

export default class RanksDialog extends Component {
    static propTypes = {
        visible: PropTypes.bool.isRequired,
        title: PropTypes.string,
        mode: PropTypes.string.isRequired,
        onSave: PropTypes.func.isRequired,
        onClose: PropTypes.func.isRequired,
        onDelete: PropTypes.func
    }

    constructor(props) {
        super(props);

        this.state = {
            totalRanks: 1,
            errorMessage: null
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.item !== null && prevProps.item !== this.props.item) {
            this.setState({totalRanks: this.props.item.totalRanks});
        }
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
        this.props.item.totalRanks = this.state.totalRanks;

        this.props.onSave(this.props.item);
        this.props.onClose();
    }

    _renderFormControls() {
        if (this.props.item !== null && this.props.item.multipleRanks) {
            return (
                <View style={localStyles.rowStart}>
                    <View style={localStyles.row}>
                        <Icon
                            type='FontAwesome'
                            name='plus-square'
                            style={[styles.grey, {fontSize: 30, color: '#00ACED', alignItems: 'flex-end'}]}
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
                            style={[styles.grey, {fontSize: 30, color: '#00ACED', alignItems: 'flex-start'}]}
                            onPress={() => this._decrementRanks()}
                        />
                    </View>
                </View>
            );
        }

        return null;
    }

    _renderSaveButton() {
        if (this.props.item !== null && this.props.item.multipleRanks) {
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
        let action = this.props.mode === MODE_EDIT ? this.props.onDelete : this.props.onClose;

        if (action === null) {
            action = this.props.onClose;
        }

        return (
            <View style={[styles.buttonContainer, styles.row]}>
                <Button block style={styles.modalButton} onPress={() => action(this.props.item)}>
                    <Text uppercase={false}>{label}</Text>
                </Button>
            </View>
        );
    }

    _renderRankSelector() {
        return (
            <View style={localStyles.modalContent}>
                <Text style={[styles.heading, {paddingTop: 0}]}>
                    {this.props.item === null ? 'Select Rank' : this.props.item.name}
                </Text>
                <ErrorMessage errorMessage={this.state.errorMessage} />
                {this._renderFormControls()}
                <View style={localStyles.rowStart}>
                    {this._renderSaveButton()}
                    {this._renderDeleteButton()}
                </View>
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
                {this._renderRankSelector()}
            </Modal>
        );
	}
}

const localStyles = StyleSheet.create({
	rowStart: {
        flex: 1,
        alignItems:'center',
        justifyContent:'center',
        flexDirection: 'row'
	},
	row: {
	    flex: 1,
	    alignSelf: 'center',
	    alignItems:'center',
	    justifyContent: 'flex-end'
	},
	modalContent: {
        backgroundColor: '#111111',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#1e1e1e',
        minHeight: 200
    }
});
