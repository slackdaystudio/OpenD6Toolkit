import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Platform, StyleSheet, ScrollView, View, TouchableHighlight, Alert } from 'react-native';
import { Container, Content, Button, Text, Picker, Item, Input, List, ListItem, Left, Right, Icon} from 'native-base';
import Header from '../Header';
import AttributeDialog from '../AttributeDialog';
import InfoDialog from '../InfoDialog';
import RanksDialog, { MODE_EDIT } from '../RanksDialog';
import Appearance from '../builder/Appearance';
import styles from '../../Styles';
import { OPTION_ADVANTAGES, OPTION_COMPLICATIONS, OPTION_SPECIAL_ABILITIES } from '../../lib/Character';
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
        this.save = this._save.bind(this);
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
        newState.infoDialog.info = this.props.character.getTemplateSkillOrAttribute(identifier).description;

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
        let totalDieCode = this.props.character.getTotalDieCode(dieCode);

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

        let totalDieCode = this.props.character.getTotalDieCode(combinedDieCodes);

        if (totalDieCode.dice >= 1) {
            this.props.updateRoller(totalDieCode.dice, totalDieCode.pips);
            this.props.navigation.navigate('DieRoller');
        }
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

        this.setState(newState);
    }

    _save(name) {
        let newState = {...this.state};
        newState.dieCode.errorMessage = null;
        newState.dieCode.identifier = name;

        this.setState(newState, () => {
            let attributeMin = this.props.character.template.attributeMin;
            let isSkill = this.props.character.isSkill(this.state.dieCode.identifier);
            let isExtranormal = this.props.character.isExtranormal(this.state.dieCode.identifier);
            let totalDieCode = this.props.character.getTotalDieCode(this.state.dieCode);

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

    _renderAttributes() {
        return (
            <View>
                <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={styles.heading}>Attributes &amp; Skills</Text>
                </View>
                <List>
                {this.props.character.template.attributes.map((attribute, index) => {
                    let dieCode = this.props.character.getDieCode(attribute.name);

                    return (
                        <View key={'atr-' + index}>
                            <ListItem noIndent>
                                <Left>
                                    <TouchableHighlight
                                        onPress={() => this.toggleAttributeShow(attribute.name)}
                                        onLongPress={() => this._showAttributeInfo(attribute.name)}
                                    >
                                        <Text style={[styles.boldGrey, localStyles.big]}>
                                            {attribute.name}
                                        </Text>
                                    </TouchableHighlight>
                                </Left>
                                <Right>
                                    <TouchableHighlight
                                        onPress={() => this._rollDice(dieCode)}
                                        onLongPress={() => this._editDieCode(attribute.name, dieCode)}
                                    >
                                        <Text style={[styles.boldGrey, localStyles.big]}>
                                            {this.props.character.getFormattedDieCode(dieCode)}
                                        </Text>
                                    </TouchableHighlight>
                                </Right>
                            </ListItem>
                            {this._renderSkills(attribute, dieCode)}
                        </View>
                    )
                })}
                </List>
            </View>
        );
    }

    _renderSkills(attribute, attributeDieCode) {
        return (
            <View>
                {attribute.skills.map((skill, index) => {
                    if (this.state.attributeShow[attribute.name]) {
                        let skillDieCode = this.props.character.getDieCode(skill.name);

                        return (
                            <List key={'skill-' + index} style={{paddingLeft: 20}}>
                                <ListItem>
                                    <Left>
                                        <TouchableHighlight onLongPress={() => this._showAttributeInfo(skill.name)}>
                                            <Text style={[styles.grey, {lineHeight: 30}]}>{'\t' + skill.name}</Text>
                                        </TouchableHighlight>
                                    </Left>
                                    <Right>
                                        <TouchableHighlight
                                            onPress={() => this._rollSkillDice(attributeDieCode, skillDieCode)}
                                            onLongPress={() => this._editDieCode(skill.name, skillDieCode)}
                                        >
                                            <Text style={[styles.boldGrey, {lineHeight: 30}]}>
                                                {this.props.character.getFormattedDieCode(skillDieCode)}
                                            </Text>
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

    _renderOptionList(options, optionKey) {
        if (options === null || options.length === 0) {
            return (
                <List>
                    <ListItem key={'option-none'} noIndent>
                        <Left>
                            <Text style={styles.grey}>None</Text>
                        </Left>
                    </ListItem>
                </List>
            );
        }

        return (
            <List>
                {options.map((item, index) => {
                    return (
                        <ListItem key={'option-' + index} noIndent>
                            <Left>
                                <TouchableHighlight onPress={() => this._showOptionInfo(item)}>
                                    <Text style={[styles.boldGrey, localStyles.big]}>
                                        {item.name + (item.displayNote === null ? '' : ': ' + item.displayNote)}
                                    </Text>
                                </TouchableHighlight>
                            </Left>
                            <Right>
                                <TouchableHighlight onPress={() => this._showRanksPicker(optionKey, item)}>
                                    <Text style={[styles.boldGrey, localStyles.big]}>
                                        R{(item.multipleRanks ? item.totalRanks * item.rank : item.rank)}
                                    </Text>
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
                <View style={styles.rowStart}>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} />
                    <View style={{flex: 4, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={styles.heading}>{title}</Text>
                    </View>
                    <View style={{flex: 1, paddingTop: 20, justifyContent: 'space-around', alignItems: 'center'}}>
                        <Icon
                            type='FontAwesome'
                            name='plus-square'
                            style={[styles.grey, {fontSize: 30, color: '#00ACED'}]}
                            onPress={() => this.props.navigation.navigate('Options', {optionKey: optionKey})}
                        />
                    </View>
                </View>
                {this._renderOptionList(this.props.character[arrayKey].items, optionKey)}
            </View>
        );
    }

	render() {
		return (
		    <Container style={styles.container}>
                <Header navigation={this.props.navigation} />
                <Content style={styles.content}>
                    <Appearance character={this.props.character} updateAppearance={this.props.updateAppearance} />
                    <View style={styles.titleContainer}>
                        <Text style={styles.grey}>
                            <Text style={styles.boldGrey}>Total Points:</Text> {this.props.character.getTotalPoints()}
                        </Text>
                        <Text style={styles.grey}>
                            <Text style={styles.boldGrey}>Complications:</Text> {this.props.character.getComplicationPoints()}
                        </Text>
                    </View>
                    {this._renderAttributes()}
                    {this._renderOptions('Advantages', OPTION_ADVANTAGES)}
                    {this._renderOptions('Complications', OPTION_COMPLICATIONS)}
                    {this._renderOptions('Special Abilities', OPTION_SPECIAL_ABILITIES)}
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
                        onSave={this.save}
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

const localStyles = StyleSheet.create({
	big: {
	    fontSize: 18,
	    lineHeight: 40
	}
});

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