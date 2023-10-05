import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {StyleSheet, View, Switch, TextInput} from 'react-native';
import {Form, Label, Item, Input} from 'native-base';
import {scale, verticalScale} from 'react-native-size-matters';
import {Header} from '../Header';
import Heading from '../Heading';
import ArchitectFooter from '../ArchitectFooter';
import styles from '../../Styles';
import {template} from '../../lib/Template';
import {common} from '../../lib/Common';
import {editTemplateOption} from '../../reducers/architect';

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

class EditOptionScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        editTemplateAttribute: PropTypes.func,
        deleteTemplateSkill: PropTypes.func.isRequired,
        template: PropTypes.object,
    };

    constructor(props) {
        super(props);

        this.state = EditOptionScreen.initState(props.route.params.option, props.route.params.optionKey, props.template);
    }

    static initState(option, optionKey, gameTemplate) {
        return {
            optionKey: optionKey,
            option: option,
            optionIndex: template.getOptionIndex(optionKey, option.id, gameTemplate),
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (props.route.params.option !== state.option) {
            return EditOptionScreen.initState(props.route.params.option, props.route.params.optionKey, props.template);
        }

        return state;
    }

    _validateInput(key, value) {
        let isValid = false;

        if (key === 'rank') {
            if (value === '') {
                isValid = true;
            }

            let intValue = parseInt(value, 10);

            if (intValue >= 0) {
                isValid = true;
            }
        } else {
            isValid = true;
        }

        return isValid;
    }

    _updateOptionField(key, value) {
        if (!this._validateInput(key, value)) {
            return;
        }

        let newState = {...this.state};
        newState.option[key] = value;

        this.setState(newState, () => {
            this.props.editTemplateOption(this.state.optionIndex, common.toCamelCase(this.state.optionKey), this.state.option);
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <Header navigation={this.props.navigation} />
                <View style={styles.content}>
                    <Heading text={this.state.optionKey} />
                    <Form>
                        <Item stackedLabel>
                            <Label style={{fontSize: scale(10), fontWeight: 'bold'}}>Rank</Label>
                            <Input
                                keyboardType="numeric"
                                style={styles.textInput}
                                maxLength={3}
                                value={this.state.option.rank.toString()}
                                onChangeText={value => this._updateOptionField('rank', value)}
                            />
                        </Item>
                        <Item stackedLabel>
                            <Label style={{fontSize: scale(10), fontWeight: 'bold'}}>Name</Label>
                            <Input
                                style={styles.textInput}
                                maxLength={64}
                                value={this.state.option.name}
                                onChangeText={value => this._updateOptionField('name', value)}
                            />
                        </Item>
                        <Item stackedLabel>
                            <Label style={{fontSize: scale(10), fontWeight: 'bold', paddingBottom: verticalScale(5)}}>Description</Label>
                            <TextInput
                                multiline={true}
                                style={styles.textAreaInput}
                                height={verticalScale(250)}
                                width="100%"
                                defaultValue={this.state.option.description.toString()}
                                onEndEditing={event => {
                                    event.preventDefault();

                                    this._updateOptionField('description', event.nativeEvent.text);
                                }}
                            />
                        </Item>
                        <Item>
                            <Label style={styles.boldGrey}>Allow Multiple Ranks To Be Selected?</Label>
                            <Switch
                                value={this.state.option.multipleRanks}
                                onValueChange={() => this._updateOptionField('multipleRanks', !this.state.option.multipleRanks)}
                                thumbColor="#f57e20"
                                trackColor={{true: '#fde5d2', false: '#4f4e4e'}}
                            />
                        </Item>
                    </Form>
                    <View style={{paddingBottom: 20}} />
                </View>
                <ArchitectFooter navigation={this.props.navigation} template={this.props.template} />
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        template: state.architect.template,
    };
};

const mapDispatchToProps = {
    editTemplateOption,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditOptionScreen);
