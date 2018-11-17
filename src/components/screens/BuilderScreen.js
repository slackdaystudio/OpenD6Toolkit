import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Platform, StyleSheet, ScrollView, View, TouchableHighlight, Alert } from 'react-native';
import { Container, Content, Button, Text, Picker, Item, Input, List, ListItem, Left, Right, Body, Icon} from 'native-base';
import Header from '../Header';
import Heading from '../Heading';
import AttributeDialog from '../AttributeDialog';
import InfoDialog from '../InfoDialog';
import RanksDialog, { MODE_EDIT } from '../RanksDialog';
import Appearance from '../Appearance';
import styles from '../../Styles';
import { character, OPTION_ADVANTAGES, OPTION_COMPLICATIONS, OPTION_SPECIAL_ABILITIES } from '../../lib/Character';
import { file } from '../../lib/File';
import { common } from '../../lib/Common';
import {
    updateRoller,
    updateCharacterDieCode,
    updateAppearance,
    updateOption,
    removeOption
} from '../../../reducer';

class BuilderScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        character: PropTypes.object.isRequired,
        updateRoller: PropTypes.func.isRequired,
        updateCharacterDieCode: PropTypes.func.isRequired,
        updateAppearance: PropTypes.func.isRequired,
        updateOption: PropTypes.func.isRequired,
        removeOption: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            attributeDialog: {
                visible: false
            },
            infoDialog: {
                visible: false,
                title: '',
                info: ''
            },
            ranksDialog: {
                visible: false,
                optionKey: OPTION_ADVANTAGES,
                item: null
            },
            dieCode: this._initDieCode(),
            attributeShow: this._initAttributeShow(props)
        }

        this.toggleAttributeShow = this._toggleAttributeShow.bind(this);
        this.closeAttributeDialog = this._closeAttributeDialog.bind(this);
        this.closeInfoDialog = this._closeInfoDialog.bind(this);
        this.closeRanksDialog = this._closeRanksDialog.bind(this);
        this.saveDieCode = this._saveDieCode.bind(this);
        this.updateDice = this._updateDice.bind(this);
        this.updateModifierDice = this._updateModifierDice.bind(this);
        this.updatePips = this._updatePips.bind(this);
        this.updateModifierPips = this._updateModifierPips.bind(this);
        this.updateOption = this._updateOption.bind(this);
        this.removeOption = this._removeOption.bind(this);
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

    _initAttributeShow(props) {
        let attributeShow = {}

        props.character.template.attributes.map((attribute, index) => {
            attributeShow[attribute.name] = false;
        });

        return attributeShow;
    }


    _toggleAttributeShow(attribute) {
        let newState = {...this.state};
        newState.attributeShow[attribute] = !newState.attributeShow[attribute];

        this.setState(newState);
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

    _rollDice(dieCode) {
        let totalDieCode = character.getTotalDieCode(dieCode);

        if (totalDieCode.dice > 0) {
            this.props.updateRoller(totalDieCode.dice, totalDieCode.pips);

            this.props.navigation.navigate('DieRoller');
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
            this.props.navigation.navigate('DieRoller');
        }
    }

    _rollSpecializationDice(specialization) {
        let attribute = character.getAttributeBySkill(specialization.skillName, this.props.character.attributes);
        let attributeDieCode = character.getDieCode(this.props.character, attribute.name);
        let specializationDieCode = {
            dice: specialization.dice,
            modifierDice: 0,
            pips: specialization.pips,
            modifierPips: 0
        }

        this._rollSkillDice(attributeDieCode, specializationDieCode);
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

    _updateOption(optionKey, item) {
        this.props.updateOption(optionKey, item);

        this._closeRanksDialog();
    }

    _removeOption(optionKey, item) {
        this.props.removeOption(optionKey, item);
        this._closeRanksDialog();
    }

    _closeAttributeDialog() {
        let newState = {...this.state}
        newState.attributeDialog.visible = false;
        newState.dieCode = this._initDieCode();
        newState.ranksDialog.errorMessage = null;

        this.setState(newState);
    }

    _closeInfoDialog() {
        let newState = {...this.state}
        newState.infoDialog.visible = false;

        this.setState(newState);
    }

    _closeRanksDialog() {
        let newState = {...this.state}
        newState.ranksDialog.visible = false;
        newState.ranksDialog.item = null;
        newState.ranksDialog.errorMessage = null;

        this.setState(newState);
    }

    _saveDieCode(name) {
        let newState = {...this.state};
        newState.dieCode.errorMessage = null;
        newState.dieCode.identifier = name;

        this.setState(newState, () => {
            let attributeMin = this.props.character.template.attributeMin;
            let isSkill = character.isSkill(this.props.character, this.state.dieCode.identifier);
            let isExtranormal = character.isExtranormal(this.props.character, this.state.dieCode.identifier);
            let totalDieCode = character.getTotalDieCode(this.state.dieCode);

            if (isSkill && totalDieCode.dice < 0) {
                newState.dieCode.errorMessage = 'Skills may not go below 0';
            } else if (!isSkill && isExtranormal && totalDieCode.dice < 0) {
                newState.dieCode.errorMessage = 'Extranormal attributes may not go below 0';
            } else if (!isSkill && !isExtranormal && totalDieCode.dice < attributeMin) {
                newState.dieCode.errorMessage = 'Attributes may not go below ' + attributeMin;
            }

            if (newState.dieCode.errorMessage !== null) {
                this.setState(newState);
                return;
            }

            this.props.updateCharacterDieCode(this.state.dieCode);
            this.closeAttributeDialog();
        });
    }

    _save() {
        if (this.props.character.name === undefined || this.props.character.name === null || this.props.character.name.trim() === '') {
            let newState = {...this.state};
            newState.infoDialog.visible = true;
            newState.infoDialog.title = 'Name You Character';
            newState.infoDialog.info = 'Please name your character before saving them';

            this.setState(newState);
        } else {
            file.save(this.props.character);
        }
    }

    _renderAttributes() {
        return (
            <View>
                <Heading text='Attributes &amp; Skills' />
                <List>
                {this.props.character.template.attributes.map((attribute, index) => {
                    let dieCode = character.getDieCode(this.props.character, attribute.name);

                    return (
                        <View key={'atr-' + index}>
                            <ListItem noIndent>
                                <Left>
                                    <TouchableHighlight
                                        underlayColor='#ffffff'
                                        onPress={() => this.toggleAttributeShow(attribute.name)}
                                        onLongPress={() => this._showAttributeInfo(attribute.name)}
                                    >
                                        <View style={{paddingRight: 150, paddingTop: 10, paddingBottom: 10}}>
                                            <Text style={[styles.grey, styles.big, {}]}>
                                                {attribute.name}
                                            </Text>
                                        </View>
                                    </TouchableHighlight>
                                </Left>
                                <Right>
                                    <TouchableHighlight
                                        underlayColor='#ffffff'
                                        onPress={() => this._rollDice(dieCode)}
                                        onLongPress={() => this._editDieCode(attribute.name, dieCode)}
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
                </List>
                {this._renderSpecializations()}
            </View>
        );
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
                                        <TouchableHighlight underlayColor='#ffffff' onLongPress={() => this._showAttributeInfo(skill.name)}>
                                            <View style={{paddingRight: 100, paddingTop: 10, paddingBottom: 10}}>
                                                <Text style={[styles.grey, {lineHeight: 30}]}>{'\t' + skill.name}</Text>
                                            </View>
                                        </TouchableHighlight>
                                    </Body>
                                    <Right>
                                        <TouchableHighlight
                                            underlayColor='#ffffff'
                                            onPress={() => this._rollSkillDice(attributeDieCode, skillDieCode)}
                                            onLongPress={() => this._editDieCode(skill.name, skillDieCode)}
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

    _renderSpecializations() {
        if (this.props.character.specializations.length === 0) {
            return (
                <View>
                    <Heading text='Specializations'
                        onAddButtonPress={() => this.props.navigation.navigate('Specialization')}
                    />
                    <List>
                        <ListItem key={'specialization-none'} noIndent>
                            <Body>
                                <Text style={styles.grey}>None</Text>
                            </Body>
                        </ListItem>
                    </List>
                </View>
            );
        }

        return (
            <View>
                <Heading
                    text='Specializations'
                    onAddButtonPress={() => this.props.navigation.navigate('Specialization')}
                />
                <List>
                {this.props.character.specializations.map((specialization, index) => {
                    return (
                        <ListItem key={'specialization-' + index} noIndent>
                            <Body>
                                <TouchableHighlight
                                    underlayColor='#ffffff'
                                    onPress={() => this.props.navigation.navigate('Specialization', {specialization: specialization})}
                                >
                                    <View style={{paddingTop: 10, paddingBottom: 10}}>
                                        <Text style={[styles.grey, styles.big]}>
                                            {specialization.skillName + ': ' + specialization.name}
                                        </Text>
                                    </View>
                                </TouchableHighlight>
                            </Body>
                            <Right>
                                <TouchableHighlight
                                    underlayColor='#ffffff'
                                    onPress={() => this._rollSpecializationDice(specialization)}
                                >
                                    <View style={{paddingLeft: 20, paddingTop: 10, paddingBottom: 10}}>
                                        <Text style={[styles.grey, {lineHeight: 30}]}>
                                            {specialization.dice + 'D' + (specialization.pips > 0 ? '+' + specialization.pips : '')}
                                        </Text>
                                    </View>
                                </TouchableHighlight>
                            </Right>
                        </ListItem>
                    );
                })}
                </List>
            </View>
        );
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
                        <ListItem key={'option-' + index} noIndent>
                            <Body>
                                <TouchableHighlight underlayColor='#ffffff' onPress={() => this._showOptionInfo(item)}>
                                    <View style={{paddingTop: 10, paddingBottom: 10}}>
                                        <Text style={[styles.grey, styles.big]}>
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

    _renderOptions(title, optionKey) {
        let arrayKey = common.toCamelCase(optionKey);

        return (
            <View>
                <Heading
                    text={title}
                    onAddButtonPress={() => this.props.navigation.navigate('Options', {optionKey: optionKey})}
                />
                {this._renderOptionList(this.props.character[arrayKey].items, optionKey)}
            </View>
        );
    }

	render() {
		return (
		    <Container style={styles.container}>
                <Header navigation={this.props.navigation} />
                <Content style={styles.content}>
                    <Heading text='Builder' />
                    <Appearance character={this.props.character} updateAppearance={this.props.updateAppearance} />
                    <View style={styles.contentPadded}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.grey}>
                                <Text style={styles.boldGrey}>Total Points:</Text> {character.getTotalPoints(this.props.character)}
                            </Text>
                            <Text style={styles.grey}>
                                <Text style={styles.boldGrey}>Complications:</Text> {character.getComplicationPoints(this.props.character)}
                            </Text>
                        </View>
                    </View>
                    <View style={{paddingBottom: 20}} />
                    {this._renderAttributes()}
                    {this._renderOptions('Advantages', OPTION_ADVANTAGES)}
                    {this._renderOptions('Complications', OPTION_COMPLICATIONS)}
                    {this._renderOptions('Special Abilities', OPTION_SPECIAL_ABILITIES)}
                    <View style={{paddingBottom: 20}} />
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around'}}>
                        <View style={styles.buttonContainer}>
                            <Button style={styles.button} onPress={() => this._save()}>
                                <Text uppercase={false} style={styles.buttonText}>Save</Text>
                            </Button>
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button style={styles.button} onPress={() => this.props.navigation.navigate('LoadCharacter')}>
                                <Text uppercase={false} style={styles.buttonText}>Load</Text>
                            </Button>
                        </View>
                    </View>
                    <View style={{paddingBottom: 20}} />
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
                    <RanksDialog
                        visible={this.state.ranksDialog.visible}
                        optionKey={this.state.ranksDialog.optionKey}
                        item={this.state.ranksDialog.item}
                        mode={MODE_EDIT}
                        onSave={this.updateOption}
                        onClose={this.closeRanksDialog}
                        onDelete={this.removeOption}
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
    updateRoller,
    updateCharacterDieCode,
    updateAppearance,
    updateOption,
    removeOption
}

export default connect(mapStateToProps, mapDispatchToProps)(BuilderScreen);