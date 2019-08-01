import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Platform, StyleSheet, ScrollView, View, TouchableHighlight, Image, Alert, Switch } from 'react-native';
import { Container, Content, Button, Text, Spinner, Card, CardItem, Body, Icon, Form, Label, Item, Input, Textarea, List, ListItem, Left, Right } from 'native-base';
import Header from '../Header';
import Heading from '../Heading';
import LogoButton from '../LogoButton';
import styles from '../../Styles';
import { template } from '../../lib/Template';

class EditAttributeScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        attributeName: PropTypes.string.isRequired,
        template: PropTypes.object
    }

    constructor(props) {
        super(props);

        this.state = {
            attribute: props.navigation.state.params.attribute,
            attributeIndex: template.getAttributeIndex(props.navigation.state.params.attribute.name, props.template)
        };
    }

    _updateAttributeField(key, value) {
        let newState = {...this.state};
        newState.attribute[key] = value;

        this.setState(newState);
    }

    _renderSkills() {
        if (this.state.attribute.skills.length > 0) {
            return (
                <View>
                    {this.state.attribute.skills.map((skill, index) => {
                        return (
                            <Card>
                                <CardItem>
                                    <Body>
                                        <Text style={[styles.boldGrey, {fontSize: 25, fontWeight: 'bold'}]}>{skill.name}</Text>
                                    </Body>
                                    <Right>
                                        <View style={{flex: 1, flexDirection: 'row'}}>
                                            <Icon
                                                type='FontAwesome'
                                                name='trash'
                                                style={[localStyles.button, {paddingRight: 10}]}
                                                onPress={() => {}}
                                            />
                                            <Icon
                                                type='FontAwesome'
                                                name='edit'
                                                style={[localStyles.button, {paddingTop: 3}]}
                                                onPress={() => {}}
                                            />
                                        </View>
                                    </Right>
                                </CardItem>
                                <CardItem>
                                    <Body>
                                        <Text style={styles.grey}>{skill.description}</Text>
                                    </Body>
                                </CardItem>
                            </Card>
                        )
                    })}
                </View>
            );
        }

        return null;
    }

	render() {
		return (
		  <Container style={styles.container}>
            <Header navigation={this.props.navigation} />
            <Content style={styles.content}>
                <Heading text='Attribute'onAddButtonPress={() => {}} />
                <Form>
                    <Item stackedLabel>
                        <Label style={{fontWeight: 'bold'}}>Name</Label>
                        <Input
                            style={styles.grey}
                            maxLength={64}
                            value={this.state.attribute.name}
                            onChangeText={(value) => this._updateAttributeField('name', value)}
                        />
                    </Item>
                    <Item stackedLabel>
                        <Label style={{fontWeight: 'bold'}}>Description</Label>
                        <Textarea
                            rowSpan={5}
                            bordered
                            maxLength={255}
                            style={{width: '100%'}}
                            value={this.state.attribute.description}
                            onChangeText={(value) => this._updateAttributeField('description', value)}
                        />
                    </Item>
                    <Item>
                        <Label style={{fontWeight: 'bold'}}>Is Extranormal?</Label>
                        <Switch
                            value={this.state.attribute.isExtranormal}
                            onValueChange={() => this._updateAttributeField('isExtranormal', !this.state.attribute.isExtranormal)}
                            thumbColor='#f57e20'
                            trackColor={{true: '#fde5d2', false: '#4f4e4e'}}
                        />
                    </Item>
                </Form>
                <View style={{paddingBottom: 20}} />
                <LogoButton label='Save' onPress={() => {}} />
                <View style={{paddingBottom: 20}} />
                <Heading text='Skills' onAddButtonPress={() => {}} />
                {this._renderSkills()}
                <View style={{paddingBottom: 20}} />
            </Content>
	      </Container>
		);
	}
}

const localStyles = StyleSheet.create({
	button: {
        fontSize: 30,
        color: '#f57e20'
	}
});

const mapStateToProps = state => {
    return {
        template: state.architect.template
    };
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(EditAttributeScreen);