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
import {
    updateRoller,
    updateCharacterDieCode,
    updateAppearance,
    updateAdvantage,
    removeAdvantage
} from '../../../reducer';

class BuilderScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        character: PropTypes.object.isRequired,
        updateRoller: PropTypes.func.isRequired,
        updateCharacterDieCode: PropTypes.func.isRequired,
        updateAppearance: PropTypes.func.isRequired,
        updateAdvantage: PropTypes.func.isRequired,
        removeAdvantage: PropTypes.func.isRequired
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
        this.updateAdvantage = this._updateAdvantage.bind(this);
        this.removeAdvantage = this._removeAdvantage.bind(this);
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

    _showAdvantageInfo(advantage) {
        let newState = {...this.state};
        newState.infoDialog.visible = true;
        newState.infoDialog.title = advantage.name + ' R' + (advantage.multipleRanks ? advantage.totalRanks : advantage.rank);
        newState.infoDialog.info = advantage.description;

        this.setState(newState);
    }

    _showRanksPicker(advantage) {
        let newState = {...this.state};
        newState.ranksDialog.visible = true;
        newState.ranksDialog.item = advantage;

        this.setState(newState);
    }

    _rollDice(dieCode) {
        let totalDieCode = this.props.character.getTotalDieCode(dieCode);
        this.props.updateRoller(totalDieCode.dice, totalDieCode.pips);

        this.props.navigation.navigate('DieRoller');
    }

    _rollSkillDice(attributeDieCode, skillDieCode) {
        let combinedDieCodes = {
            dice: parseInt(attributeDieCode.dice, 10) + parseInt(skillDieCode.dice, 10),
            modifierDice: parseInt(attributeDieCode.modifierDice, 10) + parseInt(skillDieCode.modifierDice, 10),
            pips: parseInt(attributeDieCode.pips, 10) + parseInt(skillDieCode.pips, 10),
            modifierPips: parseInt(attributeDieCode.modifierPips, 10) + parseInt(skillDieCode.modifierPips, 10)
        };

        let totalDieCode = this.props.character.getTotalDieCode(combinedDieCodes);

        this.props.updateRoller(totalDieCode.dice, totalDieCode.pips);
        this.props.navigation.navigate('DieRoller');
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

    _updateAdvantage(advantage) {
        this.props.updateAdvantage(advantage);

        this._closeRanksDialog();
    }

    _removeAdvantage(advantage) {
        this.props.removeAdvantage(advantage);
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

        this.setState(newState);
    }

    _save() {
        let newState = {...this.state};
        newState.dieCode.errorMessage = null;

        this.setState(newState, () => {
            let attributeMin = this.props.character.template.attributeMin;
            let isSkill = this.props.character.isSkill(this.state.dieCode.identifier);
            let totalDieCode = this.props.character.getTotalDieCode(this.state.dieCode);

            if (isSkill && totalDieCode.dice < 0) {
                newState.dieCode.errorMessage = 'Skills may not go below 0';
            } else if (!isSkill && totalDieCode.dice < attributeMin) {
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

    _renderAdvantages() {
        return (
            <View>
                <View style={styles.rowStart}>
                    <View style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={styles.heading}>Advantages</Text>
                    </View>
                    <View style={{flex: 1, paddingTop: 20, justifyContent: 'space-around', alignItems: 'center'}}>
                        <Icon
                            type='FontAwesome'
                            name='gear'
                            style={[styles.grey, {fontSize: 30, color: '#00ACED'}]}
                            onPress={() => this.props.navigation.navigate('Advantages')}
                        />
                    </View>
                </View>
                <List>
                    {this.props.character.advantages.advantages.map((advantage, index) => {
                        return (
                            <ListItem key={'advantage' + index} noIndent>
                                <Left>
                                    <TouchableHighlight onPress={() => this._showAdvantageInfo(advantage)}>
                                        <Text style={styles.grey}>{advantage.name}</Text>
                                    </TouchableHighlight>
                                </Left>
                                <Right>
                                    <TouchableHighlight onPress={() => this._showRanksPicker(advantage)}>
                                        <Text style={styles.grey}>
                                            R{(advantage.multipleRanks ? advantage.totalRanks : advantage.rank)}
                                        </Text>
                                    </TouchableHighlight>
                                </Right>
                            </ListItem>
                        );
                    })}
                </List>
            </View>
        );
    }

	render() {
		return (
		    <Container style={styles.container}>
                <Header navigation={this.props.navigation} />
                <Content style={styles.content}>
                    <Appearance character={this.props.character} updateAppearance={this.props.updateAppearance} />
                    {this._renderAttributes()}
                    {this._renderAdvantages()}
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
                        item={this.state.ranksDialog.item}
                        mode={MODE_EDIT}
                        onSave={this.updateAdvantage}
                        onClose={this.closeRanksDialog}
                        onDelete={this.removeAdvantage}
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
    updateAdvantage,
    removeAdvantage
}

export default connect(mapStateToProps, mapDispatchToProps)(BuilderScreen);