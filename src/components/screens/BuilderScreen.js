import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Platform, StyleSheet, ScrollView, View, TouchableHighlight, Alert } from 'react-native';
import { Container, Content, Button, Text, Picker, Item, Input, List, ListItem, Left, Right } from 'native-base';
import Header from '../Header';
import AttributeDialog, { DIALOG_TYPE_TEXT, DIALOG_TYPE_DIE_CODE} from '../AttributeDialog';
import Appearance from '../builder/Appearance';
import styles from '../../Styles';
import { updateCharacterDieCode, updateAppearance } from '../../../reducer';


class BuilderScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        character: PropTypes.object.isRequired,
        updateCharacterDieCode: PropTypes.func.isRequired,
        updateAppearance: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            dialog: {
                visible: false,
                type: DIALOG_TYPE_TEXT,
                info: '',
            },
            dieCode: {
                identifier: '',
                dice: 0,
                pips: 0
            },
            attributeShow: this._initAttributeShow(props)
        }

        this.toggleAttributeShow = this._toggleAttributeShow.bind(this);
        this.close = this._closeDialog.bind(this);
        this.save = this._save.bind(this);
        this.updateDice = this._updateDice.bind(this);
        this.updatePips = this._updatePips.bind(this);
    }

    _initAttributeShow(props) {
        let attributeShow = {}

        props.character.template.attributes.map((attribute, index) => {
            attributeShow[attribute.name] = false
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
        newState.dialog.visible = true;
        newState.dialog.type = DIALOG_TYPE_DIE_CODE;
        newState.dieCode.identifier = identifier;
        newState.dieCode.dice = dieCode.dice;
        newState.dieCode.pips = dieCode.pips;

        this.setState(newState);
    }

    _showInfo(identifier) {
        let infoFound = false;
        let newState = {...this.state};
        newState.dialog.visible = true;
        newState.dialog.type = DIALOG_TYPE_TEXT;
        newState.dieCode.identifier = identifier;
        newState.dialog.info = this.props.character.getTemplateSkillOrAttribute(identifier).description;

        this.setState(newState);
    }

    _updateDice(value) {
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

        let newState = {...this.state};
        newState.dieCode.dice = dice;

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

    _closeDialog() {
        let newState = {...this.state}
        newState.dialog.visible = false;

        this.setState(newState);
    }

    _save() {
        if (!Number.isInteger(this.state.dieCode.dice)) {
            this._updateDice(1);
        }

        this.props.updateCharacterDieCode(this.state.dieCode);

        this.close();
    }

    _renderDieCode(dieCode) {
        return dieCode.dice + 'D' + (dieCode.pips > 0 ? '+' + dieCode.pips : '');
    }

	render() {
		return (
		    <Container style={styles.container}>
                <Header navigation={this.props.navigation} />
                <Content style={styles.content}>
                    <Appearance character={this.props.character} updateAppearance={this.props.updateAppearance} />
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
                                        <TouchableHighlight onPress={() => this.toggleAttributeShow(attribute.name)} onLongPress={() => this._showInfo(attribute.name)}>
                                            <Text style={[styles.boldGrey, localStyles.big]}>{attribute.name}</Text>
                                        </TouchableHighlight>
                                    </Left>
                                    <Right>
                                        <TouchableHighlight onLongPress={() => this._editDieCode(attribute.name, dieCode)}>
                                            <Text style={[styles.boldGrey, localStyles.big]}>{this._renderDieCode(dieCode)}</Text>
                                        </TouchableHighlight>
                                    </Right>
                                </ListItem>
                                {attribute.skills.map((skill, index) => {
                                    if (this.state.attributeShow[attribute.name]) {
                                        let dieCode = this.props.character.getDieCode(skill.name);

                                        return (
                                            <List key={'skill-' + index} style={{paddingLeft: 20}}>
                                                <ListItem>
                                                    <Left>
                                                        <TouchableHighlight onLongPress={() => this._showInfo(skill.name)}>
                                                            <Text style={[styles.grey, {lineHeight: 30}]}>{'\t' + skill.name}</Text>
                                                        </TouchableHighlight>
                                                    </Left>
                                                    <Right>
                                                        <TouchableHighlight onLongPress={() => this._editDieCode(skill.name, dieCode)}>
                                                            <Text style={[styles.boldGrey, {lineHeight: 30}]}>{this._renderDieCode(dieCode)}</Text>
                                                        </TouchableHighlight>
                                                    </Right>
                                                </ListItem>
                                            </List>
                                        );
                                    }

                                    return null;
                                })}
                            </View>
                        )
                    })}
                    </List>
                    <View style={{paddingBottom: 20}} />
                    <AttributeDialog
                        visible={this.state.dialog.visible}
                        type={this.state.dialog.type}
                        identifier={this.state.dieCode.identifier}
                        dice={this.state.dieCode.dice.toString()}
                        pips={this.state.dieCode.pips}
                        info={this.state.dialog.info}
                        close={this.close}
                        onSave={this.save}
                        onUpdateDice={this.updateDice}
                        onUpdatePips={this.updatePips}
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
    updateCharacterDieCode,
    updateAppearance
}

export default connect(mapStateToProps, mapDispatchToProps)(BuilderScreen);