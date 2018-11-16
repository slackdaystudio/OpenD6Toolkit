import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StyleSheet, View, TouchableHighlight, BackHandler } from 'react-native';
import { Container, Content, Button, Text, Item, Input, Picker, Form, Label } from 'native-base';
import Header from '../Header';
import ErrorMessage from '../ErrorMessage';
import Heading from '../Heading';
import styles from '../../Styles';
import { character } from '../../lib/Character';

class SpecializationScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        character: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);

        let specialization = props.navigation.state.params || this._initSpecialization()

        this.state = {
            specialization: specialization,
            selectedAttribute: props.character.attributes[0],
            errorMessage: null
        }
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.navigate('Builder');

            return true;
        });
    }

    _initSpecialization() {
        return {
           name: null,
           skillName: null,
           dice: 0,
           pips: 0
       };
    }

    _updateAttribute(name) {
        let newState = {...this.state};

        for (let attribute of this.props.character.attributes) {
            if (attribute.name === name) {
                newState.selectedAttribute = attribute;
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
        newState.specialization.dice = value;

        this.setState(newState);
    }

    _updatePips(value) {
        let newState = {...this.state};
        newState.specialization.pips = value;

        this.setState(newState);
    }

    _save() {

    }

    _renderAttributePicker() {
        return (
            <Picker
                stackedLabel
                label='Attribute'
                style={styles.picker}
                textStyle={styles.grey}
                placeholderIconColor="#FFFFFF"
                iosHeader="Select one"
                mode="dropdown"
                selectedValue={this.state.selectedAttribute.name}
                onValueChange={(value) => this._updateAttribute(value)}
            >
                {this.props.character.attributes.map((attribute, index) => {
                    return <Item key={attribute.name} label={attribute.name} value={attribute.name} />
                })}
            </Picker>
        );
    }

    _renderSkillPicker() {
        return (
            <Picker
                stackedLabel
                label='Skill'
                style={styles.picker}
                textStyle={styles.grey}
                placeholderIconColor="#FFFFFF"
                iosHeader="Select one"
                mode="dropdown"
                selectedValue={this.state.specialization.skillName}
                onValueChange={(value) => this._updateSkill(value)}
            >
                {this.state.selectedAttribute.skills.map((skill, index) => {
                    return <Item key={skill.name} label={skill.name} value={skill.name} />
                })}
            </Picker>
        );
    }

	render() {
        return (
		    <Container style={styles.container}>
                <Header navigation={this.props.navigation} />
                <Content style={styles.content}>
                    <Heading
                        text='Edit Specialization'
                        onBackButtonPress={() => this.props.navigation.navigate('Builder')}
                    />
                    <ErrorMessage errorMessage={this.state.errorMessage} />
                    {this._renderAttributePicker()}
                    {this._renderSkillPicker()}
                    <View style={styles.contentPadded}>
                        <Item stackedLabel>
                            <Label>Name</Label>
                            <Input
                                style={styles.grey}
                                maxLength={30}
                                value={this.state.specialization.name}
                                onChangeText={(value) => this._updateName(value)}
                            />
                        </Item>
                        <View style={[styles.rowStart, {paddingHorizontal: 5}]}>
                            <View style={[styles.row, {alignSelf: 'center'}]}>
                                <Text style={styles.grey}>Dice</Text>
                            </View>
                            <View style={[styles.row, {alignSelf: 'center'}]}>
                                <Item underline>
                                    <Input
                                        style={styles.grey}
                                        keyboardType='numeric'
                                        maxLength={2}
                                        value={this.state.specialization.dice.toString()}
                                        onChangeText={(value) => this._updateDice(value)}
                                    />
                                </Item>
                            </View>
                            <View style={[styles.row, {flex: 2, alignSelf: 'center'}]}>
                                <Picker
                                    inlinelabel
                                    label='Pips'
                                    style={styles.picker}
                                    textStyle={styles.grey}
                                    placeholderIconColor="#FFFFFF"
                                    iosHeader="Select one"
                                    mode="dropdown"
                                    selectedValue={this.state.specialization.pips}
                                    onValueChange={(value) => this._updatePips(value)}
                                >
                                    <Item label="+0 pips" value={0} />
                                    <Item label="+1 pip" value={1} />
                                    <Item label="+2 pips" value={2} />
                                </Picker>
                            </View>
                        </View>
                    </View>
                    <View style={{paddingBottom: 20}} />
                    <View style={styles.buttonContainer}>
                        <Button block style={styles.button} onPress={() => this._save()}>
                            <Text uppercase={false}>Save</Text>
                        </Button>
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

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(SpecializationScreen)