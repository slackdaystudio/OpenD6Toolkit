import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Platform, StyleSheet, ScrollView, View, TouchableHighlight, Alert } from 'react-native';
import { Container, Content, Button, Text, Spinner, Card, CardItem, Body, Icon, List, ListItem } from 'native-base';
import Header from '../Header';
import Heading from '../Heading';
import ConfirmationDialog from '../ConfirmationDialog';
import styles from '../../Styles';
import { file } from '../../lib/File';
import { loadCharacter } from '../../../reducer';

class LoadCharacterScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        loadCharacter: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            files: [],
            confirmationDialog: {
                visible: false,
                title: 'Delete Character',
                info: 'This is permanent, are you certain you want to delete this character?',
                fileName: null
            }
        }

        this.onClose = this._closeConfirmationDialog.bind(this);
        this.onOk = this._deleteConfirmed.bind(this);
    }

    componentDidMount() {
        this._updateFileList()
    }

    _deleteConfirmed() {
        file.delete(this.state.confirmationDialog.fileName).then(() => {
            this._updateFileList();
        });

        this._closeConfirmationDialog();
    }

    _closeConfirmationDialog() {
        let newState = {...this.state};
        newState.confirmationDialog.visible = false;
        newState.confirmationDialog.fileName = null;

        this.setState(newState);
    }

     _onCharacterSelect(fileName) {
        file.load(fileName, () => {}, this.props.loadCharacter).then(() => {
            this.props.navigation.navigate('Builder');
        });
    }

    _onCharacterDelete(fileName) {
        let newState = {...this.state};
        newState.confirmationDialog.visible = true;
        newState.confirmationDialog.fileName = fileName;

        this.setState(newState);
    }

    async _updateFileList() {
        let files = await file.getCharacters();

        this.setState({files: files});
    }

	render() {
		return (
		  <Container style={styles.container}>
            <Header navigation={this.props.navigation} />
            <Content style={styles.content}>
                <Heading text='Characters' />
                <List>
                    {this.state.files.map((file, index) => {
                        return (
                            <ListItem key={'file-' + index} noIndent>
                                <TouchableHighlight
                                    underlayColor='#ffffff'
                                    onPress={() => this._onCharacterSelect(file)}
                                    onLongPress={() => this._onCharacterDelete(file)}
                                >
                                    <View style={{paddingTop: 10, paddingBottom: 10}}>
                                        <Text style={styles.boldGrey}>
                                            {file.substring(0, file.length - 5)}
                                        </Text>
                                    </View>
                                </TouchableHighlight>
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
}

const mapDispatchToProps = {
    loadCharacter
}

export default connect(mapStateToProps, mapDispatchToProps)(LoadCharacterScreen);