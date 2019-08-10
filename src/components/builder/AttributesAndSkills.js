import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, TouchableHighlight } from 'react-native';
import { Container, Content, Text, List, ListItem, Left, Right, Body, Button, Icon, Input } from 'native-base';
import { ScaledSheet, scale, verticalScale } from 'react-native-size-matters';
import { SwipeRow } from 'react-native-swipe-list-view';
import styles from '../../Styles';
import Heading from '../Heading';
import AttributeDialog from '../AttributeDialog';
import InfoDialog from '../InfoDialog';
import { character } from '../../lib/Character';

export default class AttributesAndSkills extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        character: PropTypes.object.isRequired,
        settings: PropTypes.object.isRequired,
        updateCharacterDieCode: PropTypes.func.isRequired,
        updateRoller: PropTypes.func.isRequired,
        updateMove: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            attributes: props.character.template.attributes,
            attributeDialog: {
                visible: false
            },
            infoDialog: {
                visible: false,
                title: '',
                info: ''
            },
            attributeShow: this._initAttributeShow(props),
            dieCode: this._initDieCode()
        }

        this.closeAttributeDialog = this._closeAttributeDialog.bind(this);
        this.saveDieCode = this._saveDieCode.bind(this);
        this.updateDice = this._updateDice.bind(this);
        this.updateModifierDice = this._updateModifierDice.bind(this);
        this.updateMove = this._updateMove.bind(this);
        this.updatePips = this._updatePips.bind(this);
        this.updateModifierPips = this._updateModifierPips.bind(this);
        this.closeInfoDialog = this._closeInfoDialog.bind(this);
    }

    _initAttributeShow(props) {
        let attributeShow = {}

        props.character.template.attributes.map((attribute, index) => {
            attributeShow[attribute.name] = false;
        });

        return attributeShow;
    }

    _initDieCode() {
        return {
            identifier: '',
            errorMessage: null,
            dice: 0,
            modifierDice: 0,
            pips: 0,
            modifierPips: 0
        };
    }

    _editDieCode(identifier, dieCode) {
        let newState = {...this.state};
        newState.attributeDialog.visible = true;
        newState.dieCode.identifier = identifier;
        newState.dieCode.dice = dieCode.dice;
        newState.dieCode.modifierDice = dieCode.modifierDice;
        newState.dieCode.pips = dieCode.pips;
        newState.dieCode.modifierPips = dieCode.modifierPips;

        this.setState(newState);
    }

    _showAttributeInfo(identifier) {
        let newState = {...this.state};
        newState.infoDialog.visible = true;
        newState.dieCode.identifier = identifier;
        newState.infoDialog.title = identifier;
        newState.infoDialog.info = character.getTemplateSkillOrAttribute(this.props.character, identifier).description;

        this.setState(newState);
    }

    _toggleAttributeShow(attribute) {
        let newState = {...this.state};
        newState.attributeShow[attribute] = !newState.attributeShow[attribute];

        this.setState(newState);
    }

    _updateDice(value) {
        let newState = {...this.state};
        let dice = '';

        if (value === '' || value === '-') {
            dice = value;
        } else {
            dice = parseInt(value, 10) || 1;

            if (dice > 30) {
                dice = 30;
            } else if (dice < 1) {
                dice = 1;
            }
        }

        newState.dieCode.dice = dice;

        this.setState(newState);
    }

    _rollDice(dieCode) {
        let totalDieCode = character.getTotalDieCode(dieCode);

        if (totalDieCode.dice > 0) {
            this.props.updateRoller(totalDieCode.dice, totalDieCode.pips);

            this.props.navigation.navigate('DieRoller', {from: 'Builder'});
        }
    }

    _rollSkillDice(attributeDieCode, skillDieCode) {
        let combinedDieCodes = {
            dice: parseInt(attributeDieCode.dice, 10) + parseInt(skillDieCode.dice, 10),
            modifierDice: parseInt(attributeDieCode.modifierDice, 10) + parseInt(skillDieCode.modifierDice, 10),
            pips: parseInt(attributeDieCode.pips, 10) + parseInt(skillDieCode.pips, 10),
            modifierPips: parseInt(attributeDieCode.modifierPips, 10) + parseInt(skillDieCode.modifierPips, 10)
        };

        let totalDieCode = character.getTotalDieCode(combinedDieCodes);

        if (totalDieCode.dice >= 1) {
            this.props.updateRoller(totalDieCode.dice, totalDieCode.pips);
            this.props.navigation.navigate('DieRoller', {from: 'Builder'});
        }
    }

    _updateModifierDice(value) {
        let newState = {...this.state};
        let dice = '';

        if (value === '' || value === '-') {
            dice = value;
        } else {
            dice = parseInt(value, 10) || 1;

            if (dice > 30) {
                dice = 30;
            } else if (dice < -30) {
                dice = -30;
            }
        }

        newState.dieCode.modifierDice = dice;

        this.setState(newState);
    }

    _updatePips(value) {
        let newState = {...this.state};
        let pips = parseInt(value, 10) || 0;

        if (pips > 2) {
            pips = 2;
        } else if (pips < 0) {
            pips = 0;
        }

        newState.dieCode.pips = pips;

        this.setState(newState);
    }

    _updateModifierPips(value) {
        let newState = {...this.state};
        let pips = parseInt(value, 10) || 0;

        if (pips > 2) {
            pips = 2;
        } else if (pips < -2) {
            pips = -2;
        }

        newState.dieCode.modifierPips = pips;

        this.setState(newState);
    }

    _closeAttributeDialog() {
        let newState = {...this.state}
        newState.attributeDialog.visible = false;
        newState.dieCode = this._initDieCode();

        this.setState(newState);
    }

    _closeInfoDialog() {
        let newState = {...this.state}
        newState.infoDialog.visible = false;

        this.setState(newState);
    }

    _saveDieCode(name) {
        let newState = {...this.state};
        newState.dieCode.errorMessage = null;
        newState.dieCode.identifier = name;

        this.setState(newState, () => {
            let attributeMin = this.props.character.template.attributeMin;
            let attributeMax = this.props.character.template.attributeMax;
            let isSkill = character.isSkill(this.props.character, this.state.dieCode.identifier);
            let isExtranormal = character.isExtranormal(this.props.character, this.state.dieCode.identifier);
            let totalDieCode = character.getTotalDieCode(this.state.dieCode);

            if (isSkill && totalDieCode.dice < 0) {
                newState.dieCode.errorMessage = 'Skills may not go below 0';
            } else if (!isSkill && isExtranormal && totalDieCode.dice < 0) {
                newState.dieCode.errorMessage = 'Extranormal attributes may not go below 0';
            } else if (!isSkill && !isExtranormal && totalDieCode.dice < attributeMin) {
                newState.dieCode.errorMessage = 'Attributes may not go below ' + attributeMin;
            } else if (!isSkill && !isExtranormal && totalDieCode.dice > attributeMax && this.props.settings.useMaxima) {
                newState.dieCode.errorMessage = 'Attributes may not go above ' + attributeMax;
            }

            if (newState.dieCode.errorMessage !== null) {
                this.setState(newState);
                return;
            }

            this.props.updateCharacterDieCode(this.state.dieCode);
            this.closeAttributeDialog();
        });
    }

    _updateMove(value) {
        let move = '';

        if (value === '' || value === '-') {
            move = value;
        } else {
            move = parseInt(value, 10) || 1;

            if (move > 9999) {
                move = 9999;
            } else if (move < 0) {
                move = 0;
            }
        }

        this.props.updateMove('move', move);
    }

    _renderSkills(attribute, attributeDieCode) {
        return (
            <View>
                {attribute.skills.map((skill, index) => {
                    if (this.state.attributeShow[attribute.name]) {
                        let skillDieCode = character.getDieCode(this.props.character, skill.name);

                        return (
                            <List key={'skill-' + index} style={{paddingLeft: 0}}>
                                <ListItem>
                                    <Body>
                                        <SwipeRow leftOpenValue={scale(65)} disableLeftSwipe={true}>
                                            <View style={localStyles.standaloneRowBack}>
                                                <Icon
                                                    type='FontAwesome'
                                                    name='info-circle'
                                                    style={[styles.grey, {fontSize: scale(25), color: '#f57e20', width: scale(25)}]}
                                                    onPress={() => this._showAttributeInfo(skill.name)}
                                                />
                                                <View style={{paddingRight: 5}} />
                                                <Icon
                                                    type='FontAwesome'
                                                    name='edit'
                                                    style={[styles.grey, {fontSize: scale(25), color: '#f57e20', paddingTop: scale(3), width: scale(25)}]}
                                                    onPress={() => this._editDieCode(skill.name, skillDieCode)}
                                                />
                                            </View>
                                            <View style={localStyles.standaloneRowFront}>
                                                <Text style={[styles.grey, {lineHeight: verticalScale(18)}]}>{skill.name}</Text>
                                            </View>
                                        </SwipeRow>
                                    </Body>
                                    <Right>
                                        <TouchableHighlight
                                            underlayColor='#ffffff'
                                            onPress={() => this._rollSkillDice(attributeDieCode, skillDieCode)}
                                        >
                                            <View style={{paddingLeft: 20, paddingTop: 10, paddingBottom: 10}}>
                                                <Text style={[styles.grey, {lineHeight: 30}]}>
                                                    {character.getFormattedDieCode(skillDieCode)}
                                                </Text>
                                            </View>
                                        </TouchableHighlight>
                                    </Right>
                                </ListItem>
                            </List>
                        );
                    }

                    return null;
                })}
            </View>
        );
    }

    _renderMove() {
        move = this.props.character.move === undefined ? 10 : this.props.character.move;

        return (
            <ListItem noIndent>
                <Left>
                    <View style={[localStyles.standaloneRowFront, {paddingRight: 150, paddingTop: 10, paddingBottom: 10}]}>
                        <Text style={[styles.grey, styles.big]}>
                            Move
                        </Text>
                    </View>
                </Left>
                <Right>
                    <Input
                        style={[styles.grey, {lineHeight: verticalScale(30), paddingBottom: 0}]}
                        keyboardType='numeric'
                        maxLength={4}
                        value={move.toString()}
                        onChangeText={(value) => this._updateMove(value)}
                    />
                </Right>
            </ListItem>
        )
    }

    _renderAttributes() {
        return (
            <List>
            {this.props.character.template.attributes.map((attribute, index) => {
                let dieCode = character.getDieCode(this.props.character, attribute.name);

                return (
                    <View key={'atr-' + index}>
                        <ListItem noIndent>
                            <Left>
                                <SwipeRow leftOpenValue={scale(65)} disableLeftSwipe={true}>
                                    <View style={localStyles.standaloneRowBack}>
                                        <Icon
                                            type='FontAwesome'
                                            name='info-circle'
                                            style={[styles.grey, {fontSize: scale(25), color: '#f57e20', width: scale(25)}]}
                                            onPress={() => this._showAttributeInfo(attribute.name)}
                                        />
                                        <View style={{paddingRight: scale(5)}} />
                                        <Icon
                                            type='FontAwesome'
                                            name='edit'
                                            style={[styles.grey, {fontSize: scale(25), color: '#f57e20', paddingTop: scale(3), width: scale(25)}]}
                                            onPress={() => this._editDieCode(attribute.name, dieCode)}
                                        />
                                    </View>
                                    <View style={localStyles.standaloneRowFront}>
                                        <TouchableHighlight
                                            underlayColor='#ffffff'
                                            onPress={() => this._toggleAttributeShow(attribute.name)}
                                        >
                                            <Text style={[styles.grey, styles.big, {width: scale(200)}]}>
                                                {attribute.name}
                                            </Text>
                                        </TouchableHighlight>
                                    </View>
                                </SwipeRow>
                            </Left>
                            <Right>
                                <TouchableHighlight
                                    underlayColor='#ffffff'
                                    onPress={() => this._rollDice(dieCode)}
                                >
                                    <View style={{paddingLeft: 20, paddingTop: 10, paddingBottom: 10}}>
                                        <Text style={[styles.grey, styles.big]}>
                                            {character.getFormattedDieCode(dieCode)}
                                        </Text>
                                    </View>
                                </TouchableHighlight>
                            </Right>
                        </ListItem>
                        {this._renderSkills(attribute, dieCode)}
                    </View>
                )
            })}
            {this._renderMove()}
            </List>
        );
    }

	render() {
		return (
            <View>
                <Heading text='Attributes &amp; Skills' />
                {this._renderAttributes()}
                <AttributeDialog
                    visible={this.state.attributeDialog.visible}
                    identifier={this.state.dieCode.identifier}
                    dice={this.state.dieCode.dice.toString()}
                    modifierDice={this.state.dieCode.modifierDice.toString()}
                    pips={this.state.dieCode.pips}
                    modifierPips={this.state.dieCode.modifierPips}
                    errorMessage={this.state.dieCode.errorMessage}
                    close={this.closeAttributeDialog}
                    onSave={this.saveDieCode}
                    onUpdateDice={this.updateDice}
                    onUpdateModifierDice={this.updateModifierDice}
                    onUpdatePips={this.updatePips}
                    onUpdateModifierPips={this.updateModifierPips}
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

const localStyles = ScaledSheet.create({
	standaloneRowFront: {
		alignItems: 'flex-start',
		backgroundColor: '#FFF',
		justifyContent: 'center',
		height: '30@vs',
	},
	standaloneRowBack: {
		alignItems: 'center',
		backgroundColor: '#FFF',
		flex: 1,
		flexDirection: 'row',
		width: 500
	}
});
