import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BackHandler, Platform, StyleSheet, ScrollView, View, TouchableHighlight, Image } from 'react-native';
import { Container, Content, Button, Text, Spinner, Card, CardItem, Body, Icon, List, ListItem, Left, Right } from 'native-base';
import Header from '../Header';
import Heading from '../Heading';
import LogoButton from '../LogoButton';
import styles from '../../Styles';
import { file } from '../../lib/File';
import { setArchitectTemplate } from '../../reducers/architect';

class OpenTemplateScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        setArchitectTemplate: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            selected: null,
            templates: null,
            showSpinner: false
        };
    }

    componentDidMount() {
        let newState = {...this.state};

        file.getCustomTemplates().then((templates) => {
            newState.templates = templates;

            this.setState(newState);
        });

        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.navigate('Architect');

            return true;
        });
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }

    _selectTemplate(template) {
        let newState = {...this.state};
        newState.showSpinner = true;
        newState.selected = template;

        this.setState(newState, () => {
            this.props.setArchitectTemplate(template);

            this.props.navigation.navigate('Architect');
        });
    }

	render() {
	    if (this.state.showSpinner || this.state.templates === null) {
	        return (
              <Container style={styles.container}>
                <Header navigation={this.props.navigation} />
                <Content style={styles.content}>
                    <Heading text="Open Template" />
                    <Spinner />
                </Content>
              </Container>
	        );
	    }

		return (
		  <Container style={styles.container}>
            <Header navigation={this.props.navigation} />
            <Content style={styles.content}>
                <Heading text='Open Template' onBackButtonPress={() => this.props.navigation.navigate('Architect')}/>
                <Text style={[styles.grey, {alignSelf: 'center'}]}>Select a template to open.</Text>
                <List>
                    {this.state.templates.map((template, index) => {
                        return (
                            <ListItem noIndent key={'t-' + index} onPress={() => this._selectTemplate(template)}>
                                <Left>
                                    <Text style={styles.grey}>{template.name}</Text>
                                </Left>
                                <Right>
                                    <Icon style={styles.grey} name="arrow-forward" />
                                </Right>
                            </ListItem>
                        );
                    })}
                </List>
                <View style={{paddingBottom: 20}} />
            </Content>
	      </Container>
		);
	}
}

const mapStateToProps = state => {
    return {
        template: state.architect.template
    };
}

const mapDispatchToProps = {
    setArchitectTemplate
}

export default connect(mapStateToProps, mapDispatchToProps)(OpenTemplateScreen);