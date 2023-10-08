import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {View} from 'react-native';
import {scale} from 'react-native-size-matters';
import {Animated} from '../animated/Animated';
import {Header, EXIT_APP} from '../Header';
import Heading from '../Heading';
import {IconButton, TEXT_BOTTOM} from '../IconButton';
import {common} from '../../lib/Common';

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

const slideInLeft = {
    from: {
        opacity: 0,
        translateX: -100,
    },
    to: {
        opacity: 1,
        translateX: 0,
    },
    animate: {
        opacity: 1,
        translateX: 0,
    },
};

const slideInRight = {
    from: {
        opacity: 0,
        translateX: 100,
    },
    to: {
        opacity: 1,
        translateX: 0,
    },
    animate: {
        opacity: 1,
        translateX: 0,
    },
};

class HomeScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        character: PropTypes.object,
        template: PropTypes.object,
    };

    constructor(props) {
        super(props);

        this.onBuilderPress = this._onBuilderPress.bind(this);
        this.onArchitectPress = this._onArchitectPress.bind(this);
    }

    _onBuilderPress() {
        if (!common.isEmptyObject(this.props.character) && this.props.character.name !== '') {
            this.props.navigation.navigate('Builder');
        }

        return null;
    }

    _onArchitectPress() {
        if (!common.isEmptyObject(this.props.template)) {
            this.props.navigation.navigate('Architect');
        }

        return null;
    }

    _getViewIconColor(selectedObject) {
        if (common.isEmptyObject(selectedObject) || selectedObject.name === '') {
            return 'rgba(245, 126, 32, 0.3)';
        }

        return '#f57e20';
    }

    _renderIcon(label, icon, onPress, animation, onLongPress = undefined) {
        let iconColor = '#f57e20';

        const textStyle = {...IconButton.defaultProps.textStyle};

        if (label.toLowerCase() === 'builder' || label.toLowerCase() === 'architect') {
            const color = this._getViewIconColor(label.toLowerCase() === 'builder' ? this.props.character : this.props.template);

            iconColor = color;
            textStyle.color = color;
        }

        animation.delay = 200;

        return (
            <Animated animationProps={animation}>
                <View>
                    <IconButton
                        label={label}
                        textPos={TEXT_BOTTOM}
                        icon={icon}
                        iconColor={iconColor}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        textStyle={textStyle}
                    />
                </View>
            </Animated>
        );
    }

    render() {
        return (
            <>
                <Header navigation={this.props.navigation} backScreen={EXIT_APP} />
                <Heading text="OpenD6 Toolkit" />
                <View flex={1} alignItems="center">
                    <View flex={1} flexDirection="row" alignItems="center" justifyContent="space-evenly" minWidth={scale(250)}>
                        {this._renderIcon('Builder', 'screwdriver-wrench', this.onBuilderPress, slideInLeft)}
                        {this._renderIcon('Characters', 'address-book', () => this.props.navigation.navigate('LoadCharacter'), slideInRight)}
                    </View>
                    <View flex={1} flexDirection="row" alignItems="center" justifyContent="space-evenly" minWidth={scale(250)}>
                        {this._renderIcon('Die Roller', 'dice-six', () => this.props.navigation.navigate('DieRoller'), slideInLeft)}
                        {this._renderIcon('Statistics', 'chart-pie', () => this.props.navigation.navigate('Statistics'), slideInRight)}
                    </View>
                    <View flex={1} flexDirection="row" alignItems="center" justifyContent="space-evenly" minWidth={scale(250)}>
                        {this._renderIcon('Architect', 'compass-drafting', this.onArchitectPress, slideInLeft)}
                        {this._renderIcon('Templates', 'layer-group', () => this.props.navigation.navigate('NewTemplate'), slideInRight)}
                    </View>
                    <View flex={1} flexDirection="row" alignItems="center" justifyContent="space-evenly" minWidth={scale(250)}>
                        {this._renderIcon('Mass Roller', 'dice', () => this.props.navigation.navigate('MassRoller'), slideInLeft)}
                        {this._renderIcon('Orchestrator', 'diagram-project', () => this.props.navigation.navigate('Orchestrator'), slideInRight)}
                    </View>
                </View>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        character: state.builder.character,
        template: state.architect.template,
    };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
