import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BackHandler, Platform, StyleSheet, ScrollView, View, TouchableHighlight, Image, Alert, Switch, Keyboard } from 'react-native';
import { Container, Content, Button, Text, Spinner, Card, CardItem, Body, Icon, Form, Label, Item, Input, Textarea, Toast, Left, Right } from 'native-base';
import Header from '../Header';
import Heading from '../Heading';
import LogoButton from '../LogoButton';
import ArchitectFooter from '../ArchitectFooter';
import { TAB_ADVANTAGES, TAB_SPECIAL_ABILITIES, TAB_COMPLICATIONS } from './ArchitectScreen';
import styles from '../../Styles';
import { template } from '../../lib/Template';
import { common } from '../../lib/Common';
import { editTemplateOption } from '../../reducers/architect';

class EditOptionScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        editTemplateAttribute: PropTypes.func.isRequired,
        deleteTemplateSkill: PropTypes.func.isRequired,
        template: PropTypes.object
    }

    constructor(props) {
        super(props);

        this.state = EditOptionScreen.initState(props.navigation.state.params.option, props.navigation.state.params.optionKey, props.template);

        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.navigate('Architect', {selectedTab: this._getArchitectSelectedTab()});

            return true;
        });
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }

    static initState(option, optionKey, gameTemplate) {
        return {
           optionKey: optionKey,
           option: option,
           optionIndex: template.getOptionIndex(optionKey, option.id, gameTemplate),
       };
    }

    static getDerivedStateFromProps(props, state) {
        if (props.navigation.state.params.option !== state.option) {
            return EditOptionScreen.initState(props.navigation.state.params.option, props.navigation.state.params.optionKey, props.template);
        }

        return state;
    }

    _keyboardDidHide () {
        if (!Number.isInteger(this.state.option.rank) || this.state.option.rank < 0) {
            let newState = {...this.state};
            newState.option.rank = 1;

            this.setState(newState);
        }
    }

    _validateInput(key, value) {
        let isValid = false;

        if (key === 'rank') {
            if (value === '') {
                isValid = true;
            }

            let intValue = parseInt(value, 10);

            if (value >= 0) {
                isValid = true;
            }
        } else {
            isValid = true;
        }

        return isValid;
    }

    _updateOptionField(key, value) {
        if (!this._validateInput(key, value)) {
            return;
        }

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
                        <Label style={{fontWeight: 'bold'}}>Rank</Label>
                        <Input
                            keyboardType='numeric'
                            style={styles.grey}
                            maxLength={3}
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