import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Platform, StyleSheet, View, TouchableHighlight, BackHandler, Alert } from 'react-native';
import { Container, Content, Button, Text, Spinner, Card, CardItem, Left, Right, Body, Item, Icon, Input, Label, Toast } from 'native-base';
import { ScaledSheet, scale, verticalScale } from 'react-native-size-matters';
import Header from '../Header';
import Heading from '../Heading';
import ConfirmationDialog from '../ConfirmationDialog';
import styles from '../../Styles';
import { character, OPTION_ADVANTAGES, OPTION_COMPLICATIONS } from '../../lib/Character';
import { common } from '../../lib/Common';
import { addTemplateOption, deleteTemplateOption } from '../../reducers/architect';

const BACK_BUTTON_START_DIFF = 9;

class Options extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        optionKey: PropTypes.string.isRequired,
        template: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);

        const optionKey = props.optionKey;
        const options = props.template[common.toCamelCase(optionKey)];
        const displayOptions =  this._initOptionsShow(options);

        this.state = {
            options: options,
            optionShow: displayOptions.optionsState,
            optionChevron: displayOptions.chevronsState,
            optionKey: optionKey,
            search: {
                term: '',
                results: options
            },
            pagination: {
                currentPage: 1,
                itemsPerPage: 10,
                startOnItem: 1,
                totalPages: Math.ceil(options.length / 10)
            },
            confirmationDialog: {
                visible: false,
                title: 'Delete Option',
                info: 'This is permanent, are you certain you want to delete this option?'
            }
        };

        this.onClose = this._closeConfirmationDialog.bind(this);
        this.onOk = this._deleteConfirmed.bind(this);
    }

    _initOptionsShow(options) {
        let optionsState = {};
        let chevronsState = {}

        options.map((option, index) => {
            optionsState[option.name + option.rank] = false;
            chevronsState[option.name + option.rank] = 'chevron-circle-down';
        });

        return {
            optionsState: optionsState,
            chevronsState: chevronsState
        };
    }

    _delete(option) {
        let newState = {...this.state};
        newState.confirmationDialog.visible = true;
        newState.toBeDeleted = option;

        this.setState(newState);
    }

    _deleteConfirmed() {
        this.props.deleteTemplateOption(common.toCamelCase(this.state.optionKey), this.state.toBeDeleted);

        let newState = {...this.state};
        newState.toBeDeleted = null;

        this.setState(newState, () => {
            this._closeConfirmationDialog();
        });
    }

    _closeConfirmationDialog() {
        let newState = {...this.state};
        newState.confirmationDialog.visible = false;

        this.setState(newState);
    }

    _toggleDescriptionShow(name, rank) {
        let newState = {...this.state};
        newState.optionShow[name + rank] = !newState.optionShow[name + rank];
        newState.optionChevron[name + rank] = newState.optionChevron[name + rank] === 'chevron-circle-down' ? 'chevron-circle-up' : 'chevron-circle-down';

        this.setState(newState);
    }

    _search(term) {
        let newState = {...this.state};
        let results = [];

        if (term.length >= 2) {
            for (let option of newState.options) {
                if (RegExp(term, 'gi').test(option.name) || RegExp(term, 'gi').test(option.description)) {
                    results.push(option);
                }
            }

            newState.search.results = results;
        } else {
            newState.search.results = newState.options;
        }

        newState.search.term = term;
        newState.pagination.totalPages = Math.ceil(newState.search.results.length / newState.pagination.itemsPerPage);

        if (newState.pagination.currentPage > newState.pagination.totalPages) {
            newState.pagination.currentPage = newState.pagination.totalPages > 0 ? newState.pagination.totalPages : 1;
            newState.pagination.startOnItem = newState.pagination.itemsPerPage * newState.pagination.currentPage - BACK_BUTTON_START_DIFF;
        }

        this.setState(newState);
    }

    _onBackButtonPress() {
        if (this.state.pagination.currentPage === 1) {
            return;
        }

        let newState = {...this.state};
        newState.pagination.currentPage--;
        newState.pagination.startOnItem = newState.pagination.itemsPerPage * newState.pagination.currentPage - BACK_BUTTON_START_DIFF;

        this.setState(newState);
    }

    _onNextButtonPress() {
        if (this.state.pagination.currentPage === this.state.pagination.totalPages) {
            return;
        }

        let newState = {...this.state};

        newState.pagination.startOnItem = newState.pagination.itemsPerPage * newState.pagination.currentPage + 1;
        newState.pagination.currentPage++;

        this.setState(newState);
    }

    _onAddButtonPress() {
        this.props.addTemplateOption(common.toCamelCase(this.state.optionKey));

        this.props.navigation.navigate('EditOption', {
            optionKey: this.state.optionKey,
            option: this.state.options[this.state.options.length - 1]
        });
    }

    _renderDescription(item) {
        let description = item.description;

        if (this.state.optionShow[item.name + item.rank]) {
            return description;
        }

        return description.length > 100 ? description.substring(0, 97) + '...' : description;
    }

    _renderFilterMessage() {
        if (this.state.options.length != this.state.search.results.length) {
            return (
                <View style={{paddingTop: 20}}>
                    <Text style={styles.grey}>
                        Showing {this.state.search.results.length} of {this.state.options.length} {this.state.optionKey}
                    </Text>
                </View>
            );
        }

        return null;
    }

    _renderBackButton() {
        if (this.state.pagination.currentPage === 1) {
            return <View style={{width: 75}} />;
        }

        return (
            <Icon
                type='FontAwesome'
                name='chevron-circle-left'
                style={[localStyles.buttonBig, {paddingLeft: scale(30)}]}
                onPress={() => this._onBackButtonPress()}
            />
        );
    }

    _renderNextButton() {
        if (this.state.pagination.currentPage === this.state.pagination.totalPages) {
            return <View style={{width: 75}} />;
        }

        return (
            <Icon
                type='FontAwesome'
                name='chevron-circle-right'
                style={[localStyles.buttonBig, {paddingRight: scale(30)}]}
                onPress={() => this._onNextButtonPress()}
            />
        );
    }

    _renderList() {
        let itemCount = 0;
        let renderedItemCount = 0;

        return (
           <View>
               <Heading
                   text={this.state.optionKey}
                   onBackButtonPress={() => this.props.navigation.navigate('Home')}
                   onAddButtonPress={() => this._onAddButtonPress()}
               />
               <Item>
                   <Icon active tyle={{fontSize: scale(25)}} name='search' />
                   <Input
                       style={styles.grey}
                       placeholder='Search'
                       maxLength={255}
                       value={this.state.search.term}
                       onChangeText={(value) => this._search(value)}
                   />
               </Item>
               {this._renderFilterMessage()}
               <View style={{paddingBottom: 20}} />
               {this.state.search.results.map((option, index) => {
                   itemCount++;

                   if (itemCount < this.state.pagination.startOnItem || renderedItemCount >= this.state.pagination.itemsPerPage) {
                       return null;
                   }

                   renderedItemCount++;

                   return (
                       <Card key={common.toCamelCase(this.props.optionKey) + '-' + itemCount}>
                           <CardItem>
                               <Body>
                                   <Text style={[styles.boldGrey, {fontSize: scale(16), lineHeight: scale(18)}]}>{option.name} (R{option.rank})</Text>
                               </Body>
                               <Right>
                                   <View style={{flex: 1, flexDirection: 'row'}}>
                                       <Icon
                                           type='FontAwesome'
                                           name={this.state.optionChevron[option.name + option.rank]}
                                           style={[localStyles.button, {paddingRight: scale(5)}]}
                                           onPress={() => this._toggleDescriptionShow(option.name, option.rank)}
                                       />
                                       <Icon
                                           type='FontAwesome'
                                           name='trash'
                                           style={[localStyles.button, {paddingRight: scale(5)}]}
                                           onPress={() => this._delete(option)}
                                       />
                                       <Icon
                                           type='FontAwesome'
                                           name='edit'
                                           style={[localStyles.button, {paddingTop: 3}]}
                                           onPress={() => this.props.navigation.navigate('EditOption', {optionKey: this.state.optionKey, option: option})}
                                       />
                                   </View>
                               </Right>
                           </CardItem>
                           <CardItem>
                               <Body>
                                   <Text style={styles.grey}>{this._renderDescription(option)}</Text>
                               </Body>
                           </CardItem>
                       </Card>
                   )
               })}
           </View>
       );
    }

	render() {
        return (
            <View>
                {this._renderList()}
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 20, paddingTop: 20}}>
                    {this._renderBackButton()}
                    <Text style={styles.grey}>Page {this.state.pagination.currentPage} of {this.state.pagination.totalPages}</Text>
                    {this._renderNextButton()}
                </View>
                <ConfirmationDialog
                    visible={this.state.confirmationDialog.visible}
                    title={this.state.confirmationDialog.title}
                    info={this.state.confirmationDialog.info}
                    onOk={this.onOk}
                    onClose={this.onClose}
                />
                <View style={{paddingBottom: 20}} />
            </View>
		);
	}
}

const localStyles = ScaledSheet.create({
	button: {
        fontSize: '25@vs',
        color: '#f57e20'
	},
	buttonBig: {
        fontSize: 45,
        color: '#f57e20'
	}
});

const mapStateToProps = state => {
    return {};
}

const mapDispatchToProps = {
    addTemplateOption,
    deleteTemplateOption
}

export default connect(mapStateToProps, mapDispatchToProps)(Options);
