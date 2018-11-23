import { AsyncStorage, Alert } from 'react-native';
import { STATE_NORMAL, STATE_CRITICAL_SUCCESS, STATE_CRITICAL_FAILURE } from './DieRoller';

// Equivalent of rolling 10,000 dice which the app can't do (Infinity was giving me grief)
export const CONTEXTUALLY_INFINITE = 60000;

class Statistics {
    async init() {
        await AsyncStorage.setItem('statistics', JSON.stringify({
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
                six: 0
            }
        }));
    }

    async add(resultRoll) {
        let stats = await AsyncStorage.getItem('statistics');
        stats = JSON.parse(stats);
        let rolls = this._getAllRolls(resultRoll);
        let total = rolls.reduce((a, b) => a + b, 0);

        stats.sum += total;
        stats.largestDieRoll = rolls.length > stats.largestDieRoll ? rolls.length : stats.largestDieRoll;
        stats.largestSum = total > stats.largestSum ? total : stats.largestSum;
        stats.diceRolled += rolls.length;

        if (resultRoll.status === STATE_CRITICAL_SUCCESS) {
            stats.bonusDiceRolled += resultRoll.bonusRolls.length;
            stats.bonusDiceTotal += resultRoll.bonusRolls.reduce((a, b) => a + b, 0);
            stats.criticalSuccesses++;
            stats.largestCriticalSuccess = total > stats.largestCriticalSuccess ? total : stats.largestCriticalSuccess;
            stats.lowestCriticalSuccess = total < stats.lowestCriticalSuccess ? total : stats.lowestCriticalSuccess;
        } else if (resultRoll.status === STATE_CRITICAL_FAILURE) {
            stats.penaltyDiceRolled++;
            stats.penaltyDiceTotal += rolls.length === 1 ? resultRoll.wildDieRoll : resultRoll.penaltyRoll;
            stats.criticalFailures++;
            stats.largestCriticalFailure = resultRoll.penaltyRoll > stats.largestCriticalFailure ? resultRoll.penaltyRoll : stats.largestCriticalFailure;

            if (rolls.length === 1) {
                stats.lowestCriticalFailure = resultRoll.wildDieRoll < stats.lowestCriticalFailure ? resultRoll.wildDieRoll : stats.lowestCriticalFailure;
            } else {
                stats.lowestCriticalFailure = resultRoll.penaltyRoll < stats.lowestCriticalFailure ? resultRoll.penaltyRoll : stats.lowestCriticalFailure;
            }
        }

        this._updateDistributions(rolls, stats.distributions);

        await AsyncStorage.setItem('statistics', JSON.stringify(stats));
    }

    _getAllRolls(resultRoll) {
        let rolls = resultRoll.rolls;
        rolls.push(resultRoll.wildDieRoll);

        if (resultRoll.status === STATE_CRITICAL_SUCCESS) {
            rolls.concat(resultRoll.bonusRolls)
        } else if (resultRoll.status === STATE_CRITICAL_FAILURE) {
            if (resultRoll.rolls.length > 1) {
                rolls.push(resultRoll.penaltyRoll);
            }
        }

        return rolls;
    }

    _updateDistributions(rolls, distributions) {
        for (let roll of rolls) {
            switch(roll) {
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
}

export let statistics = new Statistics();