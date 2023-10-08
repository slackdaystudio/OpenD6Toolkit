import React, {Component} from 'react';
import {configureStore} from '@reduxjs/toolkit';
import {Provider} from 'react-redux';
import {SafeAreaView} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator, DrawerContentScrollView, DrawerItemList} from '@react-navigation/drawer';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {scale, ScaledSheet, verticalScale} from 'react-native-size-matters';
import prand from 'pure-rand';
import {Root} from 'native-base';
import SplashScreen from 'react-native-splash-screen';
import {Icon} from './src/components/Icon';
import HomeScreen from './src/components/screens/HomeScreen';
import DieRollerScreen from './src/components/screens/DieRollerScreen';
import TemplateSelectScreen from './src/components/screens/TemplateSelectScreen';
import NewTemplateScreen from './src/components/screens/NewTemplateScreen';
import OpenTemplateScreen from './src/components/screens/OpenTemplateScreen';
import ArchitectScreen from './src/components/screens/ArchitectScreen';
import EditAttributeScreen from './src/components/screens/EditAttributeScreen';
import EditSkillScreen from './src/components/screens/EditSkillScreen';
import EditOptionScreen from './src/components/screens/EditOptionScreen';
import BuilderScreen from './src/components/screens/BuilderScreen';
import SpecializationScreen from './src/components/screens/SpecializationScreen';
import LoadCharacterScreen from './src/components/screens/LoadCharacterScreen';
import CharacterOptionsScreen from './src/components/screens/CharacterOptionsScreen';
import MassRollerScreen from './src/components/screens/MassRollerScreen';
import OrchestratorScreen from './src/components/screens/OrchestratorScreen';
import EditActorScreen from './src/components/screens/EditActorScreen';
import BackupAndRestoreScreen from './src/components/screens/BackupAndRestoreScreen';
import SettingsScreen from './src/components/screens/SettingsScreen';
import {StatisticsScreen} from './src/components/screens/StatisticsScreen';
import {common} from './src/lib/Common';
import {statistics} from './src/lib/Statistics';
import {settings as appSettings} from './src/lib/Settings';
import architect from './src/reducers/architect';
import builder from './src/reducers/builder';
import orchestrator from './src/reducers/orchestrator';
import dieRoller from './src/reducers/dieRoller';
import massRoller from './src/reducers/massRoller';
import settings from './src/reducers/settings';

// Copyright (C) Slack Day Studio - All Rights Reserved
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// eslint-disable-next-line no-bitwise
let rng = prand.xoroshiro128plus(Date.now() ^ (Math.random() * 0x100000000));

export const getRandomNumber = (min, max, rolls = 1, increaseEntropyOveride = undefined) => {
    const results = [];
    const increaseEntropy = increaseEntropyOveride === undefined ? store.getState().settings.increaseEntropy : increaseEntropyOveride === true;

    if (increaseEntropy) {
        for (let i = 0; i < rolls; i++) {
            const [roll, nextRng] = prand.uniformIntDistribution(min, max, rng);

            results.push(roll);

            rng = nextRng;
        }
    } else {
        for (let i = 0; i < rolls; i++) {
            results.push(Math.floor(Math.random() * (max - min + 1)) + min);
        }
    }

    return results.length === 1 ? results[0] : results;
};

const store = configureStore({
    reducer: {
        architect,
        builder,
        orchestrator,
        dieRoller,
        massRoller,
        settings,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            immutableCheck: false,
            serializableCheck: false,
        }),
});

const Drawer = createDrawerNavigator();

const localStyles = ScaledSheet.create({
    drawer: {
        backgroundColor: '#FFECCE',
        borderWidth: 0.5,
        borderLeftColor: '#303030',
        width: '180@vs',
        color: '#000',
    },
    label: {
        color: '#000',
        fontSize: '14@vs',
    },
});

const drawerContentOptions = {
    activeTintColor: '#db8d4f',
    activeBackgroundColor: '#FFECCE',
    labelStyle: localStyles.label,
};

const filterRoute = item => {
    if (
        (common.isEmptyObject(store.getState().builder.character) && item.name === 'Builder') ||
        (common.isEmptyObject(store.getState().architect.template) && item.name === 'Architect')
    ) {
        return false;
    }

    return true;
};

const CustomDrawerContent = props => {
    const {state, ...rest} = props;
    const newState = {...state};
    const {index, routes} = props.navigation.getState();
    const currentRoute = routes[index].name;

    // Filter out routes that are hidden either all the time or contextually
    newState.routes = newState.routes.filter(item => filterRoute(item));

    // Loop over the remaining routes and set the selected index based on the current route name (for highlighting)
    for (let i = 0; i < newState.routes.length; i++) {
        if (currentRoute === newState.routes[i].name) {
            newState.index = i;
            break;
        }
    }

    return (
        <DrawerContentScrollView {...props}>
            <DrawerItemList state={newState} {...rest} />
        </DrawerContentScrollView>
    );
};

const DrawerIcon = name => {
    return <Icon name={name} style={{fontSize: verticalScale(14), color: '#172535', marginRight: common.isIPad() ? 0 : scale(-20)}} />;
};

export default class App extends Component {
    componentDidMount() {
        try {
            AsyncStorage.getItem('statistics').then(stats => {
                if (stats === null || !stats.hasOwnProperty('highScores')) {
                    statistics.init().then(() => console.log('Stats initialized'));
                }
            });

            appSettings.getSettings().catch(error => console.error(error));
        } catch (error) {
            console.error(error.message);
        }
    }

    _renderIcon(name) {
        return <Icon name={name} style={{fontSize: verticalScale(14), color: '#172535', marginRight: common.isIPad() ? 0 : scale(-20)}} />;
    }

    render() {
        return (
            <Provider store={store}>
                <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
                    <Root>
                        <GestureHandlerRootView style={{flex: 1}}>
                            <NavigationContainer onReady={() => SplashScreen.hide()}>
                                <Drawer.Navigator
                                    screenOptions={{
                                        headerShown: false,
                                        drawerPosition: 'right',
                                        drawerContentOptions: drawerContentOptions,
                                        drawerStyle: localStyles.drawer,
                                        drawerLabelStyle: {color: '#000'},
                                        contentStyle: {
                                            backgroundColor: '#fff',
                                        },
                                        drawerActiveBackgroundColor: '#db8d4f',
                                    }}
                                    initialRouteName="Home"
                                    backBehavior="history"
                                    drawerContent={CustomDrawerContent}>
                                    <Drawer.Screen options={{drawerLabel: 'Home', drawerIcon: () => DrawerIcon('house')}} name="Home" component={HomeScreen} />
                                    <Drawer.Screen
                                        options={{drawerLabel: 'Builder', drawerIcon: () => DrawerIcon('screwdriver-wrench')}}
                                        name="Builder"
                                        component={BuilderScreen}
                                    />
                                    <Drawer.Screen
                                        options={{drawerLabel: 'Characters', drawerIcon: () => DrawerIcon('address-book')}}
                                        name="LoadCharacter"
                                        component={LoadCharacterScreen}
                                    />
                                    <Drawer.Screen
                                        options={{drawerLabel: 'Die Roller', drawerIcon: () => DrawerIcon('dice-six')}}
                                        name="DieRoller"
                                        component={DieRollerScreen}
                                    />
                                    <Drawer.Screen
                                        options={{drawerLabel: 'Statistics', drawerIcon: () => DrawerIcon('chart-bar')}}
                                        name="Statistics"
                                        component={StatisticsScreen}
                                    />
                                    <Drawer.Screen
                                        options={{drawerLabel: 'Architect', drawerIcon: () => DrawerIcon('compass-drafting')}}
                                        name="Architect"
                                        component={ArchitectScreen}
                                    />
                                    <Drawer.Screen
                                        options={{drawerLabel: 'Templates', drawerIcon: () => DrawerIcon('layer-group')}}
                                        name="NewTemplate"
                                        component={NewTemplateScreen}
                                    />
                                    <Drawer.Screen
                                        options={{drawerLabel: 'Mass Roller', drawerIcon: () => DrawerIcon('dice')}}
                                        name="MassRoller"
                                        component={MassRollerScreen}
                                    />
                                    <Drawer.Screen
                                        options={{drawerLabel: 'Orchestator', drawerIcon: () => DrawerIcon('diagram-project')}}
                                        name="Orchestrator"
                                        component={OrchestratorScreen}
                                    />
                                    <Drawer.Screen
                                        options={{
                                            drawerItemStyle: {
                                                display: 'none',
                                            },
                                        }}
                                        name="TemplateSelect"
                                        component={TemplateSelectScreen}
                                    />
                                    <Drawer.Screen
                                        options={{
                                            drawerItemStyle: {
                                                display: 'none',
                                            },
                                        }}
                                        name="OpenTemplate"
                                        component={OpenTemplateScreen}
                                    />
                                    <Drawer.Screen
                                        name="EditAttribute"
                                        options={{
                                            drawerItemStyle: {
                                                display: 'none',
                                            },
                                        }}
                                        component={EditAttributeScreen}
                                    />
                                    <Drawer.Screen
                                        name="EditSkill"
                                        options={{
                                            drawerItemStyle: {
                                                display: 'none',
                                            },
                                        }}
                                        component={EditSkillScreen}
                                    />
                                    <Drawer.Screen
                                        name="EditOption"
                                        options={{
                                            drawerItemStyle: {
                                                display: 'none',
                                            },
                                        }}
                                        component={EditOptionScreen}
                                    />
                                    <Drawer.Screen
                                        name="Specialization"
                                        options={{
                                            drawerItemStyle: {
                                                display: 'none',
                                            },
                                        }}
                                        component={SpecializationScreen}
                                    />
                                    <Drawer.Screen
                                        name="CharacterOptions"
                                        options={{
                                            drawerItemStyle: {
                                                display: 'none',
                                            },
                                        }}
                                        component={CharacterOptionsScreen}
                                    />
                                    <Drawer.Screen
                                        name="EditActor"
                                        options={{
                                            drawerItemStyle: {
                                                display: 'none',
                                            },
                                        }}
                                        component={EditActorScreen}
                                    />
                                    <Drawer.Screen
                                        name="BackupAndRestore"
                                        options={{drawerLabel: 'Backup & Restore', drawerIcon: () => DrawerIcon('file-export')}}
                                        component={BackupAndRestoreScreen}
                                    />
                                    <Drawer.Screen
                                        options={{drawerLabel: 'Settings', drawerIcon: () => DrawerIcon('gears')}}
                                        name="Settings"
                                        component={SettingsScreen}
                                    />
                                </Drawer.Navigator>
                            </NavigationContainer>
                        </GestureHandlerRootView>
                    </Root>
                </SafeAreaView>
            </Provider>
        );
    }
}
