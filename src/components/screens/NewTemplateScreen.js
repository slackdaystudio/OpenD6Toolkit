import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {View} from 'react-native';
import {Container, Content, Text, Spinner, List, ListItem, Left, Right} from 'native-base';
import {Header} from '../Header';
import Heading from '../Heading';
import {Icon} from '../Icon';
import {Button} from '../Button';
import ConfirmationDialog from '../ConfirmationDialog';
import styles from '../../Styles';
import {character, TEMPLATE_FANTASY} from '../../lib/Character';
import {file, BUILT_IN_TEMPLATE_NAMES} from '../../lib/File';
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
            confirmationDialog: {
                visible: false,
                title: 'Delete Template',
                info:
                    'This is permanent, are you certain you want to delete this template?\n\n' +
                    'Characters using this template will not be affected by this action.',
            },
        };

        this.listTemplates = this._listTemplates.bind(this);
        this.import = this._import.bind(this);
        this.onClose = this._closeConfirmationDialog.bind(this);
        this.onOk = this._deleteConfirmed.bind(this);
    }

    componentDidMount() {
        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.listTemplates();
        });
    }

    componentWillUnmount() {
        this.focusListener.remove();
    }

    _delete(template) {
        if (!BUILT_IN_TEMPLATE_NAMES.includes(template.name)) {
            let newState = {...this.state};
            newState.selectedTemplate = template;
            newState.confirmationDialog.visible = true;

            this.setState(newState);
        }
    }

    _deleteConfirmed() {
        file.deleteTemplate(this.state.selectedTemplate)
            .then(() => {
                this.listTemplates();
            })
            .catch(error => console.error(error));

        this._closeConfirmationDialog();
    }

    _closeConfirmationDialog() {
        let newState = {...this.state};
        newState.selectedTemplate = null;
        newState.confirmationDialog.visible = false;

        this.setState(newState);
    }

    _listTemplates() {
        this.setState({showSpinner: true}, () => {
            character.getTemplates().then(templates => {
                this.setState({templates: templates, showSpinner: false});
            });
        });
    }

    _selectTemplate(template) {
        let newState = {...this.state};
        newState.selected = template;

        this.setState(newState, () => {
            this.props.setArchitectTemplate(template);

            this.props.navigation.navigate('Architect');
        });
    }

    _import() {
        file.importTemplate(
            () => null,
            () => null,
        )
            .then(() => {
                this.listTemplates();
            })
            .catch(error => console.log(error));
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
                    <Heading text="New Template" />
                    <View style={{paddingBottom: 20}} />
                    <Button label="Import" onPress={this.import} />
                    <View style={{paddingBottom: 20}} />
                    <Text style={[styles.grey, {alignSelf: 'center'}]}>Long press a template to delete.</Text>
                    <List>
                        {this.state.templates.map((template, index) => {
                            return (
                                <ListItem noIndent key={'t-' + index} onPress={() => this._selectTemplate(template)} onLongPress={() => this._delete(template)}>
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
                    <ConfirmationDialog
                        visible={this.state.confirmationDialog.visible}
                        title={this.state.confirmationDialog.title}
                        info={this.state.confirmationDialog.info}
                        onOk={this.onOk}
                        onClose={this.onClose}
                    />
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
