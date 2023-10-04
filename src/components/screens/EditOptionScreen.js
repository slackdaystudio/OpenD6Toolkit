import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {StyleSheet, View, Switch} from 'react-native';
import {Container, Content, Form, Label, Item, Input, Textarea} from 'native-base';
import {scale, verticalScale} from 'react-native-size-matters';
import {Header} from '../Header';
import Heading from '../Heading';
import ArchitectFooter from '../ArchitectFooter';
import {TAB_ADVANTAGES, TAB_SPECIAL_ABILITIES, TAB_COMPLICATIONS} from './ArchitectScreen';
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
        editTemplateAttribute: PropTypes.func.isRequired,
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

    _keyboardDidHide() {
        if (!Number.isInteger(this.state.option.rank) || this.state.option.rank < 0) {
            let newState = {...this.state};
            newState.option.rank = 1;

            this.setState(newState);
        }
    }

    _validateInput(key, value) {
        let isValid = false;

        if (key === 'rank') {
            if (value === '') {
                isValid = true;
            }

            let intValue = parseInt(value, 10);

            if (value >= 0) {
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

    _getArchitectSelectedTab() {
        switch (this.state.optionKey) {
            case 'Advantages':
                return TAB_ADVANTAGES;
            case 'Special Abilities':
                return TAB_SPECIAL_ABILITIES;
            case 'Complications':
                return TAB_COMPLICATIONS;
            default:
            // do nothing, the Overview tab will be selected
        }
    }

    render() {
        return (
            <Container style={styles.container}>
                <Header navigation={this.props.navigation} />
                <Content style={styles.content}>
                    <Heading
                        text={this.state.optionKey}
                        onBackButtonPress={() => this.props.navigation.navigate('Architect', {selectedTab: this._getArchitectSelectedTab()})}
                    />
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
                            <Label style={{fontSize: scale(10), fontWeight: 'bold'}}>Description</Label>
                            <Textarea
                                rowSpan={18}
                                bordered
                                maxLength={5000}
                                style={{width: '100%', fontSize: verticalScale(18)}}
                                value={this.state.option.description}
                                onChangeText={value => this._updateOptionField('description', value)}
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
                </Content>
                <ArchitectFooter navigation={this.props.navigation} template={this.props.template} />
            </Container>
        );
    }
}

const localStyles = StyleSheet.create({
    button: {
        fontSize: 30,
        color: '#f57e20',
    },
});

const mapStateToProps = state => {
    return {
        template: state.architect.template,
    };
};

const mapDispatchToProps = {
    editTemplateOption,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditOptionScreen);
