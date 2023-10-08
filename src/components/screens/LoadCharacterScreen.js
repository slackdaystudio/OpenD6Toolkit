import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {View} from 'react-native';
import {Container, Content, Text, Spinner, List, ListItem, Left, Right} from 'native-base';
import {Header} from '../Header';
import Heading from '../Heading';
import {Icon} from '../Icon';
import ConfirmationDialog from '../ConfirmationDialog';
import styles from '../../Styles';
import {file} from '../../lib/File';
import {loadCharacter} from '../../reducers/builder';
import {ButtonGroup} from '../ButtonGroup';

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
        this.updateFileList = this._updateFileList.bind(this);
    }

    componentDidMount() {
        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.updateFileList();
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

    _import() {
        file.importCharacter(
            () => null,
            () => null,
        )
            .then(() => {
                this.updateFileList();
            })
            .catch(error => console.error(error));
    }

    render() {
        if (this.state.showSpinner || this.state.files === null) {
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

        const buttonData = [
            {
                label: 'New',
                onPress: () => this.props.navigation.navigate('TemplateSelect'),
                disabled: false,
            },
            {
                label: 'Import',
                onPress: () => this._import(),
                disabled: false,
            },
        ];

        return (
            <Container style={styles.container}>
                <Header navigation={this.props.navigation} />
                <Content style={styles.content}>
                    <Heading text="Characters" />
                    <View style={{paddingBottom: 20}} />
                    <ButtonGroup buttonData={buttonData} />
                    <View style={{paddingBottom: 20}} />
                    {this.state.files.length === 0 ? (
                        <Text style={[styles.grey, {textAlign: 'center'}]}>You have no characters created.</Text>
                    ) : (
                        <List>
                            {this.state.files.map((f, index) => {
                                return (
                                    <ListItem
                                        noIndent
                                        key={'file-' + index}
                                        onPress={() => this._onCharacterSelect(f)}
                                        onLongPress={() => this._onCharacterDelete(f)}>
                                        <Left>
                                            <Text style={styles.grey}>{f.substring(0, f.length - 5)}</Text>
                                        </Left>
                                        <Right>
                                            <Icon style={styles.grey} name="circle-arrow-right" />
                                        </Right>
                                    </ListItem>
                                );
                            })}
                        </List>
                    )}
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
