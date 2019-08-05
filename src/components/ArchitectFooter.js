import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { Button, Text, Icon, Footer, FooterTab } from 'native-base';
import styles from '../Styles';
import { file } from '../lib/File';

export default class ArchitectFooter extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        template: PropTypes.object.isRequired
    }

	render() {
		return (
            <Footer>
                <FooterTab style={{justifyContent: 'center', backgroundColor: '#f57e20'}}>
                    <Button vertical onPress={() => this.props.navigation.navigate('NewTemplate', {from: 'Architect'})}>
                        <Icon type='FontAwesome' name='file' style={{color: '#FFF'}} />
                        <Text uppercase={false} style={{color: '#FFF'}}>New</Text>
                    </Button>
                    <Button vertical onPress={() => file.saveTemplate(this.props.template)}>
                        <Icon type='FontAwesome' name='save' style={{color: '#FFF'}} />
                        <Text uppercase={false} style={{color: '#FFF'}}>Save</Text>
                    </Button>
                    <Button vertical onPress={() => this.props.navigation.navigate('OpenTemplate')}>
                        <Icon type='FontAwesome' name='folder-open' style={{color: '#FFF'}}/>
                        <Text uppercase={false} style={{color: '#FFF'}}>Open</Text>
                    </Button>
                    <Button vertical onPress={() => file.importTemplate(() => {}, () => {})}>
                        <Icon type='FontAwesome' name='download' style={{color: '#FFF'}}/>
                        <Text uppercase={false} style={{color: '#FFF'}}>Import</Text>
                    </Button>
                    <Button vertical onPress={() => this.props.navigation.navigate('TemplateDelete')}>
                        <Icon type='FontAwesome' name='trash' style={{color: '#FFF'}}/>
                        <Text uppercase={false} style={{color: '#FFF'}}>Delete</Text>
                    </Button>
                </FooterTab>
            </Footer>
		);
	}
}