import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {View} from 'react-native';
import {Container, Content, Text, Spinner, List, ListItem} from 'native-base';
import {Header} from '../Header';
import Heading from '../Heading';
import ConfirmationDialog from '../ConfirmationDialog';
import styles from '../../Styles';
import {file} from '../../lib/File';
import {loadCharacter} from '../../reducers/builder';

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

class LoadCharacterScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        loadCharacter: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            files: null,
            showSpinner: false,
            confirmationDialog: {
                visible: false,
                title: 'Delete Character',
                info: 'This is permanent, are you certain you want to delete this character?',
                fileName: null,
            },
        };

        this.onClose = this._closeConfirmationDialog.bind(this);
        this.onOk = this._deleteConfirmed.bind(this);
    }

    componentDidMount() {
        this.focusListener = this.props.navigation.addListener('focus', () => {
            this._updateFileList();
        });
    }

    componentWillUnmount() {
        this.focusListener.remove();
    }

    _deleteConfirmed() {
        file.deleteCharacter(this.state.confirmationDialog.fileName).then(() => {
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
        file.loadCharacter(fileName, () => {}, this.props.loadCharacter).then(() => {
            this.props.navigation.navigate('Builder');
        });
    }

    _onCharacterDelete(fileName) {
        let newState = {...this.state};
        newState.confirmationDialog.visible = true;
        newState.confirmationDialog.fileName = fileName;

        this.setState(newState);
    }

    _updateFileList() {
        this.setState({showSpinner: true}, async () => {
            const characters = await file.getCharacters();
            const newState = {...this.state};

            newState.files = characters;
            newState.showSpinner = false;

            this.setState(newState);
        });
    }

    render() {
        if (this.state.showSpinner || this.state.files === null || this.state.files.length <= 0) {
            return (
                <Container style={styles.container}>
                    <Header navigation={this.props.navigation} />
                    <Content style={styles.content}>
                        <Heading text="Characters" />
                        <Spinner />
                    </Content>
                </Container>
            );
        }

        return (
            <Container style={styles.container}>
                <Header navigation={this.props.navigation} />
                <Content style={styles.content}>
                    <Heading text="Characters" onBackButtonPress={() => this.props.navigation.navigate('Builder')} />
                    <List>
                        {this.state.files.map((file, index) => {
                            return (
                                <ListItem
                                    key={'file-' + index}
                                    noIndent
                                    onPress={() => this._onCharacterSelect(file)}
                                    onLongPress={() => this._onCharacterDelete(file)}>
                                    <View style={{paddingTop: 10, paddingBottom: 10}}>
                                        <Text style={styles.boldGrey}>{file.substring(0, file.length - 5)}</Text>
                                    </View>
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
    loadCharacter,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoadCharacterScreen);
