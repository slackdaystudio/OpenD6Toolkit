import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {View} from 'react-native';
import {Container, Content, Text, Spinner, List, ListItem, Left, Right} from 'native-base';
import Header from '../Header';
import Heading from '../Heading';
import {Icon} from '../Icon';
import styles from '../../Styles';
import {character, TEMPLATE_FANTASY} from '../../lib/Character';
import {setArchitectTemplate} from '../../reducers/architect';

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

class NewTemplateScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        setArchitectTemplate: PropTypes.func.isRequired,
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
    }

    componentWillUnmount() {
        this.focusListener.remove();
    }

    _selectTemplate(template) {
        let newState = {...this.state};
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
                        <Heading text="New Template" />
                        <Spinner />
                    </Content>
                </Container>
            );
        }

        return (
            <Container style={styles.container}>
                <Header navigation={this.props.navigation} />
                <Content style={styles.content}>
                    <Heading text="New Template" onBackButtonPress={() => this.props.navigation.navigate(this.props.route.params.from)} />
                    <Text style={[styles.grey, {alignSelf: 'center'}]}>Select a template to base your new template off of.</Text>
                    <List>
                        {this.state.templates.map((template, index) => {
                            return (
                                <ListItem noIndent key={'t-' + index} onPress={() => this._selectTemplate(template)}>
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
    setArchitectTemplate,
};

export default connect(mapStateToProps, mapDispatchToProps)(NewTemplateScreen);
