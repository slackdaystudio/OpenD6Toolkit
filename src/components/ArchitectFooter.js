import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, Text, Icon, Footer, FooterTab} from 'native-base';
import {file} from '../lib/File';

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

export default class ArchitectFooter extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        template: PropTypes.object.isRequired,
    };

    render() {
        return (
            <Footer>
                <FooterTab style={{justifyContent: 'center', backgroundColor: '#f57e20'}}>
                    <Button vertical onPress={() => this.props.navigation.navigate('NewTemplate', {from: 'Architect'})}>
                        <Icon type="FontAwesome" name="file" style={{color: '#FFF'}} />
                        <Text uppercase={false} style={{fontSize: 10, color: '#FFF'}}>
                            New
                        </Text>
                    </Button>
                    <Button vertical onPress={() => file.saveTemplate(this.props.template)}>
                        <Icon type="FontAwesome" name="save" style={{color: '#FFF'}} />
                        <Text uppercase={false} style={{fontSize: 10, color: '#FFF'}}>
                            Save
                        </Text>
                    </Button>
                    <Button vertical onPress={() => this.props.navigation.navigate('OpenTemplate')}>
                        <Icon type="FontAwesome" name="folder-open" style={{color: '#FFF'}} />
                        <Text uppercase={false} style={{fontSize: 10, color: '#FFF'}}>
                            Open
                        </Text>
                    </Button>
                </FooterTab>
            </Footer>
        );
    }
}
