import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Platform, StyleSheet, ScrollView, View, TouchableHighlight, Alert, BackHandler } from 'react-native';
import { Container, Content, Button, Text, Picker, Item, Label, Input, List, ListItem, Left, Right, Body, Icon, Tab, Tabs, Textarea, Footer, FooterTab } from 'native-base';
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
    updateRoller,
    updateCharacterDieCode,
    updateAppearance,
    updateOption,
    removeOption,
    updateHealthSystem,
    updateWounds,
    updateBodyPoints,
    updateDefenseSystem,
    updateStaticDefense
} from '../../../reducer';

class BuilderScreen extends Component {
    static propTypes = {
        navigation: PropTypes.object.isRequired,
        character: PropTypes.object.isRequired,
        updateRoller: PropTypes.func.isRequired,
        updateCharacterDieCode: PropTypes.func.isRequired,
        updateAppearance: PropTypes.func.isRequired,
        updateOption: PropTypes.func.isRequired,
        removeOption: PropTypes.func.isRequired,
        updateHealthSystem: PropTypes.func.isRequired,
        updateWounds: PropTypes.func.isRequired,
        updateBodyPoints: PropTypes.func.isRequired,
        updateDefenseSystem: PropTypes.func.isRequired,
        updateStaticDefense: PropTypes.func.isRequired
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

	render() {
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
                    <Tabs locked={true} tabBarUnderlineStyle={{backgroundColor: '#FFF'}}>
                        <Tab heading='Character' tabStyle={localStyles.tabHeading} activeTabStyle={localStyles.activeTabStyle} activeTextStyle={{color: '#FFF'}}>
                            <Heading text='Name &amp; Species' />
                            <Appearance character={this.props.character} updateAppearance={this.props.updateAppearance} />
                            <View style={styles.titleContainer}>
                                <View style={{paddingLeft: 30}}>
                                    <Item stackedLabel style={{width: 150}}>
                                        <Label>Character Points</Label>
                                        <Input
                                            style={styles.grey}
                                            keyboardType='numeric'
                                            maxLength={4}
                                            value={characterPoints.toString()}
                                            onChangeText={(value) => this._updatePoints('characterPoints', value)}
                                        />
                                    </Item>
                                </View>
                                <View style={{paddingRight: 30}}>
                                    <Item stackedLabel style={{width: 150}}>
                                        <Label>Fate Points</Label>
                                        <Input
                                            style={styles.grey}
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
                                        <Text style={styles.boldGrey}>Total Points:</Text> {character.getTotalPoints(this.props.character)}
                                    </Text>
                                    <Text style={styles.grey}>
                                        <Text style={styles.boldGrey}>Complications:</Text> {character.getComplicationPoints(this.props.character)}
                                    </Text>
                                </View>
                            </View>
                            <View style={{paddingBottom: 20}} />
                            <AttributesAndSkills
                                navigation={this.props.navigation}
                                character={this.props.character}
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
                        <Tab heading='Equipment' tabStyle={localStyles.tabHeading} activeTabStyle={localStyles.activeTabStyle} activeTextStyle={{color: '#FFF'}}>
                            <Heading text='Equipment' />
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
                        <Tab heading='Background' tabStyle={localStyles.tabHeading} activeTabStyle={localStyles.activeTabStyle} activeTextStyle={{color: '#FFF'}}>
                            <Heading text='Background' />
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
                        <Tab heading='Notes' tabStyle={localStyles.tabHeading} activeTabStyle={localStyles.activeTabStyle} activeTextStyle={{color: '#FFF'}}>
                            <Heading text='Notes' />
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
                        <Button vertical onPress={() => this.props.navigation.navigate('TemplateSelect')}>
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
                    </FooterTab>
                </Footer>
	        </Container>
		);
	}
}

const localStyles = StyleSheet.create({
	tabHeading: {
		backgroundColor: '#f57e20'
	},
	activeTabStyle: {
		backgroundColor: '#f57e20',
		color: '#FFF'
	}
});

const mapStateToProps = state => {
    return {
        character: state.builder.character
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
    updateStaticDefense
}

export default connect(mapStateToProps, mapDispatchToProps)(BuilderScreen);
