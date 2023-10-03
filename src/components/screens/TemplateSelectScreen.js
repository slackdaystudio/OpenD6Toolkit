import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {BackHandler, Platform, StyleSheet, View, Alert} from 'react-native';
import {Container, Content, Button, Text, List, ListItem, Left, Right, Spinner} from 'native-base';
import Header from '../Header';
import Heading from '../Heading';
import {Icon} from '../Icon';
import styles from '../../Styles';
import {character, TEMPLATE_FANTASY} from '../../lib/Character';
import {file} from '../../lib/File';
import {setTemplate} from '../../reducers/builder';

class TemplateSelectScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        setTemplate: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            selected: TEMPLATE_FANTASY,
            templates: null,
            showSpinner: false,
        };
    }

    componentDidMount() {
        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.setState({showSpinner: true}, () => {
                character.getTemplates().then(templates => {
                    this.setState({templates: templates, showSpinner: false});
                });
            });
        });

        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.navigate(this.props.route.params.from);

            return true;
        });
    }

    componentWillUnmount() {
        this.backHandler.remove();
        this.focusListener.remove();
    }

    _next(template) {
        let newState = {...this.state};
        newState.selected = template;

        this.setState(newState, () => {
            this.props.setTemplate(template);

            this.props.navigation.navigate('Builder');
        });
    }

    render() {
        if (this.state.showSpinner || this.state.templates === null) {
            return (
                <Container style={styles.container}>
                    <Header navigation={this.props.navigation} />
                    <Content style={styles.content}>
                        <Heading text="Template Select" />
                        <Spinner />
                    </Content>
                </Container>
            );
        }

        return (
            <Container style={styles.container}>
                <Header navigation={this.props.navigation} />
                <Content style={styles.content}>
                    <Heading text="Template Select" onBackButtonPress={() => this.props.navigation.navigate(this.props.route.params.from)} />
                    <Text style={[styles.grey, {alignSelf: 'center'}]}>Select your template from the list below.</Text>
                    <List>
                        {this.state.templates.map((template, index) => {
                            return (
                                <ListItem noIndent key={'t-' + index} onPress={() => this._next(template)}>
                                    <Left>
                                        <Text style={styles.grey}>{template.name}</Text>
                                    </Left>
                                    <Right>
                                        <Icon style={styles.grey} name="circle-arrow-right" />
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
    return {};
};

const mapDispatchToProps = {
    setTemplate,
};

export default connect(mapStateToProps, mapDispatchToProps)(TemplateSelectScreen);
