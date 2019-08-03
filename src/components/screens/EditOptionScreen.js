import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Platform, StyleSheet, ScrollView, View, TouchableHighlight, Image, Alert, Switch } from 'react-native';
import { Container, Content, Button, Text, Spinner, Card, CardItem, Body, Icon, Form, Label, Item, Input, Textarea, Toast, Left, Right } from 'native-base';
import Header from '../Header';
import Heading from '../Heading';
import LogoButton from '../LogoButton';
import ArchitectFooter from '../ArchitectFooter';
import { TAB_ADVANTAGES, TAB_SPECIAL_ABILITIES, TAB_COMPLICATIONS } from './ArchitectScreen';
import styles from '../../Styles';
import { template } from '../../lib/Template';
import { common } from '../../lib/Common';
import { editTemplateOption } from '../../../reducer';

class EditOptionScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        editTemplateAttribute: PropTypes.func.isRequired,
        deleteTemplateSkill: PropTypes.func.isRequired,
        template: PropTypes.object
    }

    constructor(props) {
        super(props);

        this.state = {
            optionKey: props.navigation.state.params.optionKey,
            option: props.navigation.state.params.option,
            optionIndex: template.getOptionIndex(props.navigation.state.params.optionKey, props.navigation.state.params.option.id, props.template),
        };
    }

    _updateOptionField(key, value) {
        let newState = {...this.state};
        newState.option[key] = value;

        this.setState(newState, () => {
            this.props.editTemplateOption(this.state.optionIndex, common.toCamelCase(this.state.optionKey), this.state.option);
        });
    }

    _getArchitectSelectedTab() {
        switch (this.state.optionKey) {
            case 'Advantages':
                return TAB_ADVANTAGES;
            case "Special Abilities":
                return TAB_SPECIAL_ABILITIES;
            case "Complications":
                return TAB_COMPLICATIONS;
            default:
                // do nothing, the Overview tab will be selected
        }
    }

	render() {
		return (
		  <Container style={styles.container}>
            <Header navigation={this.props.navigation} />
            <Content style={styles.content}>
                <Heading text={this.state.optionKey} onBackButtonPress={() => this.props.navigation.navigate('Architect', {selectedTab: this._getArchitectSelectedTab()})} />
                <Form>
                    <Item stackedLabel>
                        <Label style={{fontWeight: 'bold'}}>ID</Label>
                        <Input
                            style={styles.grey}
                            maxLength={10}
                            value={this.state.option.id.toString()}
                            onChangeText={(value) => this._updateOptionField('id', value)}
                        />
                    </Item>
                    <Item stackedLabel>
                        <Label style={{fontWeight: 'bold'}}>Rank</Label>
                        <Input
                            style={styles.grey}
                            maxLength={10}
                            value={this.state.option.rank.toString()}
                            onChangeText={(value) => this._updateOptionField('rank', value)}
                        />
                    </Item>
                    <Item stackedLabel>
                        <Label style={{fontWeight: 'bold'}}>Name</Label>
                        <Input
                            style={styles.grey}
                            maxLength={64}
                            value={this.state.option.name}
                            onChangeText={(value) => this._updateOptionField('name', value)}
                        />
                    </Item>
                    <Item stackedLabel>
                        <Label style={{fontWeight: 'bold'}}>Description</Label>
                        <Textarea
                            rowSpan={10}
                            bordered
                            maxLength={5000}
                            style={{width: '100%'}}
                            value={this.state.option.description}
                            onChangeText={(value) => this._updateOptionField('description', value)}
                        />
                    </Item>
                    <Item>
                        <Label style={{fontWeight: 'bold'}}>Allow Multiple Ranks To Be Selected?</Label>
                        <Switch
                            value={this.state.option.multipleRanks}
                            onValueChange={() => this._updateOptionField('multipleRanks', !this.state.option.multipleRanks)}
                            thumbColor='#f57e20'
                            trackColor={{true: '#fde5d2', false: '#4f4e4e'}}
                        />
                    </Item>
                </Form>
                <View style={{paddingBottom: 20}} />
            </Content>
            <ArchitectFooter navigation={this.props.navigation} template={this.props.template} />
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

const mapDispatchToProps = {
    editTemplateOption
}

export default connect(mapStateToProps, mapDispatchToProps)(EditOptionScreen);