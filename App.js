import React, { Component }  from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
import { AsyncStorage, StyleSheet, Text, View, Button, StatusBar } from 'react-native';
import { DrawerNavigator } from 'react-navigation';
import { Root } from 'native-base';
import SplashScreen from 'react-native-splash-screen'
import HomeScreen from './src/components/screens/HomeScreen';
import DieRollerScreen from './src/components/screens/DieRollerScreen';
import TemplateSelectScreen from './src/components/screens/TemplateSelectScreen';
import BuilderScreen from './src/components/screens/BuilderScreen';
import SpecializationScreen from './src/components/screens/SpecializationScreen';
import LoadCharacterScreen from './src/components/screens/LoadCharacterScreen';
import CharacterOptionsScreen from './src/components/screens/CharacterOptionsScreen';
import OglScreen from './src/components/screens/OglScreen';
import Sidebar from './src/components/Sidebar';
import reducer from './reducer'

const RootStack = DrawerNavigator(
    {
		Home: {
			screen: HomeScreen,
		},
        DieRoller: {
            screen: DieRollerScreen,
        },
        TemplateSelect: {
            screen: TemplateSelectScreen,
        },
        Builder: {
            screen: BuilderScreen,
        },
        Specialization: {
            screen: SpecializationScreen,
        },
        LoadCharacter: {
            screen: LoadCharacterScreen,
        },
        Options: {
            screen: CharacterOptionsScreen,
        },
        Ogl: {
            screen: OglScreen,
        }
	},
	{
		initialRouteName: 'Home',
		drawerPosition: 'right',
		contentComponent: props => <Sidebar {...props} />
	}
);

const store = createStore(reducer, applyMiddleware());

export default class App extends Component<Props> {
	render() {
		return (
		    <Provider store={store}>
                <Root>
                    <RootStack />
                </Root>
			</Provider>
		);
	}
}