import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Platform, StyleSheet, ScrollView, View, TouchableHighlight, Alert, BackHandler } from 'react-native';
import { TabHeading, Container, Content, Button, Text, Picker, Item, Label, Input, List, ListItem, Left, Right, Body, Icon, Tab, Tabs, Textarea, Footer, FooterTab, ScrollableTab } from 'native-base';
import { ScaledSheet, scale, verticalScale } from 'react-native-size-matters';
import Header from '../Header';
import Heading from '../Heading';
import LogoButton from '../LogoButton';
import Appearance from '../builder/Appearance';
import AttributesAndSkills from '../builder/AttributesAndSkills';
import Specializations from '../builder/Specializations';
import Options from '../builder/Options';
import Health from '../builder/Health';
import Defenses from '../builder/Defenses';
import InfoDialog from '../InfoDialog';
import styles from '../../Styles';
import { character, OPTION_ADVANTAGES, OPTION_COMPLICATIONS, OPTION_SPECIAL_ABILITIES } from '../../lib/Character';
import { file } from '../../lib/File';
import { common } from '../../lib/Common';
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
    loadCharacter
} from '../../reducers/builder';
import { updateRoller } from '../../reducers/dieRoller';

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
        loadCharacter: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            infoDialog: {
                visible: false,
                title: '',
                info: ''
            }
        }

        this.closeInfoDialog = this._closeInfoDialog.bind(this);
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.navigate('Home');

            return true;
        });
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }

    _closeInfoDialog() {
        let newState = {...this.state}
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
        file.importCharacter(() => {}, () => {}).then((character) => {
            if (character !== undefined && character !== null) {
                this.props.loadCharacter(character);
            }
        });
    }

    _renderTabHeading(headingText) {
        return (
            <TabHeading style={localStyles.tabHeading} activeTextStyle={localStyles.activeTextStyle}>
                <Text style={localStyles.tabStyle}>
                    {headingText}
                </Text>
            </TabHeading>
        );
    }

	render() {
      if (this.props.character === null || this.props.character === undefined) {
          return (
              <Container style={styles.container}>
                  <Header navigation={this.props.navigation} hasTabs={true} />
                  <Content style={styles.content}>
                      <Heading text='Character' onBackButtonPress={() => this.props.navigation.navigate('Home')} />
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
		    <Container style={styles.container}>
                <Header navigation={this.props.navigation} hasTabs={true} />
                <Content style={styles.content}>
                    <Tabs locked={true} tabBarUnderlineStyle={{backgroundColor: '#FFF'}} renderTabBar={()=> <ScrollableTab style={localStyles.scrollableTab} />}>
                        <Tab heading={this._renderTabHeading('Character')} tabStyle={localStyles.tabHeading} activeTabStyle={localStyles.activeTabStyle} activeTextStyle={localStyles.activeTextStyle}>
                            <Heading text='Name &amp; Species' onBackButtonPress={() => this.props.navigation.navigate('Home')} />
                            <Appearance character={this.props.character} updateAppearance={this.props.updateAppearance} />
                            <Heading text='Points' />
                            <View style={styles.titleContainer}>
                                <View style={{paddingLeft: scale(20)}}>
                                    <Item stackedLabel style={{width: scale(100)}}>
                                        <Label style={{fontSize: scale(10)}}>Character Points</Label>
                                        <Input
                                            style={[styles.grey, {height: verticalScale(42)}]}
                                            keyboardType='numeric'
                                            maxLength={4}
                                            value={characterPoints.toString()}
                                            onChangeText={(value) => this._updatePoints('characterPoints', value)}
                                        />
                                    </Item>
                                </View>
                                <View style={{paddingRight: scale(20)}}>
                                    <Item stackedLabel style={{width: scale(100)}}>
                                        <Label style={{fontSize: scale(10)}}>Fate Points</Label>
                                        <Input
                                            style={[styles.grey, {height: verticalScale(42)}]}
                                            keyboardType='numeric'
                                            maxLength={4}
                                            value={fatePoints.toString()}
                                            onChangeText={(value) => this._updatePoints('fatePoints', value)}
                                        />
                                    </Item>
                                </View>
                            </View>
                            <View style={[styles.contentPadded, {paddingHorizontal: 30}]}>
                                <View style={styles.titleContainer}>
                                    <Text style={styles.grey}>
                                        <Text style={styles.boldGrey}>Build Points:</Text> {character.getTotalPoints(this.props.character)}
                                    </Text>
                                    <Text style={styles.grey}>
                                        <Text style={styles.boldGrey}>Complication Points:</Text> {character.getComplicationPoints(this.props.character)}
                                    </Text>
                                </View>
                            </View>
                            <View style={{paddingBottom: 20}} />
                            <AttributesAndSkills
                                navigation={this.props.navigation}
                                character={this.props.character}
                                settings={this.props.settings}
                                updateCharacterDieCode={this.props.updateCharacterDieCode}
                                updateRoller={this.props.updateRoller}
                                updateMove={this.props.updateAppearance}
                            />
                            <Specializations
                                navigation={this.props.navigation}
                                character={this.props.character}
                                updateRoller={this.props.updateRoller}
                            />
                            <Options
                                title='Advantages'
                                optionKey={OPTION_ADVANTAGES}
                                navigation={this.props.navigation}
                                character={this.props.character}
                                updateOption={this.props.updateOption}
                                removeOption={this.props.removeOption}
                            />
                            <Options
                                title='Complications'
                                optionKey={OPTION_COMPLICATIONS}
                                navigation={this.props.navigation}
                                character={this.props.character}
                                updateOption={this.props.updateOption}
                                removeOption={this.props.removeOption}
                            />
                            <Options
                                title='Special Abilities'
                                optionKey={OPTION_SPECIAL_ABILITIES}
                                navigation={this.props.navigation}
                                character={this.props.character}
                                updateOption={this.props.updateOption}
                                removeOption={this.props.removeOption}
                            />
                            <Health
                                character={this.props.character}
                                updateHealthSystem={this.props.updateHealthSystem}
                                updateWounds={this.props.updateWounds}
                                updateBodyPoints={this.props.updateBodyPoints}
                            />
                            <Defenses
                                character={this.props.character}
                                updateDefenseSystem={this.props.updateDefenseSystem}
                                updateStaticDefense={this.props.updateStaticDefense}
                            />
                            <View style={{paddingBottom: 20}} />
                            <InfoDialog
                                visible={this.state.infoDialog.visible}
                                title={this.state.infoDialog.title}
                                info={this.state.infoDialog.info}
                                onClose={this.closeInfoDialog}
                            />
                        </Tab>
                        <Tab heading={this._renderTabHeading('Equipment')} tabStyle={localStyles.tabHeading} activeTabStyle={localStyles.activeTabStyle} activeTextStyle={localStyles.activeTextStyle}>
                            <Heading text='Equipment' onBackButtonPress={() => this.props.navigation.navigate('Home')} />
                            <Textarea
                                rowSpan={10}
                                bordered
                                maxLength={5000}
                                value={equipment}
                                onChangeText={(value) => this.props.updateAppearance('equipment', value)}
                            />
                            <Heading text='Currency' />
                            <Textarea
                                rowSpan={5}
                                bordered
                                maxLength={1000}
                                value={currency}
                                onChangeText={(value) => this.props.updateAppearance('currency', value)}
                            />
                        </Tab>
                        <Tab heading={this._renderTabHeading('Background')} tabStyle={localStyles.tabHeading} activeTabStyle={localStyles.activeTabStyle} activeTextStyle={localStyles.activeTextStyle}>
                            <Heading text='Background' onBackButtonPress={() => this.props.navigation.navigate('Home')} />
                            <Textarea
                                rowSpan={10}
                                bordered
                                maxLength={5000}
                                value={background}
                                onChangeText={(value) => this.props.updateAppearance('background', value)}
                            />
                            <View style={{paddingBottom: 20}} />
                            <Heading text='Appearance' />
                            <Textarea
                                rowSpan={10}
                                bordered
                                maxLength={5000}
                                value={appearance}
                                onChangeText={(value) => this.props.updateAppearance('appearance', value)}
                            />
                        </Tab>
                        <Tab heading={this._renderTabHeading('Notes')} tabStyle={localStyles.tabHeading} activeTabStyle={localStyles.activeTabStyle} activeTextStyle={localStyles.activeTextStyle}>
                            <Heading text='Notes' onBackButtonPress={() => this.props.navigation.navigate('Home')} />
                            <Textarea
                                rowSpan={15}
                                bordered
                                maxLength={10000}
                                value={notes}
                                onChangeText={(value) => this.props.updateAppearance('notes', value)}
                            />
                        </Tab>
                    </Tabs>
                </Content>
                <Footer>
                    <FooterTab style={{justifyContent: 'center', backgroundColor: '#f57e20'}}>
                        <Button vertical onPress={() => this.props.navigation.navigate('TemplateSelect', {from: 'Builder'})}>
                            <Icon type='FontAwesome' name='file' style={{color: '#FFF'}} />
                            <Text uppercase={false} style={{color: '#FFF'}}>New</Text>
                        </Button>
                        <Button vertical onPress={() => this._save()}>
                            <Icon type='FontAwesome' name='save' style={{color: '#FFF'}} />
                            <Text uppercase={false} style={{color: '#FFF'}}>Save</Text>
                        </Button>
                        <Button vertical onPress={() => this.props.navigation.navigate('LoadCharacter')}>
                            <Icon type='FontAwesome' name='folder-open' style={{color: '#FFF'}}/>
                            <Text uppercase={false} style={{color: '#FFF'}}>Open</Text>
                        </Button>
                        <Button vertical onPress={() => this._import()}>
                            <Icon type='FontAwesome' name='download' style={{color: '#FFF'}}/>
                            <Text uppercase={false} style={{color: '#FFF'}}>Import</Text>
                        </Button>
                    </FooterTab>
                </Footer>
	        </Container>
		);
	}
}

const localStyles = ScaledSheet.create({
	tabHeading: {
		backgroundColor: '#f57e20',
        color: '#FFF' /* For iOS */
	},
	activeTabStyle: {
		backgroundColor: '#FFF',
		color: '#FFF',
        fontSize: 999
	},
	activeTextStyle: {
        backgroundColor: '#FFF',
	    color: '#FFF'
	},
	tabStyle: {
	    fontSize: '12@s',
        color: '#FFF'
	},
	tabHeading: {
	    backgroundColor: '#f57e20'
	},
	scrollableTab: {
	    backgroundColor: '#f57e20'
	}
});

const mapStateToProps = state => {
    return {
        character: state.builder.character,
        settings: state.settings
    };
}

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
    loadCharacter
}

export default connect(mapStateToProps, mapDispatchToProps)(BuilderScreen);
