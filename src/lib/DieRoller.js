const MIN = 1;

const MAX = 6;

export const STATE_NORMAL = 1;

export const STATE_CRITICAL_SUCCESS = 2;

export const STATE_CRITICAL_FAILURE = 3;

class DieRoller {
    roll(dice) {
        return this._roll(this._newResult(dice));
    }

    _roll(result) {
        let totalNormalRolls = result.dice - 1;
        result.wildDieRoll = this._rollDie();

        if (totalNormalRolls > 0) {
            for (let i = 0; i < totalNormalRolls; i++) {
                result.rolls.push(this._rollDie());
            }
        }

        if (result.wildDieRoll === MIN) {
            result.status = STATE_CRITICAL_FAILURE;

            if (totalNormalRolls > 0) {
                let maxIndex = this._maxIndex(result.rolls);

                result.penaltyRoll = result.rolls[maxIndex];
                result.rolls.splice(maxIndex, 1);
            }
        } else if (result.wildDieRoll === MAX) {
            result.status = STATE_CRITICAL_SUCCESS;

            let exploding = this._rollDie();

            do {
                result.bonusRolls.push(exploding);

                exploding = this._rollDie();
            } while (result.bonusRolls[result.bonusRolls.length - 1] === MAX)
        }

        return result;
    }

    _rollDie() {
        return Math.floor(Math.random() * MAX) + MIN;
    }

    _newResult(dice) {
        return {
            dice: dice,
            status: STATE_NORMAL,
            rolls: [],
            wildDieRoll: null,
            bonusRolls: [],
            penaltyRoll: null
        };
    }

    _maxIndex(rolls) {
        if (rolls.length === 0) {
            return -1;
        }

        let max = rolls[0];
        let maxIndex = 0;

        for (let i = 1; i < rolls.length; i++) {
            if (rolls[i] > max) {
                maxIndex = i;
                max = rolls[i];
            }
        }

        return maxIndex;
    }
}

export let dieRoller = new DieRoller();