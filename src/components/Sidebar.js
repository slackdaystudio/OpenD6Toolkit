import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Image, View} from 'react-native';
import {Container, Content, Text, List, ListItem} from 'native-base';
import {ScaledSheet} from 'react-native-size-matters';
import {ifIphoneX} from 'react-native-iphone-x-helper';

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

class Sidebar extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        character: PropTypes.object,
        template: PropTypes.object,
    };

    _onBuilderPress() {
        if (this.props.character == null || this.props.character.template == null) {
            this.props.navigation.navigate('TemplateSelect', {from: 'Home'});
        } else {
            this.props.navigation.navigate('Builder', {from: 'Home'});
        }
    }

    _onArchitectPress() {
        if (this.props.template == null) {
            this.props.navigation.navigate('NewTemplate', {from: 'Home'});
        } else {
            this.props.navigation.navigate('Architect', {from: 'Home'});
        }
    }

    render() {
        return (
            <Container style={localStyles.container}>
                <Content>
                    <List>
                        <ListItem onPress={() => this.props.navigation.navigate('Home')}>
                            <View style={localStyles.logoContainer}>
                                <Image style={localStyles.logo} source={require('../../public/d6_logo_White_512x512.png')} />
                            </View>
                        </ListItem>
                        <ListItem onPress={() => this.props.navigation.navigate('DieRoller', {from: 'Home'})}>
                            <Text style={localStyles.itemText}>Roller</Text>
                        </ListItem>
                        <ListItem onPress={() => this._onBuilderPress()}>
                            <Text style={localStyles.itemText}>Builder</Text>
                        </ListItem>
                        <ListItem onPress={() => this._onArchitectPress()}>
                            <Text style={localStyles.itemText}>Architect</Text>
                        </ListItem>
                        <ListItem onPress={() => this.props.navigation.navigate('BackupAndRestore')}>
                            <Text style={localStyles.itemText}>Backup &amp; Restore</Text>
                        </ListItem>
                        <ListItem onPress={() => this.props.navigation.navigate('Settings')}>
                            <Text style={localStyles.itemText}>Settings</Text>
                        </ListItem>
                        <ListItem onPress={() => this.props.navigation.navigate('Statistics')}>
                            <Text style={localStyles.itemText}>Statistics</Text>
                        </ListItem>
                        <ListItem onPress={() => this.props.navigation.navigate('Ogl')}>
                            <Text style={localStyles.itemText}>Open Gaming License</Text>
                        </ListItem>
                    </List>
                </Content>
            </Container>
        );
    }
}

const localStyles = ScaledSheet.create({
    container: {
        backgroundColor: '#f57e20',
        ...ifIphoneX(
            {
                paddingTop: 50,
            },
            {
                paddingTop: '5@vs',
            },
        ),
    },
    logoContainer: {
        flex: 1,
        alignSelf: 'center',
    },
    logo: {
        height: '50@vs',
        width: '50@vs',
    },
    itemText: {
        fontSize: '13@s',
        fontWeight: 'bold',
        color: '#ffffff',
    },
});

const mapStateToProps = state => {
    return {
        character: state.builder.character,
        template: state.architect.template,
    };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
