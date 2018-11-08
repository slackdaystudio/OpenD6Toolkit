import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Platform, StyleSheet, ScrollView, View, TouchableHighlight, Alert } from 'react-native';
import { Container, Content, Button, Text, Picker, Item, Input } from 'native-base';
import Header from '../Header';
import AttributeDialog, { DIALOG_TYPE_TEXT, DIALOG_TYPE_DIE_CODE} from '../AttributeDialog';
import styles from '../../Styles';


class BuilderScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        character: PropTypes.object.isRequired
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

    _editDieCode(identifier, value) {
        let newState = {...this.state};
        newState.dialog.visible = true;
        newState.dialog.type = DIALOG_TYPE_DIE_CODE;
        newState.dieCode.identifier = identifier;
        newState.dieCode.dice = 3;
        newState.dieCode.pips = 0;

        this.setState(newState);
    }

    _showInfo(identifier) {
        let infoFound = false;
        let newState = {...this.state};
        newState.dialog.visible = true;
        newState.dialog.type = DIALOG_TYPE_TEXT;
        newState.dieCode.identifier = identifier;
        newState.dialog.info = '--';

        for (let attribute of this.props.character.template.attributes) {
            if (attribute.name === identifier) {
                newState.dialog.info = attribute.description;
                break;
            } else {
                for (let skill of attribute.skills) {
                    if (skill.name === identifier) {
                        newState.dialog.info = skill.description;
                        infoFound = true;
                        break;
                    }
                }

                if (infoFound) {
                    break;
                }
            }
        }

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
        // TODO: save character

        if (!Number.isInteger(this.state.dieCode.dice)) {
            this._updateDice(1);
        }

        this.close();
    }

	render() {
		return (
		    <Container style={styles.container}>
                <Header navigation={this.props.navigation} />
                <Content style={styles.content}>
                    <Text style={styles.heading}>Attributes &amp; Skills</Text>
                    {this.props.character.template.attributes.map((attribute, index) => {
                        return (
                            <View key={'atr-' + index} style={localStyles.rowStart}>
                                <View style={localStyles.row}>
                                    <TouchableHighlight onPress={() => this.toggleAttributeShow(attribute.name)} onLongPress={() => this._showInfo(attribute.name)}>
                                        <Text style={[styles.boldGrey, localStyles.big]}>{attribute.name}</Text>
                                    </TouchableHighlight>
                                    {attribute.skills.map((skill, index) => {
                                        if (this.state.attributeShow[attribute.name]) {
                                            return (
                                                <View key={'skill-' + index} style={localStyles.rowStart}>
                                                    <View style={{flex: 6, alignSelf: 'stretch'}}>
                                                        <TouchableHighlight onLongPress={() => this._showInfo(skill.name)}>
                                                            <Text style={[styles.grey, {lineHeight: 30}]}>{'\t' + skill.name}</Text>
                                                        </TouchableHighlight>
                                                    </View>
                                                    <View style={localStyles.row}>
                                                        <TouchableHighlight onLongPress={() => this._editDieCode(skill.name, '3D')}>
                                                            <Text style={[styles.boldGrey, {lineHeight: 30}]}>3D</Text>
                                                        </TouchableHighlight>
                                                    </View>
                                                </View>
                                            );
                                        }

                                        return null;
                                    })}
                                </View>
                                <View style={{flex: 1, alignItems: 'stretch'}}>
                                    <TouchableHighlight onLongPress={() => this._editDieCode(attribute.name, '3D')}>
                                        <Text style={[styles.boldGrey, localStyles.big]}>3D</Text>
                                    </TouchableHighlight>
                                </View>
                            </View>
                        )
                    })}
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
	},
	rowStart: {
        flex: 1,
        alignSelf: 'stretch',
        flexDirection: 'row'
	},
	row: {
	    flex: 1,
	    alignSelf: 'center',
	}
});

const mapStateToProps = state => {
    return {
        character: state.builder.character
    };
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(BuilderScreen);