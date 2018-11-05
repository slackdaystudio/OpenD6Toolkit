import React, { Component }  from 'react';
import { AsyncStorage, StyleSheet, Text, View, Button, StatusBar } from 'react-native';
import { DrawerNavigator } from 'react-navigation';
import { Root } from 'native-base';
import SplashScreen from 'react-native-splash-screen'
import HomeScreen from './src/components/screens/HomeScreen';
import DieRollerScreen from './src/components/screens/DieRollerScreen';
import Sidebar from './src/components/Sidebar';

const RootStack = DrawerNavigator({
		Home: {
			screen: HomeScreen,
		},
        DieRoller: {
            screen: DieRollerScreen,
        }
	}, {
		initialRouteName: 'Home',
		drawerPosition: 'right',
		contentComponent: props => <Sidebar {...props} />
	}
);

export default class App extends Component<Props> {
	render() {
		return (
			<Root>
				<RootStack />
			</Root>
		);
	}
}