import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, StyleSheet, Dimensions, Animated, Easing, Image, View, Platform } from 'react-native';
import { Text, CardItem, Card, Left, Right, Body, Icon } from 'native-base';
import styles from '../Styles';

const window = Dimensions.get('window');

export default class Row extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        active: PropTypes.bool.isRequired,
        data: PropTypes.object.isRequired,
        onRemove: PropTypes.func.isRequired
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
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.active !== nextProps.active) {
            Animated.timing(this._active, {
                duration: 300,
                easing: Easing.bounce,
                toValue: Number(nextProps.active),
            }).start();
        }
    }

    render() {
        return (
            <Animated.View style={[localStyles.row, this._style]}>
                <Card>
                    <CardItem>
                        <Body>
                            <Text style={[styles.boldGrey, {fontSize: 25}]}>
                                ({this.props.data.roll}) {this.props.data.label}
                            </Text>
                        </Body>
                        <Right>
                            <View style={{flex: 1, flexDirection: 'row'}}>
                                  <Icon
                                       type='FontAwesome'
                                       name='chevron-circle-down'
                                       style={[localStyles.button, {paddingRight: 10}]}
                                       onPress={() => {}}
                                   />
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
                    <CardItem>
                        <Body>
                            <Text style={styles.grey}>
                                {this.props.data.uuid}
                            </Text>
                        </Body>
                    </CardItem>
                </Card>
            </Animated.View>
        );
    }
}

const localStyles = StyleSheet.create({
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
  text: {
    fontSize: 24,
    color: '#A04700',
  },
  button: {
    fontSize: 30,
    color: '#f57e20'
  }
});
