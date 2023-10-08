import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {View, Text} from 'react-native';
import {CardItem, Card, Right, Body, Icon} from 'native-base';
import {ScaledSheet, scale, moderateScale} from 'react-native-size-matters';
import styles from '../../Styles';
import Heading from '../Heading';
import ConfirmationDialog from '../ConfirmationDialog';
import {addTemplateAttribute, deleteTemplateAttribute} from '../../reducers/architect';

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

class AttributesAndSkills extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        template: PropTypes.object.isRequired,
        addTemplateAttribute: PropTypes.func.isRequired,
        deleteTemplateAttribute: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            toBeDeleted: null,
            confirmationDialog: {
                visible: false,
                title: 'Delete Attribute',
                info:
                    'This is permanent, are you certain you want to delete this attribute?\n\n' +
                    'All associated skills will also be deleted with this attribute.',
            },
        };

        this.onClose = this._closeConfirmationDialog.bind(this);
        this.onOk = this._deleteConfirmed.bind(this);
    }

    _delete(attribute) {
        let newState = {...this.state};
        newState.confirmationDialog.visible = true;
        newState.toBeDeleted = attribute;

        this.setState(newState);
    }

    _deleteConfirmed() {
        this.props.deleteTemplateAttribute(this.state.toBeDeleted);

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

    _addAttribute() {
        this.props.addTemplateAttribute();

        let index = this.props.template.attributes.length - 1;

        this.props.navigation.navigate('EditAttribute', {attribute: this.props.template.attributes[index]});
    }

    _renderSkills(attribute) {
        let skills = attribute.skills.map(skill => skill.name);

        return <Text style={{fontSize: scale(10), fontStyle: 'italic'}}>{skills.join(', ')}</Text>;
    }

    render() {
        return (
            <View>
                <Heading text="Attributes" />
                {this.props.template.attributes.map((attribute, index) => {
                    return (
                        <Card key={'atr-' + index}>
                            <CardItem>
                                <Body>
                                    <Text style={[styles.boldGrey, {fontSize: scale(16), lineHeight: scale(18)}]}>{attribute.name}</Text>
                                </Body>
                                <Right>
                                    <View style={{flex: 1, flexDirection: 'row'}}>
                                        <Icon
                                            type="FontAwesome"
                                            name="trash"
                                            style={[localStyles.button, {paddingRight: scale(5)}]}
                                            onPress={() => this._delete(attribute)}
                                        />
                                        <Icon
                                            type="FontAwesome"
                                            name="edit"
                                            style={[localStyles.button, {paddingTop: moderateScale(1, 1.5)}]}
                                            onPress={() => this.props.navigation.navigate('EditAttribute', {attribute: attribute})}
                                        />
                                    </View>
                                </Right>
                            </CardItem>
                            <CardItem>
                                <Body>
                                    <Text style={styles.grey}>{attribute.description}</Text>
                                </Body>
                            </CardItem>
                            <CardItem>
                                <Body>
                                    <Text style={styles.grey}>{this._renderSkills(attribute)}</Text>
                                </Body>
                            </CardItem>
                        </Card>
                    );
                })}
                <ConfirmationDialog
                    visible={this.state.confirmationDialog.visible}
                    title={this.state.confirmationDialog.title}
                    info={this.state.confirmationDialog.info}
                    onOk={this.onOk}
                    onClose={this.onClose}
                />
            </View>
        );
    }
}

const localStyles = ScaledSheet.create({
    button: {
        fontSize: '25@vs',
        color: '#f57e20',
    },
    buttonBig: {
        fontSize: '40@vs',
        color: '#f57e20',
    },
});

const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = {
    addTemplateAttribute,
    deleteTemplateAttribute,
};

export default connect(mapStateToProps, mapDispatchToProps)(AttributesAndSkills);
