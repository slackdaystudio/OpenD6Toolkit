import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {View} from 'react-native';
import {Container, Content, Form, Label, Item, Input, Textarea} from 'native-base';
import {scale, verticalScale} from 'react-native-size-matters';
import {Header} from '../Header';
import Heading from '../Heading';
import ArchitectFooter from '../ArchitectFooter';
import styles from '../../Styles';
import {template} from '../../lib/Template';
import {editTemplateSkill} from '../../reducers/architect';

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

class EditSkillScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        editTemplateSkill: PropTypes.func.isRequired,
        template: PropTypes.object,
    };

    constructor(props) {
        super(props);

        this.state = EditSkillScreen.initState(props.route.params.attribute, props.route.params.skill);
    }

    static initState(attribute, skill) {
        return {
            attribute: attribute,
            skill: skill,
            skillIndex: template.getSkillIndex(attribute, skill),
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (props.route.params.skill !== state.skill) {
            return EditSkillScreen.initState(props.route.params.attribute, props.route.params.skill);
        }

        return state;
    }

    _updateSkillField(key, value) {
        let newState = {...this.state};
        newState.skill[key] = value;

        this.setState(newState, () => {
            this.props.editTemplateSkill(this.state.attribute, this.state.skill, this.state.skillIndex);
        });
    }

    render() {
        return (
            <Container style={styles.container}>
                <Header navigation={this.props.navigation} />
                <Content style={styles.content}>
                    <Heading text="Skill" onBackButtonPress={() => this.props.navigation.navigate('EditAttribute', {attribute: this.state.attribute})} />
                    <Form>
                        <Item stackedLabel>
                            <Label style={{fontSize: scale(10), fontWeight: 'bold'}}>Name</Label>
                            <Input
                                style={styles.textInput}
                                maxLength={64}
                                value={this.state.skill.name}
                                onChangeText={value => this._updateSkillField('name', value)}
                            />
                        </Item>
                        <Item stackedLabel>
                            <Label style={{fontSize: scale(10), fontWeight: 'bold'}}>Description</Label>
                            <Textarea
                                rowSpan={5}
                                bordered
                                maxLength={255}
                                style={{width: '100%', fontSize: verticalScale(18)}}
                                value={this.state.skill.description}
                                onChangeText={value => this._updateSkillField('description', value)}
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

const mapStateToProps = state => {
    return {
        template: state.architect.template,
    };
};

const mapDispatchToProps = {
    editTemplateSkill,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditSkillScreen);
