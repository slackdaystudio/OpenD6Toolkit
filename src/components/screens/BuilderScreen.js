import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Dimensions, View} from 'react-native';
import {Container, Content, Button, Text, Item, Label, Input, Icon, Textarea, Footer, FooterTab} from 'native-base';
import {scale, verticalScale} from 'react-native-size-matters';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Header} from '../Header';
import Heading from '../Heading';
import {Placeholder} from './Placeholder';
import Appearance from '../builder/Appearance';
import AttributesAndSkills from '../builder/AttributesAndSkills';
import Specializations from '../builder/Specializations';
import Options from '../builder/Options';
import Health from '../builder/Health';
import Defenses from '../builder/Defenses';
import InfoDialog from '../InfoDialog';
import styles from '../../Styles';
import {character as libCharacter, OPTION_ADVANTAGES, OPTION_COMPLICATIONS, OPTION_SPECIAL_ABILITIES} from '../../lib/Character';
import {file} from '../../lib/File';
import {
    updateCharacterDieCode,
    updateAppearance,
    updateOption,
    removeOption,
    updateHealthSystem,
    updateWounds,
    updateBodyPoints,
    updateDefenseSystem,
    updateStaticDefense,
    loadCharacter,
} from '../../reducers/builder';
import {updateRoller} from '../../reducers/dieRoller';
import {VirtualizedList} from '../VirtualizedList';

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

const Tab = createMaterialTopTabNavigator();

const CharacterTab = props => {
    return (
        <VirtualizedList>
            <Heading text="Name &amp; Species" onBackButtonPress={() => props.navigation.navigate('Home')} />
            <Appearance character={props.character} updateAppearance={props.updateAppearance} />
            <Heading text="Points" />
            <View style={styles.titleContainer}>
                <View style={{paddingLeft: scale(20)}}>
                    <Item stackedLabel style={{width: scale(100)}}>
                        <Label style={{fontSize: scale(10)}}>Character Points</Label>
                        <Input
                            style={styles.textInput}
                            keyboardType="numeric"
                            maxLength={4}
                            value={props.characterPoints.toString()}
                            onChangeText={value => props.updatePoints('characterPoints', value)}
                        />
                    </Item>
                </View>
                <View style={{paddingRight: scale(20)}}>
                    <Item stackedLabel style={{width: scale(100)}}>
                        <Label style={{fontSize: scale(10)}}>Fate Points</Label>
                        <Input
                            style={styles.textInput}
                            keyboardType="numeric"
                            maxLength={4}
                            value={props.fatePoints.toString()}
                            onChangeText={value => props.updatePoints('fatePoints', value)}
                        />
                    </Item>
                </View>
            </View>
            <View style={[styles.contentPadded, {paddingHorizontal: 30}]}>
                <View style={styles.titleContainer}>
                    <Text style={styles.grey}>
                        <Text style={styles.boldGrey}>Build Points:</Text> {libCharacter.getTotalPoints(props.character)}
                    </Text>
                    <Text style={styles.grey}>
                        <Text style={styles.boldGrey}>Complication Points:</Text> {libCharacter.getComplicationPoints(props.character)}
                    </Text>
                </View>
            </View>
            <View style={{paddingBottom: 20}} />
            <AttributesAndSkills
                navigation={props.navigation}
                character={props.character}
                settings={props.settings}
                updateCharacterDieCode={props.updateCharacterDieCode}
                updateRoller={props.updateRoller}
                updateMove={props.updateAppearance}
            />
            <Specializations navigation={props.navigation} character={props.character} updateRoller={props.updateRoller} />
            <Options
                title="Advantages"
                optionKey={OPTION_ADVANTAGES}
                navigation={props.navigation}
                character={props.character}
                updateOption={props.updateOption}
                removeOption={props.removeOption}
            />
            <Options
                title="Complications"
                optionKey={OPTION_COMPLICATIONS}
                navigation={props.navigation}
                character={props.character}
                updateOption={props.updateOption}
                removeOption={props.removeOption}
            />
            <Options
                title="Special Abilities"
                optionKey={OPTION_SPECIAL_ABILITIES}
                navigation={props.navigation}
                character={props.character}
                updateOption={props.updateOption}
                removeOption={props.removeOption}
            />
            <Health
                character={props.character}
                updateHealthSystem={props.updateHealthSystem}
                updateWounds={props.updateWounds}
                updateBodyPoints={props.updateBodyPoints}
            />
            <Defenses character={props.character} updateDefenseSystem={props.updateDefenseSystem} updateStaticDefense={props.updateStaticDefense} />
            <View style={{paddingBottom: 20}} />
            <InfoDialog visible={props.infoDialog.visible} title={props.infoDialog.title} info={props.infoDialog.info} onClose={props.closeInfoDialog} />
        </VirtualizedList>
    );
};

const EquipmentTab = props => {
    return (
        <VirtualizedList>
            <Heading text="Equipment" onBackButtonPress={() => props.navigation.navigate('Home')} />
            <Textarea
                style={{fontSize: verticalScale(18)}}
                rowSpan={10}
                bordered
                maxLength={5000}
                value={props.equipment}
                onChangeText={value => props.updateAppearance('equipment', value)}
            />
            <Heading text="Currency" />
            <Textarea
                style={{fontSize: verticalScale(18)}}
                rowSpan={5}
                bordered
                maxLength={1000}
                value={props.currency}
                onChangeText={value => props.updateAppearance('currency', value)}
            />
        </VirtualizedList>
    );
};

const BackgroundTab = props => {
    return (
        <VirtualizedList>
            <Heading text="Background" onBackButtonPress={() => props.navigation.navigate('Home')} />
            <Textarea
                style={{fontSize: verticalScale(18)}}
                rowSpan={10}
                bordered
                maxLength={5000}
                value={props.background}
                onChangeText={value => props.updateAppearance('background', value)}
            />
            <View style={{paddingBottom: 20}} />
            <Heading text="Appearance" />
            <Textarea
                style={{fontSize: verticalScale(18)}}
                rowSpan={10}
                bordered
                maxLength={5000}
                value={props.appearance}
                onChangeText={value => props.updateAppearance('appearance', value)}
            />
        </VirtualizedList>
    );
};

const NotesTab = props => {
    return (
        <VirtualizedList>
            <Heading text="Notes" onBackButtonPress={() => props.navigation.navigate('Home')} />
            <Textarea
                style={{fontSize: verticalScale(18)}}
                rowSpan={15}
                bordered
                maxLength={10000}
                value={props.notes}
                onChangeText={value => props.updateAppearance('notes', value)}
            />
        </VirtualizedList>
    );
};

const width = Dimensions.get('window').width;

const height = Dimensions.get('window').height;

class BuilderScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        character: PropTypes.object.isRequired,
        settings: PropTypes.object.isRequired,
        updateRoller: PropTypes.func.isRequired,
        updateCharacterDieCode: PropTypes.func.isRequired,
        updateAppearance: PropTypes.func.isRequired,
        updateOption: PropTypes.func.isRequired,
        removeOption: PropTypes.func.isRequired,
        updateHealthSystem: PropTypes.func.isRequired,
        updateWounds: PropTypes.func.isRequired,
        updateBodyPoints: PropTypes.func.isRequired,
        updateDefenseSystem: PropTypes.func.isRequired,
        updateStaticDefense: PropTypes.func.isRequired,
        loadCharacter: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            infoDialog: {
                visible: false,
                title: '',
                info: '',
            },
        };

        this.closeInfoDialog = this._closeInfoDialog.bind(this);
        this.updatePoints = this._updatePoints.bind(this);
    }

    _closeInfoDialog() {
        let newState = {...this.state};
        newState.infoDialog.visible = false;

        this.setState(newState);
    }

    _save() {
        if (this.props.character.name === undefined || this.props.character.name === null || this.props.character.name.trim() === '') {
            let newState = {...this.state};
            newState.infoDialog.visible = true;
            newState.infoDialog.title = 'Name You Character';
            newState.infoDialog.info = 'Please name your character before saving them';

            this.setState(newState);
        } else {
            file.saveCharacter(this.props.character);
        }
    }

    _updatePoints(key, value) {
        let points = '';

        if (value === '' || value === '-') {
            points = value;
        } else {
            points = parseInt(value, 10) || 1;

            if (points > 9999) {
                points = 9999;
            } else if (points < 0) {
                points = 0;
            }
        }

        this.props.updateAppearance(key, points);
    }

    _import() {
        file.importCharacter(
            () => {},
            () => {},
        ).then(character => {
            if (character !== undefined && character !== null) {
                this.props.loadCharacter(character);
            }
        });
    }

    render() {
        if (this.props.character === null || this.props.character === undefined) {
            return (
                <Container style={styles.container}>
                    <Header navigation={this.props.navigation} hasTabs={true} />
                    <Content style={styles.content}>
                        <Heading text="Character" onBackButtonPress={() => this.props.navigation.navigate('Home')} />
                    </Content>
                </Container>
            );
        }
        // These properties were added in after the first production release so there needs to be an undefined check
        let characterPoints = this.props.character.characterPoints == undefined ? 5 : this.props.character.characterPoints;
        let fatePoints = this.props.character.fatePoints == undefined ? 2 : this.props.character.fatePoints;
        let background = this.props.character.background == undefined ? '' : this.props.character.background;
        let appearance = this.props.character.appearance == undefined ? '' : this.props.character.appearance;
        let currency = this.props.character.currency == undefined ? '' : this.props.character.currency;
        let equipment = this.props.character.equipment == undefined ? '' : this.props.character.equipment;
        let notes = this.props.character.notes == undefined ? '' : this.props.character.notes;

        return (
            <>
                <Header navigation={this.props.navigation} hasTabs={true} />
                <Tab.Navigator
                    sceneContainerStyle={styles.container}
                    screenOptions={{
                        tabBarLabelStyle: {color: styles.grey.color},
                        tabBarStyle: {backgroundColor: styles.container.backgroundColor},
                        tabBarIndicatorStyle: {backgroundColor: '#f57e20'},
                        tabBarScrollEnabled: true,
                        tabBarItemStyle: {width: 150},
                        lazy: true,
                        lazyPlaceholder: Placeholder,
                        swipeEnabled: false,
                    }}
                    initialLayout={{height, width}}>
                    <Tab.Screen name="Character">
                        {() => (
                            <CharacterTab
                                {...this.props}
                                characterPoints={characterPoints}
                                fatePoints={fatePoints}
                                infoDialog={this.state.infoDialog}
                                closeInfoDialog={this.closeInfoDialog}
                                updatePoints={this.updatePoints}
                            />
                        )}
                    </Tab.Screen>
                    <Tab.Screen name="Equipment">{() => <EquipmentTab {...this.props} equipment={equipment} currency={currency} />}</Tab.Screen>
                    <Tab.Screen name="Background">{() => <BackgroundTab {...this.props} background={background} appearance={appearance} />}</Tab.Screen>
                    <Tab.Screen name="Notes">{() => <NotesTab {...this.props} notes={notes} />}</Tab.Screen>
                </Tab.Navigator>
                <Footer>
                    <FooterTab style={{justifyContent: 'center', backgroundColor: '#f57e20'}}>
                        <Button vertical onPress={() => this.props.navigation.navigate('TemplateSelect', {from: 'Builder'})}>
                            <Icon type="FontAwesome" name="file" style={{color: '#FFF'}} />
                            <Text uppercase={false} style={{color: '#FFF'}}>
                                New
                            </Text>
                        </Button>
                        <Button vertical onPress={() => this._save()}>
                            <Icon type="FontAwesome" name="save" style={{color: '#FFF'}} />
                            <Text uppercase={false} style={{color: '#FFF'}}>
                                Save
                            </Text>
                        </Button>
                        <Button vertical onPress={() => this.props.navigation.navigate('LoadCharacter')}>
                            <Icon type="FontAwesome" name="folder-open" style={{color: '#FFF'}} />
                            <Text uppercase={false} style={{color: '#FFF'}}>
                                Open
                            </Text>
                        </Button>
                        <Button vertical onPress={() => this._import()}>
                            <Icon type="FontAwesome" name="download" style={{color: '#FFF'}} />
                            <Text uppercase={false} style={{color: '#FFF'}}>
                                Import
                            </Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        character: state.builder.character,
        settings: state.settings,
    };
};

const mapDispatchToProps = {
    updateRoller,
    updateCharacterDieCode,
    updateAppearance,
    updateOption,
    removeOption,
    updateHealthSystem,
    updateWounds,
    updateBodyPoints,
    updateDefenseSystem,
    updateStaticDefense,
    loadCharacter,
};

export default connect(mapStateToProps, mapDispatchToProps)(BuilderScreen);
