import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {View, Switch} from 'react-native';
import {Container, Content, Form, Item, Label, Input} from 'native-base';
import {scale} from 'react-native-size-matters';
import Header from '../Header';
import Heading from '../Heading';
import LogoButton from '../LogoButton';
import styles from '../../Styles';
import {editActor} from '../../reducers/orchestrator';

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

class EditActorScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        editActor: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = EditActorScreen.initState();
    }

    static getDerivedStateFromProps(props, state) {
        if (props.route.params.actor === null) {
            props.route.params.actor = EditActorScreen.initState();

            return props.route.params.actor;
        } else if (props.route.params.actor.uuid !== state.uuid) {
            let actor = {...props.route.params.actor};

            return actor;
        }

        return state;
    }

    static initState() {
        return {
            uuid: null,
            label: null,
            roll: 0,
            engaging: 'Unengaged',
            useBodyPoints: false,
            maxBodyPoints: 0,
            currentBodyPoints: 0,
            stunned: false,
            wounded: false,
            severelyWounded: false,
            incapacitated: false,
            mortallyWounded: false,
            dead: false,
        };
    }

    _updateActor(key, value) {
        let newState = {...this.state};

        if (key === 'maxBodyPoints' || key === 'currentBodyPoints') {
            if (value === '' || value === '-') {
                value = value;
            } else {
                value = parseInt(value, 10) || 1;

                if (value > 999) {
                    value = 999;
                } else if (value < -999) {
                    value = -999;
                } else if (key === 'currentBodyPoints' && value > newState.maxBodyPoints) {
                    value = newState.maxBodyPoints;
                }
            }
        }

        newState[key] = value;

        this.setState(newState);
    }

    _focusNumericInput(key) {
        let newState = {...this.state};

        if (newState[key] === 0) {
            newState[key] = '';
        }

        this.setState(newState);
    }

    _blurNumericInput(key) {
        let newState = {...this.state};
        let value = newState[key];

        if (value === null || value === undefined || value === '' || value === '-') {
            newState[key] = 0;
        }

        this.setState(newState);
    }

    _save() {
        this.props.editActor(this.state);

        this.props.navigation.navigate('Orchestrator');
    }

    _renderBodyPoints() {
        if (this.state.useBodyPoints) {
            return (
                <View>
                    <Item stackedLabel>
                        <Label style={{fontSize: scale(10), fontWeight: 'bold'}}>Maximum Body Points</Label>
                        <Input
                            style={styles.textInput}
                            keyboardType="numeric"
                            maxLength={3}
                            value={this.state.maxBodyPoints.toString()}
                            onChangeText={value => this._updateActor('maxBodyPoints', value)}
                            onFocus={value => this._focusNumericInput('maxBodyPoints')}
                            onBlur={value => this._blurNumericInput('maxBodyPoints')}
                        />
                    </Item>
                    <Item stackedLabel>
                        <Label style={{fontSize: scale(10), fontWeight: 'bold'}}>Current Body Points</Label>
                        <Input
                            style={styles.textInput}
                            keyboardType="numeric"
                            maxLength={3}
                            value={this.state.currentBodyPoints.toString()}
                            onChangeText={value => this._updateActor('currentBodyPoints', value)}
                            onFocus={value => this._focusNumericInput('currentBodyPoints')}
                            onBlur={value => this._blurNumericInput('currentBodyPoints')}
                        />
                    </Item>
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
                    <Heading text="Actor" onBackButtonPress={() => this.props.navigation.navigate('Orchestrator')} />
                    <Form>
                        <Item stackedLabel>
                            <Label style={{fontSize: scale(10), fontWeight: 'bold'}}>Name</Label>
                            <Input style={styles.textInput} maxLength={64} value={this.state.label} onChangeText={value => this._updateActor('label', value)} />
                        </Item>
                        <Item stackedLabel>
                            <Label style={{fontSize: scale(10), fontWeight: 'bold'}}>Roll</Label>
                            <Input
                                style={styles.textInput}
                                keyboardType="numeric"
                                maxLength={3}
                                value={this.state.roll.toString()}
                                onChangeText={value => this._updateActor('roll', value)}
                                onFocus={value => this._focusNumericInput('roll')}
                                onBlur={value => this._blurNumericInput('roll')}
                            />
                        </Item>
                        <Item>
                            <Label style={styles.boldGrey}>Use Body Points?</Label>
                            <Switch
                                value={this.state.useBodyPoints}
                                onValueChange={() => this._updateActor('useBodyPoints', !this.state.useBodyPoints)}
                                thumbColor="#f57e20"
                                trackColor={{true: '#fde5d2', false: '#4f4e4e'}}
                            />
                        </Item>
                        {this._renderBodyPoints()}
                    </Form>
                    <View style={{paddingBottom: 20}} />
                    <LogoButton label="Save" onPress={() => this._save()} />
                    <View style={{paddingBottom: 20}} />
                </Content>
            </Container>
        );
    }
}

const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = {
    editActor,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditActorScreen);
