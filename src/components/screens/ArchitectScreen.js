import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Dimensions} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Header from '../Header';
import {VirtualizedList} from '../VirtualizedList';
import {Placeholder} from './Placeholder';
import ArchitectFooter from '../ArchitectFooter';
import AttributesAndSkills from '../architect/AttributesAndSkills';
import Overview from '../architect/Overview';
import Options from '../architect/Options';
import styles from '../../Styles';

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

export const TAB_OVERVIEW = 0;

export const TAB_ATTRIBUTES = 1;

export const TAB_ADVANTAGES = 2;

export const TAB_SPECIAL_ABILITIES = 3;

export const TAB_COMPLICATIONS = 4;

const Tab = createMaterialTopTabNavigator();

const ArchitectTab = props => {
    return <VirtualizedList>{props.content}</VirtualizedList>;
};

const width = Dimensions.get('window').width;

const height = Dimensions.get('window').height;

class ArchitectScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        template: PropTypes.object.isRequired,
    };

    render() {
        return (
            <>
                <Header navigation={this.props.navigation} hasTabs={true} />
                <Tab.Navigator
                    sceneContainerStyle={styles.container}
                    screenOptions={{
                        tabBarLabelStyle: {color: styles.grey.color},
                        tabBarStyle: {backgroundColor: styles.container.backgroundColor},
                        tabBarIndicatorStyle: {backgroundColor: '#f57e20'},
                        tabBarScrollEnabled: true,
                        tabBarItemStyle: {width: 150},
                        lazy: true,
                        lazyPlaceholder: Placeholder,
                        swipeEnabled: false,
                    }}
                    initialLayout={{height, width}}>
                    <Tab.Screen name="Overview">{() => <ArchitectTab content={<Overview {...this.props} />} />}</Tab.Screen>
                    <Tab.Screen name="Attributes">{() => <ArchitectTab content={<AttributesAndSkills {...this.props} />} />}</Tab.Screen>
                    <Tab.Screen name="Advantages">{() => <ArchitectTab content={<Options {...this.props} optionKey="Advantages" />} />}</Tab.Screen>
                    <Tab.Screen name="Special Abilities">
                        {() => <ArchitectTab content={<Options {...this.props} optionKey="Special Abilities" />} />}
                    </Tab.Screen>
                    <Tab.Screen name="Complications">{() => <ArchitectTab content={<Options {...this.props} optionKey="Complications" />} />}</Tab.Screen>
                </Tab.Navigator>
                <ArchitectFooter navigation={this.props.navigation} template={this.props.template} />
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        template: state.architect.template,
    };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ArchitectScreen);
