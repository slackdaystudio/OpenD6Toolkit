import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet, View, Switch } from 'react-native';
import { Container, Content, Button, Text, ListItem, CheckBox, Body, Item, Form, Label, Input } from 'native-base';
import styles from '../../Styles';
import Heading from '../Heading';

export default class Health extends Component {
    static propTypes = {
        character: PropTypes.object.isRequired,
        updateHealthSystem: PropTypes.func.isRequired,
        updateWounds: PropTypes.func.isRequired,
        updateBodyPoints: PropTypes.func.isRequired
    }

    _updateBodyPoints(key, value) {
        let newState = {...this.state};
        let bodyPoints = '';

        if (value === '' || value === '-') {
            bodyPoints = value;
        } else {
            bodyPoints = parseInt(value, 10) || 1;

            if (bodyPoints > 999) {
                bodyPoints = 999;
            } else if (bodyPoints < -999) {
                bodyPoints = -999;
            }
        }

        this.props.updateBodyPoints(key, bodyPoints);
    }

    _renderWounds() {
        return (
            <View>
                <ListItem>
                    <CheckBox
                        color='#f57e20'
                        checked={this.props.character.health.wounds.stunned}
                        onPress={() => this.props.updateWounds('stunned')}
                    />
                    <Body>
                        <Text style={styles.grey}>Stunned</Text>
                    </Body>
                </ListItem>
                <ListItem>
                    <CheckBox
                        color='#f57e20'
                        checked={this.props.character.health.wounds.wounded}
                        onPress={() => this.props.updateWounds('wounded')}
                    />
                    <Body>
                        <Text style={styles.grey}>Wounded</Text>
                    </Body>
                </ListItem>
                <ListItem>
                    <CheckBox
                        color='#f57e20'
                        checked={this.props.character.health.wounds.severelyWounded}
                        onPress={() => this.props.updateWounds('severelyWounded')}
                    />
                    <Body>
                        <Text style={styles.grey}>Severely Wounded</Text>
                    </Body>
                </ListItem>
                <ListItem>
                    <CheckBox
                        color='#f57e20'
                        checked={this.props.character.health.wounds.incapacitated}
                        onPress={() => this.props.updateWounds('incapacitated')}
                    />
                    <Body>
                        <Text style={styles.grey}>Incapacitated</Text>
                    </Body>
                </ListItem>
                <ListItem>
                    <CheckBox
                        color='#f57e20'
                        checked={this.props.character.health.wounds.mortallyWounded}
                        onPress={() => this.props.updateWounds('mortallyWounded')}
                    />
                    <Body>
                        <Text style={styles.grey}>Mortally Wounded</Text>
                    </Body>
                </ListItem>
                <ListItem>
                    <CheckBox
                        color='#f57e20'
                        checked={this.props.character.health.wounds.dead}
                        onPress={() => this.props.updateWounds('dead')}
                    />
                    <Body>
                        <Text style={styles.grey}>Dead</Text>
                    </Body>
                </ListItem>
            </View>
        );
    }

    _renderBodyPoints() {
        return (
            <View style={styles.titleContainer}>
                <View style={{paddingLeft: 30}}>
                    <Item stackedLabel style={{width: 150}}>
                        <Label>Max</Label>
                        <Input
                            style={styles.grey}
                            keyboardType='numeric'
                            maxLength={4}
                            value={this.props.character.health.bodyPoints.max.toString()}
                            onChangeText={(value) => this._updateBodyPoints('max', value)}
                        />
                    </Item>
                </View>
                <View style={{paddingRight: 30}}>
                    <Item stackedLabel style={{width: 150}}>
                        <Label>Current</Label>
                        <Input
                            style={styles.grey}
                            keyboardType='numeric'
                            maxLength={4}
                            value={this.props.character.health.bodyPoints.current.toString()}
                            onChangeText={(value) => this._updateBodyPoints('current', value)}
                        />
                    </Item>
                </View>
            </View>
        );
    }

    _renderHealth() {
        if (this.props.character.health.useBodyPoints) {
            return this._renderBodyPoints();
        }

        return this._renderWounds();
    }

	render() {
		return (
            <View>
                <Heading text='Health' />
                <View style={styles.titleContainer}>
                    <Text style={[styles.grey, {paddingLeft: 30}]}>Use Body Points?</Text>
                    <View style={{paddingRight: 30}}>
                        <Switch
                            value={this.props.character.health.useBodyPoints}
                            onValueChange={() => this.props.updateHealthSystem()}
                            thumbColor='#f57e20'
                            trackColor={{true: '#fde5d2', false: '#4f4e4e'}}
                        />
                    </View>
                </View>
                {this._renderHealth()}
                <View style={{paddingBottom: 20}} />
            </View>
		);
	}
}