import React, {useCallback, useState, useRef, useEffect} from 'react';
import PropTypes from 'prop-types';
import {useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/core';
import {View} from 'react-native';
import {Picker, Item} from 'native-base';
import {scale, verticalScale} from 'react-native-size-matters';
import {Header} from '../Header';
import Heading from '../Heading';
import {Button} from '../Button';
import DieSlider from '../DieSlider';
import {VirtualizedList} from '../VirtualizedList';
import {RollResults} from '../RollResults';
import {Animated} from '../animated';
import {dieRoller, TYPE_CLASSIC, TYPE_LEGEND} from '../../lib/DieRoller';
import {statistics} from '../../lib/Statistics';
import styles from '../../Styles';

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

export const DieRollerScreen = ({route, navigation}) => {
    const [result, setResult] = useState(null);

    const statsCaptured = useRef(false);

    const dice = useRef(0);

    const pips = useRef(0);

    const modifier = useRef(0);

    const numberOfRolls = useRef(1);

    const showAnimations = useSelector(state => state.settings.animations);

    const rollStyle = useSelector(state => (state.settings.isLegend ? TYPE_LEGEND : TYPE_CLASSIC));

    const diceRef = useRef(null);

    const scrollRef = useRef();

    useFocusEffect(
        useCallback(() => {
            if (route.params && route.params.autoRoll) {
                dice.current = route.params.dice;
                pips.current = route.params.pips;
                numberOfRolls.current = 1;

                _roll().catch(error => console.error(error));
            }

            return () => {
                // Delete the route params so they don't interfere future navigations to this screen
                if (route.params && route.params.hasOwnProperty('autoRoll')) {
                    delete route.params.autoRoll;
                }
            };
        }, [route, _roll]),
    );

    useEffect(() => {
        if (showAnimations && diceRef.current !== null) {
            diceRef.current.reset();

            diceRef.current.play();
        }
    }, [showAnimations]);

    const _roll = useCallback(async () => {
        scrollRef.current.scrollToTop();

        if (showAnimations) {
            if (diceRef.current) {
                diceRef.current.reset();

                diceRef.current.play();
            }
        }

        statsCaptured.current = false;

        const rollResults = dieRoller.roll(dice.current, numberOfRolls.current);

        setResult(rollResults);

        await statistics.add([...rollResults], rollStyle);

        statsCaptured.current = true;
    }, [dice, numberOfRolls, rollStyle, showAnimations]);

    const _updateDice = value => {
        dice.current = value;
    };

    const _renderRollButtonLabel = () => {
        let label = 'Roll';

        if (result === null) {
            return label;
        }

        return label + ' Again';
    };

    const _renderResult = () => {
        if (result === null || result.length === 0) {
            return null;
        }

        if (!statsCaptured) {
            return <View flex={1} style={{height: verticalScale(105)}} alignItems="center" justifyContent="space-around" />;
        }

        const totalDiceRolled = result.reduce((total, roll) => total + roll.rolls.length + roll.bonusRolls.length + (roll.penaltyRoll === null ? 0 : 1) + 1, 0);

        return result.map(roll => (
            <RollResults
                key={`roll-result-${roll.uuid}`}
                roll={roll}
                dice={dice.current}
                pips={pips.current}
                modifier={modifier.current}
                rollStyle={rollStyle}
                totalDiceRolled={totalDiceRolled}
            />
        ));
    };

    const _renderPipsPicker = () => {
        if (rollStyle === TYPE_LEGEND) {
            return null;
        }

        return (
            <View>
                <Picker
                    inlinelabel
                    label="Pips"
                    style={styles.picker}
                    textStyle={{fontSize: scale(12)}}
                    iosHeader="Select one"
                    mode="dropdown"
                    selectedValue={pips}
                    onValueChange={val => (pips.current = val)}>
                    <Item label="+0 pips" value={0} />
                    <Item label="+1 pip" value={1} />
                    <Item label="+2 pips" value={2} />
                </Picker>
            </View>
        );
    };

    const _renderModifierSlider = () => {
        if (rollStyle === TYPE_CLASSIC) {
            return (
                <View>
                    <DieSlider
                        label="Modifier:"
                        value={parseInt(modifier.current, 10)}
                        step={1}
                        min={-20}
                        max={20}
                        onValueChange={val => (modifier.current = val)}
                        disabled={false}
                    />
                </View>
            );
        }

        return null;
    };

    const _renderNumberOfRollsSlider = () => {
        return (
            <View>
                <DieSlider
                    label="Rolls:"
                    value={parseInt(numberOfRolls.current, 10)}
                    step={1}
                    min={1}
                    max={10}
                    onValueChange={val => (numberOfRolls.current = val)}
                    disabled={false}
                />
            </View>
        );
    };

    return (
        <>
            <Header navigation={navigation} />
            <Heading text="Die Roller" />
            <VirtualizedList ref={scrollRef} flex={1}>
                <View flexGrow={1} style={{paddingHorizontal: scale(10)}}>
                    {_renderResult()}
                    <Animated animationProps={{from: {opacity: 0, translateX: 150}, animate: {opacity: 1, translateX: 0}}}>
                        <View>
                            <DieSlider
                                label="Dice:"
                                value={parseInt(numberOfRolls.current, 10)}
                                step={1}
                                min={1}
                                max={60}
                                onValueChange={_updateDice}
                                disabled={false}
                            />
                        </View>
                        <View style={{paddingBottom: 20}} />
                        {_renderPipsPicker()}
                        {_renderModifierSlider()}
                        {_renderNumberOfRollsSlider()}
                        <View style={{paddingBottom: 20}} />
                        <View style={styles.buttonContainer}>
                            <Button label={_renderRollButtonLabel()} onPress={() => _roll().catch(error => console.error(error))} />
                        </View>
                        <View style={{paddingBottom: 50}} />
                    </Animated>
                </View>
            </VirtualizedList>
        </>
    );
};

DieRollerScreen.propTypes = {
    route: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
};
