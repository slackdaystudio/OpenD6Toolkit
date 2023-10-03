import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {BackHandler} from 'react-native';
import {Container, Content, Text, Tab, Tabs, TabHeading, ScrollableTab} from 'native-base';
import {ScaledSheet} from 'react-native-size-matters';
import Header from '../Header';
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

class ArchitectScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        template: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);

        let selectedTab = TAB_OVERVIEW;

        try {
            selectedTab = props.route.params.selectedTab;

            // Set the tab back to default or else it will be remembered on future visits
            props.route.params.selectedTab = TAB_OVERVIEW;
        } catch (error) {
            // swallow this exception
        } finally {
            this.state = {
                selectedTab: selectedTab,
            };
        }
    }

    componentDidMount() {
        if (this.state.selectedTab < TAB_OVERVIEW) {
            this.state.selectedTab = TAB_OVERVIEW;
        } else if (this.state.selectedTab > TAB_COMPLICATIONS) {
            this.state.selectedTab = TAB_COMPLICATIONS;
        }

        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.navigate('Home');

            return true;
        });

        setTimeout(this.tabs.goToPage.bind(this.tabs, this.state.selectedTab));
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
            <Container style={styles.container}>
                <Header navigation={this.props.navigation} hasTabs={true} />
                <Content style={styles.content}>
                    <Tabs
                        ref={t => {
                            this.tabs = t;
                            return;
                        }}
                        locked={true}
                        tabBarUnderlineStyle={{backgroundColor: '#FFF'}}
                        renderTabBar={() => <ScrollableTab style={{backgroundColor: '#f57e20'}} />}>
                        <Tab
                            heading={this._renderTabHeading('Overview')}
                            tabStyle={localStyles.tabHeading}
                            activeTabStyle={localStyles.activeTabStyle}
                            activeTextStyle={{color: '#FFF'}}>
                            <Overview navigation={this.props.navigation} template={this.props.template} />
                        </Tab>
                        <Tab
                            heading={this._renderTabHeading('Attributes')}
                            tabStyle={localStyles.tabHeading}
                            activeTabStyle={localStyles.activeTabStyle}
                            activeTextStyle={{color: '#FFF'}}>
                            <AttributesAndSkills navigation={this.props.navigation} template={this.props.template} />
                        </Tab>
                        <Tab
                            heading={this._renderTabHeading('Advantages')}
                            tabStyle={localStyles.tabHeading}
                            activeTabStyle={localStyles.activeTabStyle}
                            activeTextStyle={{color: '#FFF'}}>
                            <Options navigation={this.props.navigation} optionKey="Advantages" template={this.props.template} />
                        </Tab>
                        <Tab
                            heading={this._renderTabHeading('Special Abilities')}
                            tabStyle={localStyles.tabHeading}
                            activeTabStyle={localStyles.activeTabStyle}
                            activeTextStyle={{color: '#FFF'}}>
                            <Options navigation={this.props.navigation} optionKey="Special Abilities" template={this.props.template} />
                        </Tab>
                        <Tab
                            heading={this._renderTabHeading('Complications')}
                            tabStyle={localStyles.tabHeading}
                            activeTabStyle={localStyles.activeTabStyle}
                            activeTextStyle={{color: '#FFF'}}>
                            <Options navigation={this.props.navigation} optionKey="Complications" template={this.props.template} />
                        </Tab>
                    </Tabs>
                </Content>
                <ArchitectFooter navigation={this.props.navigation} template={this.props.template} />
            </Container>
        );
    }
}

const localStyles = ScaledSheet.create({
    tabHeading: {
        backgroundColor: '#f57e20',
    },
    activeTabStyle: {
        backgroundColor: '#f57e20',
        color: '#FFF',
    },
    tabStyle: {
        fontSize: '10@s',
        color: '#FFF',
    },
});

const mapStateToProps = state => {
    return {
        template: state.architect.template,
    };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ArchitectScreen);
