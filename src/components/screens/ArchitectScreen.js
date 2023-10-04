import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {BackHandler, Dimensions, Text} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Header from '../Header';
import {VirtualizedList} from '../VirtualizedList';
import {Placeholder} from './Placeholder';
import ArchitectFooter from '../ArchitectFooter';
import AttributesAndSkills from '../architect/AttributesAndSkills';
import Overview from '../architect/Overview';
import Options from '../architect/Options';
import styles from '../../Styles';

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

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.navigate('Home');

            return true;
        });
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }

    _renderTabHeading(headingText) {
        return (
            <TabHeading style={localStyles.tabHeading}>
                <Text style={localStyles.tabStyle}>{headingText}</Text>
            </TabHeading>
        );
    }

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
                    <Tab.Screen name="Advantages">{() => <ArchitectTab content={<Options {...this.props} optionKey='Advantages' />} />}</Tab.Screen>
                    <Tab.Screen name="Special Abilities">{() => <ArchitectTab content={<Options {...this.props} optionKey='Special Abilities' />} />}</Tab.Screen>
                    <Tab.Screen name="Complications">{() => <ArchitectTab content={<Options {...this.props} optionKey='Complications' />} />}</Tab.Screen>
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
