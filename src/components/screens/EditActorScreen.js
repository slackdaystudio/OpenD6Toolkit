import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BackHandler, Alert, StyleSheet, View, Switch } from 'react-native';
import { Container, Content, Button, Text, Form, Item, Label, Input } from 'native-base';
import Header from '../Header';
import Heading from '../Heading';
import LogoButton from '../LogoButton';
import styles from '../../Styles';
import { editActor } from '../../reducers/orchestrator'

class EditActorScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        editActor: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);

        this.state = {
            uuid: null,
            label: null,
            roll: 0,
            useBodyPoints: false,
            maxBodyPoints: 0,
            currentBodyPoints: 0
        };
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.navigate('Orchestrator');

            return true;
        });
    }

 	componentWillUnmount() {
   		this.backHandler.remove();
   	}

    static getDerivedStateFromProps(props, state) {
        if (props.navigation.state.params.actor !== null && props.navigation.state.params.actor.uuid !== state.uuid) {
            return props.navigation.state.params.actor;
        }

        return state;
    }

    _updateActor(key, value) {
        let newState = {...this.state};
        newState[key] = value;

        this.setState(newState);
    }

    _save() {
        this.props.editActor(this.state);

        this.props.navigation.navigate('Orchestrator');
    }

    _renderBodyPoints() {
        if (this.state.useBodyPoints) {
            return (
                <View>
                    <Item stackedLabel>
                        <Label style={{fontWeight: 'bold'}}>Maximum Body Points</Label>
                        <Input
                            style={styles.grey}
                            maxLength={64}
                            value={this.state.maxBodyPoints}
                            onChangeText={(value) => this._updateActor('maxBodyPoints', value)}
                        />
                    </Item>
                    <Item stackedLabel>
                        <Label style={{fontWeight: 'bold'}}>Current Body Points</Label>
                        <Input
                            style={styles.grey}
                            maxLength={64}
                            value={this.state.currentBodyPoints}
                            onChangeText={(value) => this._updateActor('currentBodyPoints', value)}
                        />
                    </Item>
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
                <Heading text='Actor' onBackButtonPress={() => this.props.navigation.navigate('Orchestrator')} />
                <Form>
                    <Item stackedLabel>
                        <Label style={{fontWeight: 'bold'}}>Name</Label>
                        <Input
                            style={styles.grey}
                            maxLength={64}
                            value={this.state.label}
                            onChangeText={(value) => this._updateActor('label', value)}
                        />
                    </Item>
                    <Item stackedLabel>
                        <Label style={{fontWeight: 'bold'}}>Roll</Label>
                        <Input
                            style={styles.grey}
                            maxLength={64}
                            value={this.state.roll.toString()}
                            onChangeText={(value) => this._updateActor('roll', value)}
                        />
                    </Item>
                    <Item>
                        <Label style={{fontWeight: 'bold'}}>Use Body Points?</Label>
                        <Switch
                            value={this.state.useBodyPoints}
                            onValueChange={() => this._updateActor('useBodyPoints', !this.state.useBodyPoints)}
                            thumbColor='#f57e20'
                            trackColor={{true: '#fde5d2', false: '#4f4e4e'}}
                        />
                    </Item>
                    {this._renderBodyPoints()}
                </Form>
                <View style={{paddingBottom: 20}} />
                <LogoButton label='Save' onPress={() => this._save()} />
                <View style={{paddingBottom: 20}} />
            </Content>
	      </Container>
		);
	}
}

const mapStateToProps = state => {
    return {};
}

const mapDispatchToProps = {
    editActor
}

export default connect(mapStateToProps, mapDispatchToProps)(EditActorScreen);