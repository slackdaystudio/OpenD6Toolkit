import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {View} from 'react-native';
import {Form, Item, Input, Label} from 'native-base';
import {scale} from 'react-native-size-matters';
import styles from '../../Styles';
import Heading from '../Heading';
import {common} from '../../lib/Common';
import {updateTemplateOverview} from '../../reducers/architect';

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

class Overview extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        template: PropTypes.object.isRequired,
        updateTemplateOverview: PropTypes.func,
    };

    _updateTemplateOverview(key, value) {
        let errorMessage = null;

        if (key === 'name' && value === '') {
            errorMessage = 'Name cannot be blank';
        } else {
            if (value !== '') {
                let intValue = parseInt(value === '' ? 0 : value, 10);

                if (intValue < 0) {
                    value = 1;
                }
            }
        }

        if (errorMessage == null) {
            this.props.updateTemplateOverview(key, value);
        } else {
            common.toast(errorMessage);
        }
    }

    render() {
        return (
            <View>
                <Heading text="Overview" />
                <Form>
                    <Item stackedLabel>
                        <Label style={{fontSize: scale(10), fontWeight: 'bold'}}>Name</Label>
                        <Input
                            style={styles.textInput}
                            maxLength={64}
                            value={this.props.template.name}
                            onChangeText={value => this._updateTemplateOverview('name', value)}
                        />
                    </Item>
                    <Item stackedLabel>
                        <Label style={{fontSize: scale(10), fontWeight: 'bold'}}>Attribute Minimum</Label>
                        <Input
                            style={styles.textInput}
                            maxLength={64}
                            value={this.props.template.attributeMin.toString()}
                            onChangeText={value => this._updateTemplateOverview('attributeMin', value)}
                        />
                    </Item>
                    <Item stackedLabel>
                        <Label style={{fontSize: scale(10), fontWeight: 'bold'}}>Attribute Maximum</Label>
                        <Input
                            style={styles.textInput}
                            maxLength={64}
                            value={this.props.template.attributeMax.toString()}
                            onChangeText={value => this._updateTemplateOverview('attributeMax', value)}
                        />
                    </Item>
                    <Item stackedLabel>
                        <Label style={{fontSize: scale(10), fontWeight: 'bold'}}>Move</Label>
                        <Input
                            style={styles.textInput}
                            maxLength={64}
                            value={this.props.template.move.toString()}
                            onChangeText={value => this._updateTemplateOverview('move', value)}
                        />
                    </Item>
                    <Item stackedLabel>
                        <Label style={{fontWeight: 'bold'}}>Character Points</Label>
                        <Input
                            style={styles.textInput}
                            maxLength={64}
                            value={this.props.template.characterPoints.toString()}
                            onChangeText={value => this._updateTemplateOverview('characterPoints', value)}
                        />
                    </Item>
                    <Item stackedLabel>
                        <Label style={{fontSize: scale(10), fontWeight: 'bold'}}>Fate Points</Label>
                        <Input
                            style={styles.textInput}
                            maxLength={64}
                            value={this.props.template.fatePoints.toString()}
                            onChangeText={value => this._updateTemplateOverview('fatePoints', value)}
                        />
                    </Item>
                </Form>
                <View style={{paddingBottom: 20}} />
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = {
    updateTemplateOverview,
};

export default connect(mapStateToProps, mapDispatchToProps)(Overview);
