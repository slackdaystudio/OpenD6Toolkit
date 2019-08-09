import React, { Component }  from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
import { Alert, StyleSheet, Text, View, Button, StatusBar } from 'react-native';
import { Toast } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { Root } from 'native-base';
import SplashScreen from 'react-native-splash-screen'
import AppNavigator from './AppNavigator';
import thunk from 'redux-thunk';
import { statistics } from './src/lib/Statistics';
import { settings as appSettings } from './src/lib/Settings';
import { common } from './src/lib/Common';
import reducer from './src/reducers/index';

const store = createStore(reducer, applyMiddleware(thunk));

export default class App extends Component<Props> {
    componentDidMount() {
        try {
            AsyncStorage.getItem('statistics').then((stats) => {
                if (stats === null) {
                    statistics.init().then(() => console.log('Stats initialized'));
                }
            });
        } catch (error) {
            common.toast(error.message);
        } finally {
            SplashScreen.hide();
        }
    }

    render() {
        return (
            <Provider store={store}>
                <Root>
                    <AppNavigator />
                </Root>
            </Provider>
        );
    }
}
