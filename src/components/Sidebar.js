import React, { Component } from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StyleSheet, Image, StatusBar, View } from "react-native";
import { Container, Content, Text, List, ListItem } from "native-base";
import { ifIphoneX } from 'react-native-iphone-x-helper';
import styles from '../Styles';
import { file } from '../lib/File';

class Sidebar extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        character: PropTypes.object
    }

    _onBuilderPress() {
        if (this.props.character == null || this.props.character.template == null) {
            this.props.navigation.navigate('TemplateSelect');
        } else {
            this.props.navigation.navigate('Builder');
        }
    }

    _onTemplateUploadPress() {
        file.loadGameTemplate(() => {}, () => {});
    }

    render() {
        return (
            <Container style={localStyles.container}>
                <Content>
                    <List>
        	            <ListItem onPress={() => this.props.navigation.navigate('Home')}>
                            <View>
                                <Image source={require('../../public/d6_logo_White_60x60.png')} />
                            </View>
                        </ListItem>
                        <ListItem onPress={() => this.props.navigation.navigate('DieRoller')}>
                            <Text style={{fontWeight: 'bold',color: '#ffffff'}}>Roller</Text>
                        </ListItem>
                        <ListItem itemDivider style={{backgroundColor: '#f57e20'}} />
                        <ListItem onPress={() => this._onBuilderPress()}>
                            <Text style={{fontWeight: 'bold',color: '#ffffff'}}>Builder</Text>
                        </ListItem>
                        <ListItem itemDivider style={{backgroundColor: '#f57e20'}} />
                        <ListItem onPress={() => this._onTemplateUploadPress()}>
                            <Text style={{fontWeight: 'bold',color: '#ffffff'}}>Upload Template</Text>
                        </ListItem>
                        <ListItem onPress={() => this.props.navigation.navigate('TemplateDelete')}>
                            <Text style={{fontWeight: 'bold',color: '#ffffff'}}>Delete Template</Text>
                        </ListItem>
                        <ListItem itemDivider style={{backgroundColor: '#f57e20'}} />
                        <ListItem onPress={() => this.props.navigation.navigate('BackupAndRestore')}>
                            <Text style={{fontWeight: 'bold',color: '#ffffff'}}>Backup &amp; Restore</Text>
                        </ListItem>
                        <ListItem itemDivider style={{backgroundColor: '#f57e20'}} />
                        <ListItem onPress={() => this.props.navigation.navigate('Statistics')}>
                            <Text style={{fontWeight: 'bold',color: '#ffffff'}}>Statistics</Text>
                        </ListItem>
                        <ListItem itemDivider style={{backgroundColor: '#f57e20'}} />
                        <ListItem onPress={() => this.props.navigation.navigate('Ogl')}>
                            <Text style={{fontWeight: 'bold',color: '#ffffff'}}>Open Gaming License</Text>
                        </ListItem>
                    </List>
                </Content>
            </Container>
        );
    }
}

const localStyles = StyleSheet.create({
	container: {
		backgroundColor: '#f57e20',
        	...ifIphoneX({
            		paddingTop: 50
        	}, {
            		paddingTop: 20
        	})
	}
});

const mapStateToProps = state => {
    return {
        character: state.builder.character
    };
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
