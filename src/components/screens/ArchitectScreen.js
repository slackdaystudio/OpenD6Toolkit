import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Platform, StyleSheet, ScrollView, View, TouchableHighlight, Image } from 'react-native';
import { Container, Content, Button, Text, Spinner, Card, CardItem, Body, Icon, Tab, Tabs, ScrollableTab, Footer, FooterTab } from 'native-base';
import Header from '../Header';
import Heading from '../Heading';
import LogoButton from '../LogoButton';
import AttributesAndSkills from '../architect/AttributesAndSkills';
import Overview from '../architect/Overview';
import Options from '../architect/Options';
import styles from '../../Styles';
import { file } from '../../lib/File';

class ArchitectScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        template: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);
    }

	render() {
		return (
		  <Container style={styles.container}>
            <Header navigation={this.props.navigation} hasTabs={true} />
            <Content style={styles.content}>
                <Tabs locked={true} tabBarUnderlineStyle={{backgroundColor: '#FFF'}} renderTabBar={()=> <ScrollableTab />}>
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
            <Footer>
                <FooterTab style={{justifyContent: 'center', backgroundColor: '#f57e20'}}>
                    <Button vertical onPress={() => this.props.navigation.navigate('NewTemplate')}>
                        <Icon type='FontAwesome' name='file' style={{color: '#FFF'}} />
                        <Text uppercase={false} style={{color: '#FFF'}}>New</Text>
                    </Button>
                    <Button vertical onPress={() => file.saveTemplate(this.props.template)}>
                        <Icon type='FontAwesome' name='save' style={{color: '#FFF'}} />
                        <Text uppercase={false} style={{color: '#FFF'}}>Save</Text>
                    </Button>
                    <Button vertical onPress={() => this.props.navigation.navigate('OpenTemplate')}>
                        <Icon type='FontAwesome' name='folder-open' style={{color: '#FFF'}}/>
                        <Text uppercase={false} style={{color: '#FFF'}}>Open</Text>
                    </Button>
                    <Button vertical onPress={() => file.uploadTemplate(() => {}, () => {})}>
                        <Icon type='FontAwesome' name='download' style={{color: '#FFF'}}/>
                        <Text uppercase={false} style={{color: '#FFF'}}>Import</Text>
                    </Button>
                    <Button vertical onPress={() => this.props.navigation.navigate('TemplateDelete')}>
                        <Icon type='FontAwesome' name='trash' style={{color: '#FFF'}}/>
                        <Text uppercase={false} style={{color: '#FFF'}}>Delete</Text>
                    </Button>
                </FooterTab>
            </Footer>
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