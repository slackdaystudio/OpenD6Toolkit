import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {View, Switch} from 'react-native';
import {Container, Content, Text, Card, CardItem, Body, Icon, Form, Label, Item, Input, Textarea, Right} from 'native-base';
import {ScaledSheet, scale, verticalScale, moderateScale} from 'react-native-size-matters';
import Header from '../Header';
import Heading from '../Heading';
import ArchitectFooter from '../ArchitectFooter';
import ConfirmationDialog from '../ConfirmationDialog';
import {TAB_ATTRIBUTES} from './ArchitectScreen';
import {template} from '../../lib/Template';
import styles from '../../Styles';
import {editTemplateAttribute, addTemplateSkill, deleteTemplateSkill} from '../../reducers/architect';

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

class EditAttributeScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        editTemplateAttribute: PropTypes.func,
        addTemplateAttribute: PropTypes.func,
        deleteTemplateSkill: PropTypes.func,
        template: PropTypes.object,
    };

    constructor(props) {
        super(props);

        this.state = EditAttributeScreen.initState(props.route.params.attribute, props.template);

        this.onClose = this._closeConfirmationDialog.bind(this);
        this.onOk = this._deleteConfirmed.bind(this);
    }

    static initState(attribute, gameTemplate) {
        return {
            attribute: attribute,
            attributeIndex: template.getAttributeIndex(attribute.name, gameTemplate),
            toBeDeleted: null,
            confirmationDialog: {
                visible: false,
                title: 'Delete Skill',
                info: 'This is permanent, are you certain you want to delete this skill?',
            },
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (props.route.params.attribute !== state.attribute) {
            return EditAttributeScreen.initState(props.route.params.attribute, props.template);
        }

        return state;
    }

    _delete(skill) {
        let newState = {...this.state};
        newState.confirmationDialog.visible = true;
        newState.toBeDeleted = skill;

        this.setState(newState);
    }

    _deleteConfirmed() {
        this.props.deleteTemplateSkill(this.state.attribute.name, this.state.toBeDeleted);

        let newState = {...this.state};
        newState.toBeDeleted = null;

        this.setState(newState, () => {
            this._closeConfirmationDialog();
        });
    }

    _closeConfirmationDialog() {
        let newState = {...this.state};
        newState.confirmationDialog.visible = false;

        this.setState(newState);
    }

    _updateAttributeField(key, value) {
        let newState = {...this.state};
        newState.attribute[key] = value;

        this.setState(newState, () => {
            this.props.editTemplateAttribute(this.state.attribute, this.state.attributeIndex);
        });
    }

    _addSkill() {
        this.props.addTemplateSkill(this.state.attributeIndex);

        this.props.navigation.navigate('EditSkill', {
            attribute: this.state.attribute,
            skill: this.state.attribute.skills[this.state.attribute.skills.length - 1],
        });
    }

    _renderSkills() {
        if (this.state.attribute.skills.length > 0) {
            return (
                <View>
                    {this.state.attribute.skills.map((skill, index) => {
                        return (
                            <Card key={`skill-${index}`}>
                                <CardItem>
                                    <Body>
                                        <Text style={[styles.boldGrey, {fontSize: scale(16), lineHeight: scale(18)}]}>{skill.name}</Text>
                                    </Body>
                                    <Right>
                                        <View style={{flex: 1, flexDirection: 'row'}}>
                                            <Icon
                                                type="FontAwesome"
                                                name="trash"
                                                style={[localStyles.button, {paddingRight: scale(5)}]}
                                                onPress={() => this._delete(skill)}
                                            />
                                            <Icon
                                                type="FontAwesome"
                                                name="edit"
                                                style={[localStyles.button, {paddingTop: moderateScale(1, 1.5)}]}
                                                onPress={() => this.props.navigation.navigate('EditSkill', {attribute: this.state.attribute, skill: skill})}
                                            />
                                        </View>
                                    </Right>
                                </CardItem>
                                <CardItem>
                                    <Body>
                                        <Text style={styles.grey}>{skill.description}</Text>
                                    </Body>
                                </CardItem>
                            </Card>
                        );
                    })}
                </View>
            );
        }

        return null;
    }

    render() {
        return (
            <Container style={styles.container}>
                <Header navigation={this.props.navigation} />
                <Content style={styles.content}>
                    <Heading text="Attribute" onBackButtonPress={() => this.props.navigation.navigate('Architect', {selectedTab: TAB_ATTRIBUTES})} />
                    <Form>
                        <Item stackedLabel>
                            <Label style={{fontSize: scale(10), fontWeight: 'bold'}}>Name</Label>
                            <Input
                                style={styles.textInput}
                                maxLength={64}
                                value={this.state.attribute.name}
                                onChangeText={value => this._updateAttributeField('name', value)}
                            />
                        </Item>
                        <Item stackedLabel>
                            <Label style={{fontSize: scale(10), fontWeight: 'bold'}}>Description</Label>
                            <Textarea
                                rowSpan={5}
                                bordered
                                maxLength={255}
                                style={{width: '100%', fontSize: verticalScale(18)}}
                                value={this.state.attribute.description}
                                onChangeText={value => this._updateAttributeField('description', value)}
                            />
                        </Item>
                        <Item>
                            <Label style={{fontSize: scale(10), fontWeight: 'bold'}}>Is Extranormal?</Label>
                            <Switch
                                value={this.state.attribute.isExtranormal}
                                onValueChange={() => this._updateAttributeField('isExtranormal', !this.state.attribute.isExtranormal)}
                                thumbColor="#f57e20"
                                trackColor={{true: '#fde5d2', false: '#4f4e4e'}}
                            />
                        </Item>
                    </Form>
                    <View style={{paddingBottom: 20}} />
                    <Heading text="Skills" onAddButtonPress={() => this._addSkill()} />
                    {this._renderSkills()}
                    <View style={{paddingBottom: 20}} />
                    <ConfirmationDialog
                        visible={this.state.confirmationDialog.visible}
                        title={this.state.confirmationDialog.title}
                        info={this.state.confirmationDialog.info}
                        onOk={this.onOk}
                        onClose={this.onClose}
                    />
                </Content>
                <ArchitectFooter navigation={this.props.navigation} template={this.props.template} />
            </Container>
        );
    }
}

const localStyles = ScaledSheet.create({
    button: {
        fontSize: '25@vs',
        color: '#f57e20',
    },
});

const mapStateToProps = state => {
    return {
        template: state.architect.template,
    };
};

const mapDispatchToProps = {
    editTemplateAttribute,
    addTemplateSkill,
    deleteTemplateSkill,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditAttributeScreen);
