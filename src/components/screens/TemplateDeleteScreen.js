import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet, View, Alert } from 'react-native';
import { Container, Content, Button, Text, List, ListItem, Body, Icon, Spinner } from 'native-base';
import Header from '../Header';
import Heading from '../Heading';
import ConfirmationDialog from '../ConfirmationDialog';
import styles from '../../Styles';
import { file } from '../../lib/File';

export default class TemplateDeleteScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            selectedTemplate: null,
            templates: [],
            showSpinner: true,
            confirmationDialog: {
                visible: false,
                title: 'Delete Template',
                info: 'This is permanent, are you certain you want to delete this template?\n\n' +
                    'Characters using this template will not be affected by this action.'
            }
        };

        this.onClose = this._closeConfirmationDialog.bind(this);
        this.onOk = this._deleteConfirmed.bind(this);
    }

    componentDidMount() {
        this._updateFileList();
    }

    _delete(template) {
        let newState = {...this.state};
        newState.selectedTemplate = template;
        newState.confirmationDialog.visible = true;

        this.setState(newState);
    }

    _deleteConfirmed() {
        file.deleteTemplate(this.state.selectedTemplate).then(() => {
            this._updateFileList();
        });

        this._closeConfirmationDialog();
    }

    _closeConfirmationDialog() {
        let newState = {...this.state};
        newState.selectedTemplate = null;
        newState.confirmationDialog.visible = false;

        this.setState(newState);
    }

    _updateFileList() {
        let newState = {...this.state};
        newState.templates = [];
        newState.showSpinner = false;

        file.getTemplates().then((templates) => {
            for (let template of templates) {
                newState.templates.push(JSON.parse(template));
            }

            this.setState(newState);
        });
    }

	render() {
	    if (this.state.showSpinner) {
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
                <Heading text="Delete Template" />
                <Text style={[styles.grey, {alignSelf: 'center'}]}>Long press to delete a template.</Text>
                <List>
                    {this.state.templates.map((template, index) => {
                        return (
                            <ListItem noIndent key={'t-' + index} onLongPress={() => this._delete(template)}>
                                <Body>
                                    <Text style={styles.grey}>{template.name}</Text>
                                </Body>
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