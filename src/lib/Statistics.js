import AsyncStorage from '@react-native-async-storage/async-storage';
import {dieRoller, STATE_CRITICAL_SUCCESS, STATE_CRITICAL_FAILURE, STATE_NORMAL, TYPE_LEGEND, TYPE_CLASSIC} from './DieRoller';

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

// Equivalent of rolling 10,000 dice which the app can't do (Infinity was giving me grief)
export const CONTEXTUALLY_INFINITE = 60000;

export const AVERAGE_DIE_ROLL = 3.5;

export const DEFAULT_STATS = {
    sum: 0,
    largestDieRoll: 0,
    largestSum: 0,
    diceRolled: 0,
    bonusDiceRolled: 0,
    bonusDiceTotal: 0,
    penaltyDiceRolled: 0,
    penaltyDiceTotal: 0,
    largestCriticalSuccess: 0,
    lowestCriticalSuccess: CONTEXTUALLY_INFINITE,
    largestCriticalFailure: 0,
    lowestCriticalFailure: CONTEXTUALLY_INFINITE,
    criticalSuccesses: 0,
    criticalFailures: 0,
    distributions: {
        one: 0,
        two: 0,
        three: 0,
        four: 0,
        five: 0,
        six: 0,
    },
    highScores: [],
};

class Statistics {
    async init() {
        await AsyncStorage.setItem('statistics', JSON.stringify(DEFAULT_STATS));
    }

    async add(resultRoll, type) {
        let newRecord = false;
        let stats = await AsyncStorage.getItem('statistics');

        stats = JSON.parse(stats);

        let rolls = this._getAllRolls(resultRoll);
        let total = rolls.reduce((a, b) => a + b);

        stats.sum += total;
        stats.largestDieRoll = rolls.length > stats.largestDieRoll ? rolls.length : stats.largestDieRoll;
        stats.largestSum = total > stats.largestSum ? total : stats.largestSum;
        stats.diceRolled += rolls.length;

        if (resultRoll.status === STATE_CRITICAL_SUCCESS) {
            let bonusDiceTotal = resultRoll.bonusRolls.reduce((a, b) => a + b);

            stats.bonusDiceRolled += resultRoll.bonusRolls.length;
            stats.bonusDiceTotal += bonusDiceTotal;
            stats.criticalSuccesses++;
            stats.largestCriticalSuccess = bonusDiceTotal > stats.largestCriticalSuccess ? bonusDiceTotal : stats.largestCriticalSuccess;
            stats.lowestCriticalSuccess = bonusDiceTotal < stats.lowestCriticalSuccess ? bonusDiceTotal : stats.lowestCriticalSuccess;
        } else if (resultRoll.status === STATE_CRITICAL_FAILURE) {
            stats.penaltyDiceRolled++;
            stats.penaltyDiceTotal += resultRoll.penaltyRoll;
            stats.criticalFailures++;
            stats.largestCriticalFailure = resultRoll.penaltyRoll > stats.largestCriticalFailure ? resultRoll.penaltyRoll : stats.largestCriticalFailure;
            stats.lowestCriticalFailure = resultRoll.penaltyRoll < stats.lowestCriticalFailure ? resultRoll.penaltyRoll : stats.lowestCriticalFailure;
        }

        this._updateDistributions(rolls, stats.distributions);

        newRecord = this._updateHighScores(stats.highScores, resultRoll, type, total);

        await AsyncStorage.setItem('statistics', JSON.stringify(stats));

        return newRecord;
    }

    getPercentage(roll, pips) {
        const average = roll.dice * AVERAGE_DIE_ROLL;
        const sum = dieRoller.getClassicTotal(roll, pips);

        return Math.round((sum / average - 1) * 100 * 10) / 10;
    }

    _getAllRolls(resultRoll) {
        let rolls = resultRoll.rolls.slice();
        rolls.push(resultRoll.wildDieRoll);

        if (resultRoll.status === STATE_CRITICAL_SUCCESS) {
            rolls = rolls.concat(resultRoll.bonusRolls);
        } else if (resultRoll.status === STATE_CRITICAL_FAILURE) {
            rolls.push(resultRoll.penaltyRoll);
        }

        return rolls;
    }

    _updateDistributions(rolls, distributions) {
        for (let roll of rolls) {
            switch (roll) {
                case 1:
                    distributions.one++;
                    break;
                case 2:
                    distributions.two++;
                    break;
                case 3:
                    distributions.three++;
                    break;
                case 4:
                    distributions.four++;
                    break;
                case 5:
                    distributions.five++;
                    break;
                case 6:
                    distributions.six++;
                    break;
                default:
                // do nothing
            }
        }
    }

    _updateHighScores(highScores, resultRoll, type, total) {
        let newRecord = false;

        const highScore = highScores.find(score => score.dieCode === resultRoll.dice);

        if (highScore === undefined) {
            highScores.push(this._createNewHighScore(resultRoll, type, total));

            newRecord = true;
        } else {
            newRecord = this._updateHighScore(highScore, resultRoll, type, total);
        }

        return newRecord;
    }

    _createNewHighScore(resultRoll, type, total) {
        return {
            dieCode: resultRoll.dice,
            classicHighScore: type === TYPE_CLASSIC ? total : 0,
            legendHighScore: type === TYPE_LEGEND ? dieRoller.getTotalSuccesses(resultRoll) : 0,
            totalClassic: type === TYPE_CLASSIC ? total : 0,
            totalLegend: type === TYPE_LEGEND ? dieRoller.getTotalSuccesses(resultRoll) : 0,
            normalRolls: resultRoll.status === STATE_NORMAL ? 1 : 0,
            critSuccessRolls: resultRoll.status === STATE_CRITICAL_SUCCESS ? 1 : 0,
            critFailureRolls: resultRoll.status === STATE_CRITICAL_FAILURE ? 1 : 0,
            classicRolls: type === TYPE_CLASSIC ? 1 : 0,
            legendRolls: type === TYPE_LEGEND ? 1 : 0,
        };
    }

    _updateHighScore(highScore, resultRoll, type, total) {
        let newRecord = false;

        if (type === TYPE_CLASSIC) {
            highScore.totalClassic += total;
            highScore.classicRolls++;

            if (highScore.classicHighScore < total) {
                highScore.classicHighScore = total;

                newRecord = true;
            }
        } else if (type === TYPE_LEGEND) {
            const successes = dieRoller.getTotalSuccesses(resultRoll);

            highScore.totalLegend += successes;
            highScore.legendRolls++;

            if (highScore.legendHighScore < successes) {
                highScore.legendHighScore = successes;

                newRecord = true;
            }
        }

        if (resultRoll.status === STATE_NORMAL) {
            highScore.normalRolls++;
        } else if (resultRoll.status === STATE_CRITICAL_SUCCESS) {
            highScore.critSuccessRolls++;
        } else if (resultRoll.status === STATE_CRITICAL_FAILURE) {
            highScore.critFailureRolls++;
        }

        return newRecord;
    }
}

export let statistics = new Statistics();