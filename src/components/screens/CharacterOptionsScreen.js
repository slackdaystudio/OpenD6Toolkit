import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Platform, StyleSheet, View, TouchableHighlight, BackHandler, Alert } from 'react-native';
import { Container, Content, Button, Text, Spinner, Card, CardItem, Body, Icon, Toast } from 'native-base';
import Header from '../Header';
import RanksDialog, { MODE_ADD } from '../RanksDialog';
import styles from '../../Styles';
import { character, OPTION_ADVANTAGES, OPTION_COMPLICATIONS } from '../../lib/Character';
import { addOption } from '../../../reducer';

class CharacterOptionsScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        character: PropTypes.object.isRequired,
        addOption: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);

        let optionKey = props.navigation.state.params.optionKey;
        let options = character.getOptions(optionKey).items;

        this.state = {
            options: this._initOptions(options),
            optionShow: this._initOptionsShow(options),
            optionKey: optionKey,
            selectedOption: null,
            showRanksDialog: false
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

    _initOptions(options) {
        let optionsList = [];

        options.map((option, index) => {
            optionsList.push(option);
        });

        return optionsList;
    }

    _initOptionsShow(options) {
        let optionsShow = {};

        options.map((option, index) => {
            optionsShow[option.name + option.rank] = false
        });

        return optionsShow;
    }

    _toggleDescriptionShow(name, rank) {
        let newState = {...this.state};
        newState.optionShow[name + rank] = !newState.optionShow[name + rank];

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
            textStyle: {color: '#00ACED'},
            buttonText: 'OK'
        });
    }

    _closeRanksDialog() {
        this.setState({
            selectedOption: null,
            showRanksDialog: false
        });
    }

    _renderDescription(item) {
        let description = item.description;

        if (this.state.optionShow[item.name + item.rank]) {
            return description;
        }

        return description.length > 75 ? description.substring(0, 72) + '...' : description;
    }

	render() {
		return (
		  <Container style={styles.container}>
            <Header navigation={this.props.navigation} />
            <Content style={styles.content}>
                <View style={[styles.rowStart, {backgroundColor: '#fde5d2'}]}>
                    <View style={{flex: 1, paddingTop: 5, justifyContent: 'space-around', alignItems: 'center'}}>
                        <Icon
                            type='FontAwesome'
                            name='arrow-circle-left'
                            style={[styles.grey, {fontSize: 30, color: '#f57e20'}]}
                            onPress={() => this.props.navigation.navigate('Builder')}
                        />
                    </View>
                    <View style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={styles.heading}>{this.state.optionKey}</Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'flex-end'}} />
                </View>
                <View style={{paddingBottom: 20}} />
                {this.state.options.map((option, index) => {
                    return (
                        <TouchableHighlight
                            key={'option-' + index}
                            onPress={() => this._toggleDescriptionShow(option.name, option.rank)}
                            onLongPress={() => this._addOption(option)}
                        >
                            <View style={{borderWidth: 1, borderColor: '#d1d1d1'}}>
                                <CardItem style={{backgroundColor: '#f9f9f9'}}>
                                    <Body>
                                        <Text style={styles.grey}>
                                            <Text style={[styles.boldGrey, {fontSize: 20, lineHeight: 22}]}>{option.name}, R{option.rank + '\n'}</Text>
                                            <Text style={styles.grey}>{this._renderDescription(option)}</Text>
                                        </Text>
                                    </Body>
                                </CardItem>
                            </View>
                        </TouchableHighlight>
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

const mapStateToProps = state => {
    return {
        character: state.builder.character
    };
}

const mapDispatchToProps = {
    addOption
}

export default connect(mapStateToProps, mapDispatchToProps)(CharacterOptionsScreen);