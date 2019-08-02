import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Platform, StyleSheet, View, TouchableHighlight, BackHandler, Alert } from 'react-native';
import { Container, Content, Button, Text, Spinner, Card, CardItem, Left, Right, Body, Item, Icon, Input, Label, Toast } from 'native-base';
import Header from '../Header';
import Heading from '../Heading';
import RanksDialog, { MODE_ADD } from '../RanksDialog';
import styles from '../../Styles';
import { character, OPTION_ADVANTAGES, OPTION_COMPLICATIONS } from '../../lib/Character';
import { common } from '../../lib/Common';
import { addOption } from '../../../reducer';

class CharacterOptionsScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        character: PropTypes.object.isRequired,
        addOption: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);

        const optionKey = props.navigation.state.params.optionKey;
        const options = props.character[common.toCamelCase(optionKey)].template.items;
        const displayOptions =  this._initOptionsShow(options);

        this.state = {
            options: options,
            optionShow: displayOptions.optionsState,
            optionChevron: displayOptions.chevronsState,
            optionKey: optionKey,
            selectedOption: null,
            showRanksDialog: false,
            search: {
                term: '',
                results: options
            }
        }

        this.addOptionToCharacter = this._addOptionToCharacter.bind(this);
        this.closeRanksDialog = this._closeRanksDialog.bind(this);
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.navigate('Builder');

            return true;
        });
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

        Toast.show({
            text: item.name + ', R' + (item.multipleRanks ? item.totalRanks * item.rank : item.rank) + ' has been added',
            position: 'bottom',
            buttonText: 'OK',
            textStyle: {color: '#fde5d2'},
            buttonTextStyle: { color: '#f57e20' },
            duration: 3000
        });
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

    _getChevronName() {

    }

	render() {
		return (
		  <Container style={styles.container}>
            <Header navigation={this.props.navigation} />
            <Content style={styles.content}>
                <Heading
                    text={this.state.optionKey}
                    onBackButtonPress={() => this.props.navigation.navigate('Builder')}
                />
                <Item>
                    <Icon active name='search' />
                    <Input
                        style={styles.grey}
                        maxLength={255}
                        value={this.state.search.term}
                        onChangeText={(value) => this._search(value)}
                    />
                </Item>
                {this._renderFilterMessage()}
                <View style={{paddingBottom: 20}} />
                {this.state.search.results.map((option, index) => {
                    return (
                        <Card>
                            <CardItem>
                                <Body>
                                    <Text style={[styles.boldGrey, {fontSize: 20, lineHeight: 22}]}>{option.name} R{option.rank}</Text>
                                </Body>
                                <Right>
                                    <View style={{flex: 1, flexDirection: 'row'}}>
                                        <Icon
                                            type='FontAwesome'
                                            name={this.state.optionChevron[option.name + option.rank]}
                                            style={[localStyles.button, {paddingRight: 10}]}
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

const localStyles = StyleSheet.create({
	button: {
        fontSize: 30,
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