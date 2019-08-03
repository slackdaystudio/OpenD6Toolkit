import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Platform, StyleSheet, ScrollView, View, TouchableHighlight, Image, Alert } from 'react-native';
import { Container, Content, Button, Text, Spinner, Card, CardItem, Body, Icon, Tab, Tabs, ScrollableTab, Footer, FooterTab } from 'native-base';
import Header from '../Header';
import Heading from '../Heading';
import LogoButton from '../LogoButton';
import ArchitectFooter from '../ArchitectFooter';
import AttributesAndSkills from '../architect/AttributesAndSkills';
import Overview from '../architect/Overview';
import Options from '../architect/Options';
import styles from '../../Styles';
import { file } from '../../lib/File';

export const TAB_OVERVIEW = 0;

export const TAB_ATTRIBUTES = 1;

export const TAB_ADVANTAGES = 2;

export const TAB_SPECIAL_ABILITIES = 3;

export const TAB_COMPLICATIONS = 4;

class ArchitectScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        template: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);

        let selectedTab = TAB_OVERVIEW;

        try {
            selectedTab = props.navigation.state.params.selectedTab;
        } catch (error) {
            // swallow this exception
        } finally {
            this.state = {
                selectedTab: selectedTab
            };
        }
    }

    componentDidMount() {
        if (this.state.selectedTab < TAB_OVERVIEW) {
            this.state.selectedTab = TAB_OVERVIEW;
        } else if (this.state.selectedTab > TAB_COMPLICATIONS) {
            this.state.selectedTab = TAB_COMPLICATIONS;
        }

        setTimeout(this.tabs.goToPage.bind(this.tabs, this.state.selectedTab));
    }

	render() {
		return (
		  <Container style={styles.container}>
            <Header navigation={this.props.navigation} hasTabs={true} />
            <Content style={styles.content}>
                <Tabs ref={(t) => { this.tabs = t; return;}} locked={true} tabBarUnderlineStyle={{backgroundColor: '#FFF'}} renderTabBar={()=> <ScrollableTab />}>
                    <Tab heading='Overview' tabStyle={localStyles.tabHeading} activeTabStyle={localStyles.activeTabStyle} activeTextStyle={{color: '#FFF'}}>
                        <Overview navigation={this.props.navigation} template={this.props.template} />
                    </Tab>
                    <Tab heading='Attributes' tabStyle={localStyles.tabHeading} activeTabStyle={localStyles.activeTabStyle} activeTextStyle={{color: '#FFF'}}>
                        <AttributesAndSkills navigation={this.props.navigation} template={this.props.template} />
                    </Tab>
                    <Tab heading='Advantages' tabStyle={localStyles.tabHeading} activeTabStyle={localStyles.activeTabStyle} activeTextStyle={{color: '#FFF'}}>
                        <Options navigation={this.props.navigation} optionKey='Advantages' template={this.props.template} />
                    </Tab>
                    <Tab heading='Special Abilities' tabStyle={localStyles.tabHeading} activeTabStyle={localStyles.activeTabStyle} activeTextStyle={{color: '#FFF'}}>
                        <Options navigation={this.props.navigation} optionKey='Special Abilities' template={this.props.template} />
                    </Tab>
                    <Tab heading='Complications' tabStyle={localStyles.tabHeading} activeTabStyle={localStyles.activeTabStyle} activeTextStyle={{color: '#FFF'}}>
                        <Options navigation={this.props.navigation} optionKey='Complications' template={this.props.template} />
                    </Tab>
                </Tabs>
            </Content>
            <ArchitectFooter navigation={this.props.navigation} template={this.props.template} />
	      </Container>
		);
	}
}

const localStyles = StyleSheet.create({
	tabHeading: {
		backgroundColor: '#f57e20'
	},
	activeTabStyle: {
		backgroundColor: '#f57e20',
		color: '#FFF'
	}
});

const mapStateToProps = state => {
    return {
        template: state.architect.template
    };
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(ArchitectScreen);