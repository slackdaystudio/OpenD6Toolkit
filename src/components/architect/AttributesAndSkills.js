import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, TouchableHighlight } from 'react-native';
import { Container, Content, Text, CardItem, Card, Left, Right, Body, Button, Icon, Input } from 'native-base';
import { SwipeRow } from 'react-native-swipe-list-view';
import styles from '../../Styles';
import Heading from '../Heading';
import ConfirmationDialog from '../ConfirmationDialog';
import { character } from '../../lib/Character';

export default class AttributesAndSkills extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        template: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            attributes: props.template.attributes,
            attributeShow: this._initAttributeShow(props),
            confirmationDialog: {
                visible: false,
                title: 'Delete Attribute',
                info: 'This is permanent, are you certain you want to delete this attribute?\n\n' +
                    'All associated skills will also be deleted with this attribute.'
            }
        };

        this.onClose = this._closeConfirmationDialog.bind(this);
        this.onOk = this._deleteConfirmed.bind(this);
    }

    _initAttributeShow(props) {
        let attributeShow = {}

        props.template.attributes.map((attribute, index) => {
            attributeShow[attribute.name] = false;
        });

        return attributeShow;
    }

    _delete(attribute) {
        let newState = {...this.state};
        newState.confirmationDialog.visible = true;

        this.setState(newState);
    }

    _deleteConfirmed() {
//        file.deleteTemplate(this.state.selectedTemplate).then(() => {
//            this._updateFileList();
//        });

        this._closeConfirmationDialog();
    }

    _closeConfirmationDialog() {
        let newState = {...this.state};
        newState.confirmationDialog.visible = false;

        this.setState(newState);
    }

    _toggleAttributeShow(attribute) {
        let newState = {...this.state};
        newState.attributeShow[attribute] = !newState.attributeShow[attribute];

        this.setState(newState);
    }

    _renderSkills(attribute) {
        let skills = attribute.skills.map(skill => skill.name)

        return (
            <Text style={{fontSize: 12, fontStyle: 'italic'}}>
                {skills.join(', ')}
            </Text>
        );
    }

	render() {
		return (
            <View>
                <Heading text='Attributes' onAddButtonPress={() => {}} />
                {this.props.template.attributes.map((attribute, index) => {
                    return (
                        <Card key={'atr-' + index}>
                            <CardItem>
                                <Body>
                                    <Text style={{fontSize: 25, fontWeight: 'bold'}}>
                                        {attribute.name}
                                    </Text>
                                </Body>
                                <Right>
                                    <View style={{flex: 1, flexDirection: 'row'}}>
                                        <Icon
                                            type='FontAwesome'
                                            name='trash'
                                            style={[localStyles.button, {paddingRight: 10}]}
                                            onPress={() => this._delete(attribute)}
                                        />
                                        <Icon
                                            type='FontAwesome'
                                            name='edit'
                                            style={[localStyles.button, {paddingTop: 3}]}
                                            onPress={() => this.props.navigation.navigate('EditAttribute', {attribute: attribute})}
                                        />
                                    </View>
                                </Right>
                            </CardItem>
                            <CardItem>
                                <Body>
                                    <Text style={styles.grey}>
                                        {attribute.description}
                                    </Text>
                                </Body>
                            </CardItem>
                            <CardItem>
                                <Body>
                                    <Text style={styles.grey}>
                                        {this._renderSkills(attribute)}
                                    </Text>
                                </Body>
                            </CardItem>
                        </Card>
                    );
                })}
                <ConfirmationDialog
                    visible={this.state.confirmationDialog.visible}
                    title={this.state.confirmationDialog.title}
                    info={this.state.confirmationDialog.info}
                    onOk={this.onOk}
                    onClose={this.onClose}
                />
            </View>
		);
	}
}

const localStyles = StyleSheet.create({
	button: {
        fontSize: 30,
        color: '#f57e20'
	}
});