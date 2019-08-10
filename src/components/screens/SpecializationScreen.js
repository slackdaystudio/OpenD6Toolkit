import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StyleSheet, View, TouchableHighlight, BackHandler, Alert } from 'react-native';
import { Container, Content, Button, Text, Item, Input, Picker, Form, Label } from 'native-base';
import { scale, verticalScale } from 'react-native-size-matters';
import Header from '../Header';
import ErrorMessage from '../ErrorMessage';
import Heading from '../Heading';
import LogoButton from '../LogoButton';
import Slider from '../DieSlider';
import styles from '../../Styles';
import { character } from '../../lib/Character';
import { editSpecialization, deleteSpecialization } from '../../reducers/builder';

class SpecializationScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        character: PropTypes.object.isRequired,
        editSpecialization: PropTypes.func.isRequired,
        deleteSpecialization: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);

        this.state = this._initState(props.navigation.state.params.specialization,  props.character);

        this.updateDice = this._updateDice.bind(this);
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.navigate('Builder');

            return true;
        });

        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            this.setState(this._initState(this.props.navigation.state.params.specialization,  this.props.character));
        });
    }

    componentWillUnmount() {
        this.backHandler.remove();
        this.focusListener.remove();
    }

    _initState(spec, char) {
        let specialization = {
            uuid: null,
            name: '',
            skillName: null,
            dice: 1,
            pips: 0
        };
        let selectedAttribute = char.attributes[0];

        if (spec === null) {
            specialization.skillName = selectedAttribute.skills[0].name;
        } else {
            specialization = spec;
            selectedAttribute = character.getAttributeBySkill(specialization.skillName || selectedAttribute.skills[0].name, char.attributes);
        }

        return {
            specialization: specialization,
            selectedAttribute: selectedAttribute,
            errorMessage: null
        };
    }

    _updateAttribute(name) {
        let newState = {...this.state};

        for (let attribute of this.props.character.attributes) {
            if (attribute.name === name) {
                newState.selectedAttribute = attribute;
                newState.specialization.skillName = attribute.skills[0].name
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
        })
    }

    _delete() {
        this.props.deleteSpecialization(this.state.specialization);

        this.props.navigation.navigate('Builder');
    }

    _renderAttributePicker() {
        return (
            <Item stackedLabel>
                <Label style={{fontSize: scale(10)}}>Attribute</Label>
                <Picker
                    stackedLabel
                    label='Attribute'
                    style={styles.picker}
                    textStyle={styles.grey}
                    placeholderIconColor="#FFFFFF"
                    iosHeader="Select Attribute"
                    mode="dropdown"
                    selectedValue={this.state.selectedAttribute.name}
                    onValueChange={(value) => this._updateAttribute(value)}
                >
                    {this.props.character.attributes.map((attribute, index) => {
                        return <Item key={attribute.name} label={attribute.name} value={attribute.name} />
                    })}
                </Picker>
            </Item>
        );
    }

    _renderSkillPicker() {
        return (
            <Item stackedLabel>
                <Label style={{fontSize: scale(10)}}>Skill</Label>
                <Picker
                    stackedLabel
                    label='Skill'
                    style={styles.picker}
                    textStyle={styles.grey}
                    placeholderIconColor="#FFFFFF"
                    iosHeader="Select Skill"
                    mode="dropdown"
                    selectedValue={this.state.specialization.skillName}
                    onValueChange={(value) => this._updateSkill(value)}
                >
                    {this.state.selectedAttribute.skills.map((skill, index) => {
                        return <Item key={skill.name} label={skill.name} value={skill.name} />
                    })}
                </Picker>
            </Item>
        );
    }

    _renderDeleteButton() {
        if (this.state.specialization.uuid === null) {
            return null;
        }

        return <LogoButton label='Delete' onPress={() => this._delete()} />
    }

	render() {
	    let mode = this.state.specialization.uuid === null ? 'Add' : 'Edit';

        return (
		    <Container style={styles.container}>
                <Header navigation={this.props.navigation} />
                <Content style={styles.content}>
                    <Heading
                        text={mode + ' Specialization'}
                        onBackButtonPress={() => this.props.navigation.navigate('Builder')}
                    />
                    <ErrorMessage errorMessage={this.state.errorMessage} />
                    <Form>
                        {this._renderAttributePicker()}
                        {this._renderSkillPicker()}
                        <Item stackedLabel>
                            <Label style={{fontSize: scale(10)}}>Name</Label>
                            <Input
                                style={styles.grey}
                                maxLength={30}
                                value={this.state.specialization.name}
                                onChangeText={(value) => this._updateName(value)}
                            />
                        </Item>
                        <View style={{paddingLeft: scale(15), paddingRight: scale(10)}}>
                            <Slider
                                label='Dice:'
                                value={parseInt(this.state.specialization.dice, 10)}
                                step={1}
                                min={1}
                                max={20}
                                onValueChange={this.updateDice}
                                disabled={false}
                            />
                        </View>
                        <Item stackedLabel>
                            <Label style={{fontSize: scale(10)}}>Pips</Label>
                            <Picker
                                inlinelabel
                                label='Pips'
                                style={styles.picker}
                                textStyle={styles.grey}
                                placeholderIconColor="#FFFFFF"
                                iosHeader="Select Pips"
                                mode="dropdown"
                                selectedValue={this.state.specialization.pips}
                                onValueChange={(value) => this._updatePips(value)}
                            >
                                <Item label="+0 pips" value={0} />
                                <Item label="+1 pip" value={1} />
                                <Item label="+2 pips" value={2} />
                            </Picker>
                        </Item>
                    </Form>
                    <View style={{paddingBottom: 20}} />
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around'}}>
                        <LogoButton label='Save' onPress={() => this._save()} />
                        {this._renderDeleteButton()}
                    </View>
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
    editSpecialization,
    deleteSpecialization
}

export default connect(mapStateToProps, mapDispatchToProps)(SpecializationScreen)
