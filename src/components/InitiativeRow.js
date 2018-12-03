import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Dimensions, Animated, Easing, Image, View, Platform } from 'react-native';
import { Text } from 'native-base';

const window = Dimensions.get('window');

export default class Row extends Component {
    static propTypes = {
        active: PropTypes.bool.isRequired,
        data: PropTypes.object.isRequired
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
            <Animated.View style={[
                styles.row,
                this._style,
            ]}>
                <Text style={styles.text}>{this.props.data.label}</Text>
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFB275',
    padding: 10,
    height: 60,
    flex: 1,
    marginTop: 5,
    marginBottom: 1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#A04700',
    ...Platform.select({
      ios: {
        width: window.width - 15 * 2,
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
  }
});