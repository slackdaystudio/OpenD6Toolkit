import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BackHandler,Platform, StyleSheet, ScrollView, View, TouchableHighlight, Image, Alert, Switch } from 'react-native';
import { Container, Content, Button, Text, Spinner, Card, CardItem, Body, Icon, Form, Label, Item, Input, Textarea, Toast, Left, Right } from 'native-base';
import { ScaledSheet, scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Header from '../Header';
import Heading from '../Heading';
import LogoButton from '../LogoButton';
import ArchitectFooter from '../ArchitectFooter';
import ConfirmationDialog from '../ConfirmationDialog';
import styles from '../../Styles';
import { template } from '../../lib/Template';
import { editTemplateSkill } from '../../reducers/architect';

class EditSkillScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        editTemplateSkill: PropTypes.func.isRequired,
        template: PropTypes.object
    }

    constructor(props) {
        super(props);

        this.state = EditSkillScreen.initState(props.route.params.attribute, props.route.params.skill);
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.navigate('EditAttribute', {attribute: this.state.attribute});

            return true;
        });
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }

    static initState(attribute, skill) {
        return {
           attribute: attribute,
           skill: skill,
           skillIndex: template.getSkillIndex(attribute, skill)
       };
    }

    static getDerivedStateFromProps(props, state) {
        if (props.route.params.skill !== state.skill) {
            return EditSkillScreen.initState(props.route.params.attribute, props.route.params.skill);
        }

        return state;
    }

    _updateSkillField(key, value) {
        let newState = {...this.state};
        newState.skill[key] = value;

        this.setState(newState, () => {
            this.props.editTemplateSkill(this.state.attribute, this.state.skill, this.state.skillIndex);
        });
    }

	render() {
		return (
		  <Container style={styles.container}>
            <Header navigation={this.props.navigation} />
            <Content style={styles.content}>
                <Heading text='Skill' onBackButtonPress={() => this.props.navigation.navigate('EditAttribute', {attribute: this.state.attribute})} />
                <Form>
                    <Item stackedLabel>
                        <Label style={{fontSize: scale(10), fontWeight: 'bold'}}>Name</Label>
                        <Input
                            style={styles.textInput}
                            maxLength={64}
                            value={this.state.skill.name}
                            onChangeText={(value) => this._updateSkillField('name', value)}
                        />
                    </Item>
                    <Item stackedLabel>
                        <Label style={{fontSize: scale(10), fontWeight: 'bold'}}>Description</Label>
                        <Textarea
                            rowSpan={5}
                            bordered
                            maxLength={255}
                            style={{width: '100%', fontSize: verticalScale(18)}}
                            value={this.state.skill.description}
                            onChangeText={(value) => this._updateSkillField('description', value)}
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

const mapStateToProps = state => {
    return {
        template: state.architect.template
    };
};

const mapDispatchToProps = {
    editTemplateSkill
};

export default connect(mapStateToProps, mapDispatchToProps)(EditSkillScreen);
