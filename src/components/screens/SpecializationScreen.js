import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {StyleSheet, View, TouchableHighlight, BackHandler, Alert} from 'react-native';
import {Container, Content, Button, Text, Item, Input, Picker, Form, Label} from 'native-base';
import {scale, verticalScale} from 'react-native-size-matters';
import Header from '../Header';
import ErrorMessage from '../ErrorMessage';
import Heading from '../Heading';
import LogoButton from '../LogoButton';
import Slider from '../DieSlider';
import styles from '../../Styles';
import {character} from '../../lib/Character';
import {editSpecialization, deleteSpecialization} from '../../reducers/builder';

// Copyright (C) Slack Day Studio - All Rights Reserved
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

class SpecializationScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        character: PropTypes.object.isRequired,
        editSpecialization: PropTypes.func.isRequired,
        deleteSpecialization: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = this._initState(props.route.params.specialization, props.character);

        this.updateDice = this._updateDice.bind(this);
    }

    componentDidMount() {
        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.setState(this._initState(this.props.route.params.specialization, this.props.character));
        });
    }

    componentWillUnmount() {
        this.focusListener.remove();
    }

    _initState(spec, char) {
        let specialization = {
            uuid: null,
            name: '',
            skillName: null,
            dice: 1,
            pips: 0,
        };
        let selectedAttribute = char.attributes[0];

        if (spec === null || spec === undefined) {
            specialization.skillName = selectedAttribute.skills[0].name;
        } else {
            specialization = spec;
            selectedAttribute = character.getAttributeBySkill(specialization.skillName || selectedAttribute.skills[0].name, char.attributes);
        }

        return {
            specialization: specialization,
            selectedAttribute: selectedAttribute,
            errorMessage: null,
        };
    }

    _updateAttribute(name) {
        let newState = {...this.state};

        for (let attribute of this.props.character.attributes) {
            if (attribute.name === name) {
                newState.selectedAttribute = attribute;
                newState.specialization.skillName = attribute.skills[0].name;
                break;
            }
        }

        this.setState(newState);
    }

    _updateSkill(value) {
        let newState = {...this.state};
        newState.specialization.skillName = value;

        this.setState(newState);
    }

    _updateName(value) {
        let newState = {...this.state};
        newState.specialization.name = value;

        this.setState(newState);
    }

    _updateDice(value) {
        let newState = {...this.state};
        let dice = '';

        if (value === '') {
            dice = value;
        } else {
            dice = parseInt(value, 10) || 1;

            if (dice > 30) {
                dice = 30;
            } else if (dice < 1) {
                dice = 1;
            }
        }

        newState.specialization.dice = dice;

        this.setState(newState);
    }

    _updatePips(value) {
        let newState = {...this.state};
        newState.specialization.pips = value;

        this.setState(newState);
    }

    _save() {
        this.setState({errorMessage: null}, () => {
            let errorMessage = null;

            if (this.state.specialization.dice === '') {
                errorMessage = 'Specializations may not go below 0';
            } else if (this.state.specialization.name.trim().length < 3) {
                errorMessage = 'Please provide a specialization name of at least 3 characters';
            }

            if (errorMessage !== null) {
                this.setState({errorMessage: errorMessage});
                return;
            }

            if (this.state.errorMessage === null) {
                this.props.editSpecialization(this.state.specialization);

                this.props.navigation.navigate('Builder');
            }
        });
    }

    _delete() {
        this.props.deleteSpecialization(this.state.specialization);

        this.props.navigation.navigate('Builder');
    }

    _renderAttributePicker() {
        return (
            <Item>
                <Label style={{fontSize: scale(12), fontWeight: 'bold'}}>Attribute:</Label>
                <Picker
                    stackedLabel
                    label="Attribute"
                    style={styles.picker}
                    textStyle={styles.grey}
                    placeholderIconColor="#FFFFFF"
                    iosHeader="Select Attribute"
                    mode="dropdown"
                    selectedValue={this.state.selectedAttribute.name}
                    onValueChange={value => this._updateAttribute(value)}>
                    {this.props.character.attributes.map((attribute, index) => {
                        return <Item key={attribute.name} label={attribute.name} value={attribute.name} />;
                    })}
                </Picker>
            </Item>
        );
    }

    _renderSkillPicker() {
        return (
            <Item>
                <Label style={{fontSize: scale(12), fontWeight: 'bold'}}>Skill:</Label>
                <Picker
                    stackedLabel
                    label="Skill"
                    style={styles.picker}
                    textStyle={styles.grey}
                    placeholderIconColor="#FFFFFF"
                    iosHeader="Select Skill"
                    mode="dropdown"
                    selectedValue={this.state.specialization.skillName}
                    onValueChange={value => this._updateSkill(value)}>
                    {this.state.selectedAttribute.skills.map((skill, index) => {
                        return <Item key={skill.name} label={skill.name} value={skill.name} />;
                    })}
                </Picker>
            </Item>
        );
    }

    _renderDeleteButton() {
        if (this.state.specialization.uuid === null) {
            return null;
        }

        return <LogoButton label="Delete" onPress={() => this._delete()} />;
    }

    render() {
        let mode = this.state.specialization.uuid === null ? 'Add' : 'Edit';

        return (
            <Container style={styles.container}>
                <Header navigation={this.props.navigation} />
                <Content style={styles.content}>
                    <Heading text={mode + ' Specialization'} onBackButtonPress={() => this.props.navigation.navigate('Builder')} />
                    <ErrorMessage errorMessage={this.state.errorMessage} />
                    <Form>
                        {this._renderAttributePicker()}
                        {this._renderSkillPicker()}
                        <Item stackedLabel>
                            <Label style={{fontSize: scale(10)}}>Name</Label>
                            <Input style={styles.grey} maxLength={30} value={this.state.specialization.name} onChangeText={value => this._updateName(value)} />
                        </Item>
                        <View style={{paddingLeft: scale(15), paddingRight: scale(10)}}>
                            <Slider
                                label="Dice:"
                                value={parseInt(this.state.specialization.dice, 10)}
                                step={1}
                                min={1}
                                max={20}
                                onValueChange={this.updateDice}
                                disabled={false}
                            />
                        </View>
                        <Item>
                            <Label style={{fontSize: scale(12), fontWeight: 'bold'}}>Pips:</Label>
                            <Picker
                                inlinelabel
                                label="Pips"
                                style={styles.picker}
                                textStyle={styles.grey}
                                placeholderIconColor="#FFFFFF"
                                iosHeader="Select Pips"
                                mode="dropdown"
                                selectedValue={this.state.specialization.pips}
                                onValueChange={value => this._updatePips(value)}>
                                <Item label="+0 pips" value={0} />
                                <Item label="+1 pip" value={1} />
                                <Item label="+2 pips" value={2} />
                            </Picker>
                        </Item>
                    </Form>
                    <View style={{paddingBottom: 20}} />
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around'}}>
                        <LogoButton label="Save" onPress={() => this._save()} />
                        {this._renderDeleteButton()}
                    </View>
                </Content>
            </Container>
        );
    }
}

const mapStateToProps = state => {
    return {
        character: state.builder.character,
    };
};

const mapDispatchToProps = {
    editSpecialization,
    deleteSpecialization,
};

export default connect(mapStateToProps, mapDispatchToProps)(SpecializationScreen);
