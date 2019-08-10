import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Platform, StyleSheet, View, TouchableHighlight, BackHandler, Alert } from 'react-native';
import { Container, Content, Button, Text, Spinner, Card, CardItem, Left, Right, Body, Item, Icon, Input, Label, Toast } from 'native-base';
import { ScaledSheet, scale, verticalScale } from 'react-native-size-matters';
import Header from '../Header';
import Heading from '../Heading';
import RanksDialog, { MODE_ADD } from '../RanksDialog';
import styles from '../../Styles';
import { character, OPTION_ADVANTAGES, OPTION_COMPLICATIONS } from '../../lib/Character';
import { common } from '../../lib/Common';
import { addOption } from '../../reducers/builder';

const BACK_BUTTON_START_DIFF = 9;

class CharacterOptionsScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        character: PropTypes.object.isRequired,
        addOption: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);

        this.state = this._initState(props.navigation.state.params.optionKey, props.character);

        this.addOptionToCharacter = this._addOptionToCharacter.bind(this);
        this.closeRanksDialog = this._closeRanksDialog.bind(this);
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.navigate('Builder');

            return true;
        });

        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            this.setState(this._initState(this.props.navigation.state.params.optionKey, this.props.character));
        });
    }

    componentWillUnmount() {
        this.backHandler.remove();
        this.focusListener.remove();
    }

    _initState(optionKey, char) {
        const options = char[common.toCamelCase(optionKey)].template.items;
        const displayOptions =  this._initOptionsShow(options);

        return {
            options: options,
            optionShow: displayOptions.optionsState,
            optionChevron: displayOptions.chevronsState,
            optionKey: optionKey,
            selectedOption: null,
            showRanksDialog: false,
            search: {
                term: '',
                results: options
            },
            pagination: {
                currentPage: 1,
                itemsPerPage: 10,
                startOnItem: 1,
                totalPages: Math.ceil(options.length / 10)
            }
        }
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

    _toggleDescriptionShow(name, rank) {
        let newState = {...this.state};
        newState.optionShow[name + rank] = !newState.optionShow[name + rank];
        newState.optionChevron[name + rank] = newState.optionChevron[name + rank] === 'chevron-circle-down' ? 'chevron-circle-up' : 'chevron-circle-down';

        this.setState(newState);
    }

    _addOption(item) {
        this.setState({
            selectedOption: item,
            showRanksDialog: true
        });
    }

    _addOptionToCharacter(optionKey, item) {
        this.props.addOption(optionKey, item);

        common.toast(item.name + ', R' + (item.multipleRanks ? item.totalRanks * item.rank : item.rank) + ' has been added');
    }

    _closeRanksDialog() {
        this.setState({
            selectedOption: null,
            showRanksDialog: false
        });
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
                style={[localStyles.buttonBig, {paddingLeft: sclae(30)}]}
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
                {this.state.search.results.map((option, index) => {
                    itemCount++;

                    if (itemCount < this.state.pagination.startOnItem || renderedItemCount >= this.state.pagination.itemsPerPage) {
                        return null;
                    }

                    renderedItemCount++;

                    return (
                        <Card key={'option-' + option.id}>
                            <CardItem style={{paddingBottom: 0}}>
                                <Body style={{flex: 4}}>
                                    <Text style={[styles.boldGrey, {fontSize: scale(16), lineHeight: scale(18)}]}>{option.name} (R{option.rank})</Text>
                                </Body>
                                <Right style={{flex: 1}}>
                                    <View style={{flex: 1, flexDirection: 'row'}}>
                                        <Icon
                                            type='FontAwesome'
                                            name={this.state.optionChevron[option.name + option.rank]}
                                            style={[localStyles.button, {paddingRight: scale(10)}]}
                                            onPress={() => this._toggleDescriptionShow(option.name, option.rank)}
                                        />
                                        <Icon
                                            type='FontAwesome'
                                            name='plus-circle'
                                            style={localStyles.button}
                                            onPress={() => this._addOption(option)}
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
	    let itemCount = 0;
	    let renderedItemCount = 0;

		return (
		  <Container style={styles.container}>
            <Header navigation={this.props.navigation} />
            <Content style={styles.content}>
                <Heading
                    text={this.state.optionKey}
                    onBackButtonPress={() => this.props.navigation.navigate('Builder')}
                />
                <Item>
                    <Icon active style={{fontSize: scale(25)}} name='search' />
                    <Input
                        style={styles.grey}
                        placeholder="Search"
                        maxLength={255}
                        value={this.state.search.term}
                        onChangeText={(value) => this._search(value)}
                    />
                </Item>
                {this._renderFilterMessage()}
                <View style={{paddingBottom: 20}} />
                {this._renderList()}
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: verticalScale(20)}}>
                    {this._renderBackButton()}
                    <Text style={styles.grey}>Page {this.state.pagination.currentPage} of {this.state.pagination.totalPages}</Text>
                    {this._renderNextButton()}
                </View>
                <View style={{paddingBottom: 20}} />
                <RanksDialog
                    visible={this.state.showRanksDialog}
                    optionKey={this.state.optionKey}
                    item={this.state.selectedOption}
                    mode={MODE_ADD}
                    onSave={this.addOptionToCharacter}
                    onClose={this.closeRanksDialog}
                />
            </Content>
	      </Container>
		);
	}
}

const localStyles = ScaledSheet.create({
	button: {
        fontSize: '25@vs',
        color: '#f57e20'
	}
});

const mapStateToProps = state => {
    return {
        character: state.builder.character
    };
}

const mapDispatchToProps = {
    addOption
}

export default connect(mapStateToProps, mapDispatchToProps)(CharacterOptionsScreen);
