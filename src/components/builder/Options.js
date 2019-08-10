import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, TouchableHighlight } from 'react-native';
import { Container, Content, Button, Text, List, ListItem, Left, Right, Body } from 'native-base';
import styles from '../../Styles';
import Heading from '../Heading';
import InfoDialog from '../InfoDialog';
import { common } from '../../lib/Common';
import { character, OPTION_ADVANTAGES, OPTION_COMPLICATIONS, OPTION_SPECIAL_ABILITIES } from '../../lib/Character';
import RanksDialog, { MODE_EDIT } from '../RanksDialog';

export default class Options extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        optionKey: PropTypes.string.isRequired,
        navigation: PropTypes.object.isRequired,
        character: PropTypes.object.isRequired,
        updateOption: PropTypes.func.isRequired,
        removeOption: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            optionKey: common.toCamelCase(props.optionKey),
            infoDialog: {
                visible: false,
                title: '',
                info: ''
            },
            ranksDialog: {
                visible: false,
                optionKey: OPTION_ADVANTAGES,
                item: null
            }
        }

        this.closeRanksDialog = this._closeRanksDialog.bind(this);
        this.updateOption = this._updateOption.bind(this);
        this.removeOption = this._removeOption.bind(this);
        this.closeInfoDialog = this._closeInfoDialog.bind(this);
    }

    _updateOption(optionKey, item) {
        this.props.updateOption(optionKey, item);

        this._closeRanksDialog();
    }

    _removeOption(optionKey, item) {
        this.props.removeOption(optionKey, item);
        this._closeRanksDialog();
    }

    _closeRanksDialog() {
        let newState = {...this.state}
        newState.ranksDialog.visible = false;
        newState.ranksDialog.item = null;
        newState.ranksDialog.errorMessage = null;

        this.setState(newState);
    }

    _showOptionInfo(option) {
        let newState = {...this.state};
        newState.infoDialog.visible = true;
        newState.infoDialog.title = option.name + ', R' + (option.multipleRanks ? option.totalRanks : option.rank);
        newState.infoDialog.info = option.description;

        this.setState(newState);
    }

    _showRanksPicker(optionKey, item) {
        let newState = {...this.state};
        newState.ranksDialog.visible = true;
        newState.ranksDialog.optionKey = optionKey.toLowerCase();
        newState.ranksDialog.item = item;

        this.setState(newState);
    }

    _closeInfoDialog() {
        let newState = {...this.state}
        newState.infoDialog.visible = false;

        this.setState(newState);
    }

    _renderOptionList(options, optionKey) {
        if (options === null || options.length === 0) {
            return (
                <List>
                    <ListItem key={'option-none'} noIndent>
                        <Body>
                            <Text style={styles.grey}>None</Text>
                        </Body>
                    </ListItem>
                </List>
            );
        }

        return (
            <List>
                {options.map((item, index) => {
                    return (
                        <ListItem key={'option-' + item.id} noIndent>
                            <Body>
                                <TouchableHighlight underlayColor='#ffffff' onPress={() => this._showOptionInfo(item)}>
                                    <View style={{paddingTop: 10, paddingBottom: 10}}>
                                        <Text style={[styles.grey, styles.big]}>
                                            {item.excludeFromBuildCosts ? '*' : ''}
                                            {item.name + (item.displayNote === null ? '' : ': ' + item.displayNote)}
                                        </Text>
                                    </View>
                                </TouchableHighlight>
                            </Body>
                            <Right>
                                <TouchableHighlight underlayColor='#ffffff' onPress={() => this._showRanksPicker(optionKey, item)}>
                                    <View style={{paddingLeft: 50, paddingTop: 10, paddingBottom: 10}}>
                                        <Text style={[styles.grey, styles.big]}>
                                            R{(item.multipleRanks ? item.totalRanks * item.rank : item.rank)}
                                        </Text>
                                    </View>
                                </TouchableHighlight>
                            </Right>
                        </ListItem>
                    );
                })}
            </List>
        );
    }

	render() {
        return (
            <View>
                <Heading
                    text={this.props.title}
                    onAddButtonPress={() => this.props.navigation.navigate('Options', {optionKey: this.props.optionKey})}
                />
                {this._renderOptionList(this.props.character[this.state.optionKey].items, this.props.optionKey)}
                <RanksDialog
                    visible={this.state.ranksDialog.visible}
                    optionKey={this.state.ranksDialog.optionKey}
                    item={this.state.ranksDialog.item}
                    mode={MODE_EDIT}
                    onSave={this.updateOption}
                    onClose={this.closeRanksDialog}
                    onDelete={this.removeOption}
                />
                <InfoDialog
                    visible={this.state.infoDialog.visible}
                    title={this.state.infoDialog.title}
                    info={this.state.infoDialog.info}
                    onClose={this.closeInfoDialog}
                />
            </View>
        );
	}
}
