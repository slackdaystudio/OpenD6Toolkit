import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, StyleSheet, Dimensions, Animated, Easing, Image, View, Platform } from 'react-native';
import { Text, CardItem, Card, Left, Right, Body, Input, Icon, Form, Item, Label, CheckBox, Picker } from 'native-base';
import { ScaledSheet, scale, verticalScale, moderateScale } from 'react-native-size-matters';
import CalculatorInput from './CalculatorInput';
import { DEATH_SPIRAL } from './builder/Health';
import styles from '../Styles';

const window = Dimensions.get('window');

const TEXT_LENGTH = 75;

const TEXT_HEIGHT = 20;

const OFFSET = TEXT_LENGTH / 4 - TEXT_HEIGHT / 5;

export default class Row extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        active: PropTypes.bool.isRequired,
        data: PropTypes.object.isRequired,
        combatants: PropTypes.object.isRequired,
        onRemove: PropTypes.func.isRequired,
        onUpdate: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);

        this._active = new Animated.Value(0);

        this._style = {
            ...Platform.select({
                ios: {
                    transform: [{
                        scale: this._active.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 1.1],
                        }),
                    }],
                    shadowRadius: this._active.interpolate({
                        inputRange: [0, 1],
                        outputRange: [2, 10],
                    }),
                },
                android: {
                    transform: [{
                        scale: this._active.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 1.07],
                        }),
                    }],
                    elevation: this._active.interpolate({
                        inputRange: [0, 1],
                        outputRange: [2, 6],
                    }),
                },
            })
        };

        this.updateBodyPoints = this._updateBodyPoints.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.active !== prevProps.active) {
            Animated.timing(this._active, {
                duration: 300,
                easing: Easing.bounce,
                toValue: Number(this.props.active),
            }).start();
        }
    }

    _updateBodyPoints(key, value) {
        if (value === '' || value === '-') {
            value = value;
        } else {
            value = parseInt(value, 10) || 1;

            if (value > 999) {
                value = 999;
            } else if (value < -999) {
                value = -999;
            } else if (key === 'currentBodyPoints' && value > this.props.data.maxBodyPoints) {
                value = this.props.data.maxBodyPoints;
            }
        }

        this.props.onUpdate(this.props.data.uuid, key, value);
    }

    _focusBodyPoints(key) {
        if (this.props.data[key] === 0) {
            this.props.onUpdate(this.props.data.uuid, key, '');
        }
    }

    _blurBodyPoints(key) {
        let value = this.props.data[key];

        if (value === null || value === undefined || value === '' || value === '-') {
            this.props.onUpdate(this.props.data.uuid, key, 0);
        }
    }

    _renderHealth() {
        if (this.props.data.useBodyPoints) {
            return (
                <View style={[styles.rowStart, {justifyContent: 'space-between'}]}>
                    <View style={{width: scale(110)}}>
                        <Item stackedLabel style={{width: scale(90), alignSelf: 'flex-start'}}>
                            <Label style={{fontSize: scale(10), fontWeight: 'bold'}}>Maximum:</Label>
                            <Input
                                style={[styles.textInput, {textAlign: 'center'}]}
                                keyboardType='numeric'
                                maxLength={3}
                                value={this.props.data.maxBodyPoints.toString()}
                                onChangeText={(value) => this._updateBodyPoints('maxBodyPoints', value)}
                                onFocus={(value) => this._focusBodyPoints('maxBodyPoints')}
                                onBlur={(value) => this._blurBodyPoints('maxBodyPoints')}
                            />
                        </Item>
                    </View>
                    <View style={{alignSelf: 'flex-end', paddingLeft: scale(60)}}>
                        <CalculatorInput
                            label='Current:'
                            labelFontSize={10}
                            itemKey='currentBodyPoints'
                            value={this.props.data.currentBodyPoints}
                            onAccept={this.updateBodyPoints}
                            width={110}
                            paddingLeft={0}
                            boldLabel={true}
                        />
                    </View>
                </View>
            );
        }

        return (
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                {DEATH_SPIRAL.map((step, index) => {
                    return (
                        <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                            <View style={{flex: 1, alignSelf: 'center', paddingRight: moderateScale(21, 0.035)}}>
                                <CheckBox
                                    color='#f57e20'
                                    checked={this.props.data[step.level]}
                                    onPress={() => this.props.onUpdate(this.props.data.uuid, step.level, !this.props.data[step.level])}
                                />
                            </View>
                            <View style={{flex: 1}}>
                                <Text style={{fontSize: scale(10)}}>{step.shortLabel}</Text>
                            </View>
                        </View>
                    );
                })}
            </View>
        );
    }

    _renderEngagingOptions() {
      let selectableCombatants = Object.keys(this.props.combatants).filter((key) => {
          if (this.props.combatants[key].uuid !== this.props.data.uuid) {
              return true;
          }
      });
      let options = selectableCombatants.map((key, index) => {
          return <Item label={this.props.combatants[key].label} key={this.props.combatants[key].uuid} value={this.props.combatants[key].uuid} />;
      });

      if (Platform.OS === 'android') {
        options.unshift(<Item label='Unengaged' value='Unengaged' />);
      }

      return options;
    }

    _renderEngaging() {
        return (
            <View style={styles.rowStart}>
                <Text style={[styles.boldGrey, {alignSelf: 'center'}]}>Engaging:</Text>
                <Picker
                    placeholder="Unengaged"
                    inlinelabel
                    label='Engaging'
                    style={styles.picker}
                    textStyle={styles.grey}
                    placeholderIconColor="#FFFFFF"
                    mode="dropdown"
                    selectedValue={this.props.data.engaging}
                    onValueChange={(value) => this.props.onUpdate(this.props.data.uuid, 'engaging', value)}
                >
                    {this._renderEngagingOptions()}
                </Picker>
            </View>
        );
    }

    render() {
        return (
            <Animated.View style={[localStyles.row, this._style]}>
                <Card>
                    <CardItem style={{borderBottomColor: '#F8F8F8', borderBottomWidth: 2}}>
                        <Body>
                            <Text style={[styles.boldGrey, {fontSize: scale(20)}]}>
                                ({this.props.data.roll}) {this.props.data.label}
                            </Text>
                        </Body>
                        <Right>
                            <View style={{flex: 1, flexDirection: 'row'}}>
                                <Icon
                                    type='FontAwesome'
                                    name='trash'
                                    style={[localStyles.button, {paddingRight: 10}]}
                                    onPress={() => this.props.onRemove(this.props.data.uuid)}
                                />
                                <Icon
                                    type='FontAwesome'
                                    name='edit'
                                    style={[localStyles.button, {paddingTop: 3}]}
                                    onPress={() => this.props.navigation.navigate('EditActor', {actor: this.props.data})}
                                />
                            </View>
                        </Right>
                    </CardItem>
                    <CardItem style={{paddingTop: 0}}>
                        <Body>
                            <Text style={[styles.boldGrey, {fontSize: scale(14), alignSelf: 'center', paddingBottom: 5}]}>Health</Text>
                            {this._renderHealth()}
                            {this._renderEngaging()}
                        </Body>
                    </CardItem>
                </Card>
            </Animated.View>
        );
    }
}

const localStyles = ScaledSheet.create({
  row: {
    ...Platform.select({
      ios: {
        width: window.width - 30 * 2,
        shadowColor: 'rgba(0,0,0,0.2)',
        shadowOpacity: 1,
        shadowOffset: {height: 2, width: 2},
        shadowRadius: 2,
      },

      android: {
        width: window.width - 15 * 2,
        elevation: 0,
        marginHorizontal: 15,
      },
    })
  },
  column: {
    width: 75
  },
  text: {
    fontSize: '20@vs',
    color: '#A04700',
  },
  button: {
    fontSize: '25@vs',
    color: '#f57e20'
  }
});
